import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  PhoneOff,
  Video,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { videoService } from "../services/VideoService";

export function VideoConsultationRoom() {
  const navigate = useNavigate();
  const { appointmentId = "" } = useParams();
  const [role, setRole] = useState<"doctor" | "patient" | null>(null);
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [connectionLabel, setConnectionLabel] = useState("Waiting to enable camera and microphone");
  const [remoteJoined, setRemoteJoined] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const pollingRef = useRef<number | null>(null);
  const cursorRef = useRef(0);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
      }

      if (peerRef.current) {
        peerRef.current.close();
      }

      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const attachRemoteStream = (stream: MediaStream) => {
    remoteStreamRef.current = stream;

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
    }
  };

  const ensureMedia = async () => {
    if (localStreamRef.current) {
      return localStreamRef.current;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    localStreamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    return stream;
  };

  const postSignal = async (type: string, payload: any = {}) => {
    await videoService.postEvent(appointmentId, type, payload);
  };

  const handleRemoteOffer = async (payload: RTCSessionDescriptionInit) => {
    if (!peerRef.current) {
      return;
    }

    if (!peerRef.current.currentRemoteDescription) {
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(payload));
    }

    while (pendingCandidatesRef.current.length) {
      const nextCandidate = pendingCandidatesRef.current.shift();

      if (nextCandidate) {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(nextCandidate));
      }
    }

    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);
    await postSignal("answer", answer);
    setConnectionLabel("Answer sent. Connecting secure video room...");
  };

  const handleRemoteAnswer = async (payload: RTCSessionDescriptionInit) => {
    if (!peerRef.current || peerRef.current.currentRemoteDescription) {
      return;
    }

    await peerRef.current.setRemoteDescription(new RTCSessionDescription(payload));

    while (pendingCandidatesRef.current.length) {
      const nextCandidate = pendingCandidatesRef.current.shift();

      if (nextCandidate) {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(nextCandidate));
      }
    }

    setConnectionLabel("Patient and doctor are now connected.");
  };

  const handleRemoteCandidate = async (payload: RTCIceCandidateInit) => {
    if (!peerRef.current) {
      return;
    }

    if (!peerRef.current.currentRemoteDescription) {
      pendingCandidatesRef.current.push(payload);
      return;
    }

    try {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(payload));
    } catch (_error) {
      // Ignore duplicate or early ICE candidates during initial polling.
    }
  };

  const pollEvents = async () => {
    try {
      const response = await videoService.getEvents(appointmentId, cursorRef.current);

      for (const event of response.events) {
        cursorRef.current = Math.max(cursorRef.current, event.id);

        if (event.type === "participant-ready") {
          setRemoteJoined(true);
          setConnectionLabel("The other participant is ready. Preparing the consultation room...");
        }

        if (event.type === "offer") {
          await handleRemoteOffer(event.payload);
        }

        if (event.type === "answer") {
          await handleRemoteAnswer(event.payload);
        }

        if (event.type === "candidate") {
          await handleRemoteCandidate(event.payload);
        }

        if (event.type === "call-ended") {
          setCallEnded(true);
          setConnectionLabel("The consultation was ended by the other participant.");
        }
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to sync consultation events.");
    }
  };

  const joinConsultation = async () => {
    try {
      setIsJoining(true);
      setError("");
      setCallEnded(false);

      const stream = await ensureMedia();
      const response = await videoService.join(appointmentId);
      setRole(response.role);

      const peer = new RTCPeerConnection(response.rtcConfiguration);
      peerRef.current = peer;

      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      peer.ontrack = (event) => {
        const [remoteStream] = event.streams;

        if (remoteStream) {
          attachRemoteStream(remoteStream);
          setRemoteJoined(true);
          setConnectionLabel("Live consultation connected.");
        }
      };

      peer.onicecandidate = async (event) => {
        if (event.candidate) {
          await postSignal("candidate", event.candidate.toJSON());
        }
      };

      peer.onconnectionstatechange = () => {
        if (!peerRef.current) {
          return;
        }

        const state = peerRef.current.connectionState;

        if (state === "connected") {
          setConnectionLabel("Live consultation connected.");
        } else if (state === "connecting") {
          setConnectionLabel("Connecting doctor and patient...");
        } else if (state === "failed") {
          setConnectionLabel("Connection interrupted. Retrying secure consultation link...");
        }
      };

      if (response.role === "doctor") {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        await postSignal("offer", offer);
        setConnectionLabel("Doctor room started. Waiting for patient to join...");
      } else {
        setConnectionLabel("Patient room ready. Waiting for doctor to start the call...");
      }

      await pollEvents();

      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
      }

      pollingRef.current = window.setInterval(() => {
        void pollEvents();
      }, 1200);

      setHasJoined(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to start the consultation room.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleEndCall = async () => {
    try {
      await postSignal("call-ended", {
        role,
      });
    } catch (_error) {
      // Swallow network errors on exit to avoid trapping the user in the room.
    }

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    remoteStreamRef.current?.getTracks().forEach((track) => track.stop());
    peerRef.current?.close();
    navigate(role === "doctor" ? "/doctor/appointments" : "/dashboard");
  };

  const toggleAudio = () => {
    const next = !isMicEnabled;
    setIsMicEnabled(next);
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = next;
    });
  };

  const toggleVideo = () => {
    const next = !isCameraEnabled;
    setIsCameraEnabled(next);
    localStreamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = next;
    });
  };

  return (
    <div className="h-full bg-[#020617]">
      <div className="relative flex h-full flex-col">
        {error ? (
          <div className="absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border border-red-500/30 bg-red-500/15 px-4 py-2 text-sm text-red-100 shadow-lg shadow-red-950/30 backdrop-blur">
            {error}
          </div>
        ) : null}

        {hasJoined || isJoining || callEnded ? (
          <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm text-white/85 backdrop-blur">
            {callEnded ? "Consultation ended" : connectionLabel}
          </div>
        ) : null}

        <div className="grid h-full flex-1 grid-rows-2 gap-2 p-2 md:grid-cols-2 md:grid-rows-1 md:gap-4 md:p-4">
          <div className="relative min-h-0 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl shadow-black/30">
            <video ref={localVideoRef} autoPlay muted playsInline className="h-full w-full bg-slate-950 object-cover" />
            {!hasJoined ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(14,165,164,0.18),_transparent_50%),#020617] px-6 text-center text-sm text-slate-300">
                Your camera feed will appear here when you join the consultation.
              </div>
            ) : null}
            <div className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur">
              {role === "doctor" ? "Doctor" : "You"}
            </div>
          </div>

          <div className="relative min-h-0 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl shadow-black/30">
            {remoteJoined ? (
              <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full bg-slate-950 object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%),#020617] px-6 text-center text-sm text-slate-300">
                Waiting for the other participant to join.
              </div>
            )}
            <div className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur">
              {role === "doctor" ? "Patient" : "Doctor"}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-6">
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/10 bg-black/50 px-4 py-3 shadow-2xl shadow-black/35 backdrop-blur-xl">
            <Button
              onClick={toggleAudio}
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
              disabled={!hasJoined}
            >
              {isMicEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            <Button
              onClick={toggleVideo}
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
              disabled={!hasJoined}
            >
              {isCameraEnabled ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
            </Button>
            {!hasJoined ? (
              <Button
                onClick={joinConsultation}
                disabled={isJoining}
                className="h-12 rounded-full bg-cyan-500 px-5 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-400"
              >
                <Video className={`h-4 w-4 ${isJoining ? "animate-pulse" : ""}`} />
                {isJoining ? "Joining..." : "Join Video Call"}
              </Button>
            ) : (
              <Button
                onClick={handleEndCall}
                className="h-12 rounded-full bg-red-600 px-5 text-white shadow-lg shadow-red-500/20 hover:bg-red-500"
              >
                <PhoneOff className="h-4 w-4" />
                End Call
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
