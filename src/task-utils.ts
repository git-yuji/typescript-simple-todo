import type { Task } from "./task.ts";

export type TaskFilter = "all" | "active" | "completed";

export function updateTaskTitle(
  taskList: Task[],
  taskId: string,
  editedTitle: string,
): boolean {
  const task = taskList.find((currentTask) => currentTask.id === taskId);
  const title = editedTitle.trim();

  if (task === undefined || title === "") {
    return false;
  }

  task.title = title;
  return true;
}

export function getFilteredTasks(
  taskList: Task[],
  filter: TaskFilter,
): Task[] {
  if (filter === "active") {
    return taskList.filter((task) => !task.done);
  }

  if (filter === "completed") {
    return taskList.filter((task) => task.done);
  }

  return taskList;
}
