import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const normalizedIssueValidator = v.object({
  id: v.string(),
  identifier: v.string(),
  title: v.string(),
  description: v.union(v.string(), v.null()),
  priority: v.number(),
  priorityLabel: v.string(),
  state: v.string(),
  dueDate: v.union(v.string(), v.null()),
  estimate: v.union(v.number(), v.null()),
  labels: v.array(v.string()),
  projectName: v.union(v.string(), v.null()),
  url: v.string(),
  createdAt: v.string(),
  updatedAt: v.string(),
});

const conversationMessageValidator = v.object({
  role: v.union(v.literal("user"), v.literal("assistant")),
  content: v.string(),
  timestamp: v.number(),
});

export default defineSchema({
  conversations: defineTable({
    date: v.string(),
    issues: v.array(normalizedIssueValidator),
    messages: v.array(conversationMessageValidator),
    createdAt: v.number(),
  }).index("by_date", ["date"]),
});
