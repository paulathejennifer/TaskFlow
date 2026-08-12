import { SummaryCard } from "@/app/components/dashboard/summary-card";

function CompletedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function TodoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 2h6v4H9z" />
      <path d="M9 10h6M9 14h6M9 18h3" />
    </svg>
  );
}

function InProgressIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

interface DashboardSummaryProps {
  totalTasks: number;
  completedTasks: number;
  todoTasks: number;
  inProgressTasks: number;
}

export function DashboardSummary({
  totalTasks,
  completedTasks,
  todoTasks,
  inProgressTasks,
}: DashboardSummaryProps) {
  const completionPercentage =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  return (
    <section
      aria-label="Task summary"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <SummaryCard
        title="Tasks Completed"
        value={`${completedTasks} / ${totalTasks}`}
        description={`${completionPercentage}% completed`}
        progress={completionPercentage}
        progressClassName="bg-success"
        icon={<CompletedIcon />}
        iconClassName="text-success"
        iconBackgroundClassName="bg-success/10"
      />

      <SummaryCard
        title="To Do"
        value={todoTasks}
        icon={<TodoIcon />}
        iconClassName="text-primary"
        iconBackgroundClassName="bg-primary/10"
      />

      <SummaryCard
        title="In Progress"
        value={inProgressTasks}
        icon={<InProgressIcon />}
        iconClassName="text-warning"
        iconBackgroundClassName="bg-warning/10"
      />

      <SummaryCard
        title="Completed"
        value={completedTasks}
        icon={<CompletedIcon />}
        iconClassName="text-success"
        iconBackgroundClassName="bg-success/10"
      />
    </section>
  );
}