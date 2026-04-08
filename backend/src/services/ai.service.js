import OpenAI from "openai";
import { env } from "../config/env.js";

const client = env.openAiApiKey ? new OpenAI({ apiKey: env.openAiApiKey }) : null;

function fallbackDoctorAssessment(issue) {
  const input = issue.toLowerCase();

  if (input.includes("fever") || input.includes("cold") || input.includes("cough") || input.includes("sore throat")) {
    return {
      summary:
        "This sounds like a mild respiratory illness pattern. Focus on hydration, rest, and short-term symptom relief while monitoring breathing and fever.",
      specialist: "General Physician",
      response:
        "This sounds like a cold or viral fever pattern. I would focus on fluids, rest, and simple relief options while watching closely for red-flag symptoms like breathing trouble or chest pain.",
      medicines: [
        {
          name: "Paracetamol / Acetaminophen",
          purpose: "May help reduce fever, headache, and body aches.",
          caution: "Use exactly as labeled and avoid doubling up with combination cold medicines.",
        },
        {
          name: "Cetirizine",
          purpose: "May help sneezing or a runny nose.",
          caution: "Can cause drowsiness in some people.",
        },
      ],
      selfCare: [
        "Drink fluids regularly.",
        "Rest and limit heavy activity.",
        "Monitor fever, cough, and breathing symptoms.",
      ],
      urgentWarning:
        "Get urgent medical care for chest pain, trouble breathing, confusion, severe dehydration, or a very high or persistent fever.",
    };
  }

  if (input.includes("headache") || input.includes("migraine")) {
    return {
      summary:
        "This could fit a tension headache or migraine pattern, but the severity and associated symptoms matter.",
      specialist: "General Physician or Neurologist",
      response:
        "Short-term pain relief, hydration, and rest may help, but repeated or severe headaches need an in-person review.",
      medicines: [
        {
          name: "Paracetamol / Acetaminophen",
          purpose: "May help mild headache discomfort.",
          caution: "Do not exceed the label dose or combine duplicate products.",
        },
        {
          name: "Ibuprofen",
          purpose: "May help inflammation-linked or tension headaches.",
          caution: "Avoid if you have kidney issues, stomach ulcers, or clinician advice against NSAIDs.",
        },
      ],
      selfCare: [
        "Rest in a quiet room.",
        "Drink fluids.",
        "Track triggers such as missed sleep or stress.",
      ],
      urgentWarning:
        "Seek urgent care for a sudden severe headache, weakness, fainting, confusion, seizure, or vision changes.",
    };
  }

  return {
    summary:
      "More detail would help narrow this down, but you can still start with symptom monitoring and basic relief steps.",
    specialist: "General Physician",
    response:
      "Tell me where the pain or discomfort is, how long it has lasted, and whether there is fever, cough, vomiting, swelling, rash, or dizziness.",
    medicines: [
      {
        name: "Symptom-based OTC relief",
        purpose: "Use only a medicine that clearly matches the symptom you are trying to relieve.",
        caution: "Avoid antibiotics, steroids, or prescription-only medicines without a clinician.",
      },
    ],
    selfCare: [
      "Track how long symptoms have lasted.",
      "Note the severity and any triggers.",
      "Escalate to a doctor if symptoms worsen or do not improve.",
    ],
    urgentWarning:
      "Seek urgent care if symptoms are severe, sudden, affect breathing, or involve dehydration or confusion.",
  };
}

export async function generateAiDoctorAssessment(issue) {
  if (!client) {
    return fallbackDoctorAssessment(issue);
  }

  try {
    const response = await client.responses.create({
      model: env.openAiModel,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are the MEDIrxCARE Care Guide, a cautious healthcare assistant. Provide educational guidance only. Never prescribe antibiotics, steroids, narcotics, or diagnosis certainty. Always include emergency red flags, recommend professional review when appropriate, and keep medicine suggestions limited to common OTC or general supportive options with cautions.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Patient concern: ${issue}`,
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "medirxcare_ai_doctor_assessment",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: { type: "string" },
              specialist: { type: "string" },
              response: { type: "string" },
              medicines: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    name: { type: "string" },
                    purpose: { type: "string" },
                    caution: { type: "string" },
                  },
                  required: ["name", "purpose", "caution"],
                },
              },
              selfCare: {
                type: "array",
                items: { type: "string" },
              },
              urgentWarning: { type: "string" },
            },
            required: ["summary", "specialist", "response", "medicines", "selfCare", "urgentWarning"],
          },
        },
      },
    });

    return JSON.parse(response.output_text);
  } catch (error) {
    console.error("OpenAI care guide request failed, falling back to local logic.", error);
    return fallbackDoctorAssessment(issue);
  }
}

export async function generateChatbotReply({ message, history = [], role = "patient" }) {
  if (!client) {
    const assessment = fallbackDoctorAssessment(message);
    return `${assessment.response} Suggested next doctor: ${assessment.specialist}. Emergency note: ${assessment.urgentWarning}`;
  }

  try {
    const contextTranscript = history
      .slice(-6)
      .map((entry) => `${entry.sender === "user" ? "User" : "Assistant"}: ${entry.text}`)
      .join("\n");

    const response = await client.responses.create({
      model: env.openAiModel,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are MEDIrxCARE Assist, a healthcare product assistant. Help with appointments, doctor discovery, reports, queues, and basic care guidance. Give concise answers, avoid definitive diagnoses, and always advise professional review for serious or persistent symptoms.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Role: ${role}\nRecent conversation:\n${contextTranscript}\n\nLatest user message: ${message}`,
            },
          ],
        },
      ],
    });

    return response.output_text;
  } catch (error) {
    console.error("OpenAI chatbot request failed, falling back to local logic.", error);
    const assessment = fallbackDoctorAssessment(message);
    return `${assessment.response} Suggested next doctor: ${assessment.specialist}.`;
  }
}
