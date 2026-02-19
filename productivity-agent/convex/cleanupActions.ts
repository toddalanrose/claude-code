import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const deleteOldConversations = internalAction({
  args: {},
  handler: async (ctx) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const beforeDate = cutoff.toISOString().split("T")[0] as string;
    await ctx.runMutation(internal.conversations.deleteOlderThan, {
      beforeDate,
    });
  },
});
