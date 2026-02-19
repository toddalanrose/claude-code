import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "cleanup old conversations",
  { hourUTC: 4, minuteUTC: 0 },
  internal.cleanupActions.deleteOldConversations,
);

export default crons;
