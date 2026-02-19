import { config } from "../config.js";
import type { InlineKeyboardMarkup } from "../types.js";

export function analysisKeyboard(): InlineKeyboardMarkup {
  const rows = [
    [
      { text: "Tell me more", callback_data: "elaborate" },
      { text: "Show runner-up", callback_data: "runner_up" },
    ],
    [
      { text: "I disagree", callback_data: "disagree" },
      { text: "🔄 Refresh", callback_data: "refresh" },
    ],
  ];

  if (config.miniAppUrl) {
    rows.push([{ text: "📊 Open Dashboard", web_app: { url: config.miniAppUrl } }]);
  }

  return { inline_keyboard: rows };
}

export function disagreeKeyboard(): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: "I'm blocked on it", callback_data: "disagree_blocked" },
        { text: "Something else came up", callback_data: "disagree_new" },
      ],
      [
        { text: "It's already done", callback_data: "disagree_done" },
        { text: "Let me explain...", callback_data: "disagree_freeform" },
      ],
    ],
  };
}
