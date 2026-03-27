import mongoose from "mongoose";

const queueEntrySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    scheduledFor: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "serving", "completed"],
      default: "waiting",
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  },
);

export const QueueEntry = mongoose.models.QueueEntry || mongoose.model("QueueEntry", queueEntrySchema);
