"use client";

import { SummaryCard } from "@/app/components/dashboard/summary-card";

function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
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
        icon={<CheckCircleIcon />}
        iconClassName="text-success"
        iconBackgroundClassName="bg-success/10"
      />

      <SummaryCard
        title="To Do"
        value={todoTasks}
        icon={<ClipboardIcon />}
        iconClassName="text-primary"
        iconBackgroundClassName="bg-primary/10"
      />

      <SummaryCard
        title="In Progress"
        value={inProgressTasks}
        icon={<ClockIcon />}
        iconClassName="text-warning"
        iconBackgroundClassName="bg-warning/10"
      />

      <SummaryCard
        title="Completed"
        value={completedTasks}
        icon={<CheckCircleIcon />}
        iconClassName="text-success"
        iconBackgroundClassName="bg-success/10"
      />
    </section>
  );
}