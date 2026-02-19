import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

const messageValidator = v.object({
  role: v.union(v.literal("user"), v.literal("assistant")),
  content: v.string(),
  timestamp: v.number(),
});

const issueValidator = v.object({
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

export const getByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .unique();
  },
});

export const startNewDay = mutation({
  args: {
    date: v.string(),
    issues: v.array(issueValidator),
    messages: v.array(messageValidator),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
    await ctx.db.insert("conversations", {
      date: args.date,
      issues: args.issues,
      messages: args.messages,
      createdAt: args.createdAt,
    });
  },
});

export const addMessage = mutation({
  args: {
    date: v.string(),
    message: messageValidator,
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .unique();
    if (!conversation) return;
    await ctx.db.patch(conversation._id, {
      messages: [...conversation.messages, args.message],
    });
  },
});

export const deleteByDate = mutation({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .unique();
    if (conversation) {
      await ctx.db.delete(conversation._id);
    }
  },
});

export const deleteOlderThan = internalMutation({
  args: { beforeDate: v.string() },
  handler: async (ctx, args) => {
    const old = await ctx.db
      .query("conversations")
      .withIndex("by_date", (q) => q.lt("date", args.beforeDate))
      .collect();
    for (const doc of old) {
      await ctx.db.delete(doc._id);
    }
  },
});
