interface Issue {
  priority: number;
  priorityLabel: string;
  state: string;
}

export default function InsightsView({ issues }: { issues: Issue[] }) {
  const total = issues.length;
  const urgent = issues.filter((i) => i.priorityLabel === "Urgent").length;
  const high = issues.filter((i) => i.priorityLabel === "High").length;
  const medium = issues.filter((i) => i.priorityLabel === "Medium").length;

  const states: Record<string, number> = {};
  for (const issue of issues) {
    states[issue.state] = (states[issue.state] ?? 0) + 1;
  }

  return (
    <div>
      <div className="insight-card">
        <h3>Priority Breakdown</h3>
        <div className="stat-row">
          <span className="stat-label">Total Issues</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Urgent</span>
          <span className="stat-value urgent">{urgent}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">High</span>
          <span className="stat-value high">{high}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Medium</span>
          <span className="stat-value medium">{medium}</span>
        </div>
      </div>

      <div className="insight-card">
        <h3>By Status</h3>
        {Object.entries(states)
          .sort(([, a], [, b]) => b - a)
          .map(([state, count]) => (
            <div className="stat-row" key={state}>
              <span className="stat-label">{state}</span>
              <span className="stat-value">{count}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
