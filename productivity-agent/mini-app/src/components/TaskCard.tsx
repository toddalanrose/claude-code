const PRIORITY_CLASS: Record<string, string> = {
  Urgent: "priority-urgent",
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low",
};

interface Issue {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  priority: number;
  priorityLabel: string;
  state: string;
  dueDate: string | null;
  labels: string[];
  projectName: string | null;
  url: string;
}

export default function TaskCard({ issue }: { issue: Issue }) {
  const cls = PRIORITY_CLASS[issue.priorityLabel] ?? "priority-none";

  return (
    <a
      className="task-card"
      href={issue.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
    >
      <div className="task-card-header">
        <span className="task-card-title">{issue.title}</span>
        <span className={`priority-badge ${cls}`}>{issue.priorityLabel}</span>
      </div>

      <div className="task-card-meta">
        <span>{issue.identifier}</span>
        <span>{issue.state}</span>
        {issue.projectName && <span>{issue.projectName}</span>}
        {issue.dueDate && <span>Due {issue.dueDate}</span>}
      </div>

      {issue.labels.length > 0 && (
        <div className="task-labels">
          {issue.labels.map((l) => (
            <span key={l} className="label-chip">
              {l}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
