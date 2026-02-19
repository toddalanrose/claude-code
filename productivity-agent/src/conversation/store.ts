import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api.js";
import { config } from "../config.js";
import type { DailyConversation, NormalizedIssue, ConversationMessage } from "../types.js";

const client = new ConvexHttpClient(config.convexUrl);

function todayDate(): string {
  return new Date().toISOString().split("T")[0] as string;
}

export async function getToday(): Promise<DailyConversation | null> {
  const doc = await client.query(api.conversations.getByDate, {
    date: todayDate(),
  });
  if (!doc) return null;
  return {
    date: doc.date,
    issues: doc.issues,
    messages: doc.messages,
    createdAt: doc.createdAt,
  };
}

export async function startNewDay(
  issues: NormalizedIssue[],
  analysisText: string
): Promise<void> {
  await client.mutation(api.conversations.startNewDay, {
    date: todayDate(),
    issues,
    messages: [
      {
        role: "assistant" as const,
        content: analysisText,
        timestamp: Date.now(),
      },
    ],
    createdAt: Date.now(),
  });
}

export async function addMessage(
  role: "user" | "assistant",
  content: string
): Promise<void> {
  await client.mutation(api.conversations.addMessage, {
    date: todayDate(),
    message: { role, content, timestamp: Date.now() },
  });
}

export async function resetToday(): Promise<void> {
  await client.mutation(api.conversations.deleteByDate, {
    date: todayDate(),
  });
}

export async function getMessages(): Promise<ConversationMessage[]> {
  const conversation = await getToday();
  return conversation?.messages ?? [];
}

export async function getIssues(): Promise<NormalizedIssue[]> {
  const conversation = await getToday();
  return conversation?.issues ?? [];
}
