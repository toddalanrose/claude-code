import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { getTelegram } from "./telegram";
import TaskCard from "./components/TaskCard";
import ChatView from "./components/ChatView";
import InsightsView from "./components/InsightsView";
import "./styles.css";

type Tab = "tasks" | "chat" | "insights";

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function Loading() {
  return (
    <div className="loading">
      <div className="loading-dot" />
      <div className="loading-dot" />
      <div className="loading-dot" />
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("tasks");
  const [date] = useState(todayDate);

  const conversation = useQuery(api.conversations.getByDate, { date });

  useEffect(() => {
    const tg = getTelegram();
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  const issues = conversation?.issues ?? [];
  const messages = conversation?.messages ?? [];

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-icon">&#10024;</div>
        <div className="header-text">
          <h1>Nova</h1>
          <p>Your AI productivity assistant</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {(["tasks", "chat", "insights"] as const).map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t[0]!.toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="content">
        {conversation === undefined ? (
          <Loading />
        ) : tab === "tasks" ? (
          issues.length > 0 ? (
            issues.map((issue) => <TaskCard key={issue.id} issue={issue} />)
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">&#128203;</div>
              <p>No tasks for today yet. Nova will sync your issues when the day begins.</p>
            </div>
          )
        ) : tab === "chat" ? (
          messages.length > 0 ? (
            <ChatView messages={messages} date={date} />
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">&#128172;</div>
              <p>No conversation yet today. Chat with Nova on Telegram to get started.</p>
            </div>
          )
        ) : (
          issues.length > 0 ? (
            <InsightsView issues={issues} />
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">&#128200;</div>
              <p>Insights will appear once tasks are synced.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
