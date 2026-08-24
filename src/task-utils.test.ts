import { describe, expect, test } from "vitest";
import type { Task } from "./task.ts";
import { getFilteredTasks, updateTaskTitle } from "./task-utils.ts";

function createTask(id: string, title: string, done = false): Task {
  return {
    id,
    title,
    done,
    createdAt: "2026-08-24T09:00:00+09:00",
  };
}

describe("updateTaskTitle", () => {
  test("指定したタスクのタイトルを更新する", () => {
    // Arrange（準備）
    const tasks = [createTask("1", "変更前")];

    // Act（実行）
    const result = updateTaskTitle(tasks, "1", "  変更後  ");

    // Assert（確認）
    expect(result).toBe(true);
    expect(tasks[0]?.title).toBe("変更後");
  });

  test("空文字ではタイトルを更新しない", () => {
    const tasks = [createTask("1", "変更前")];

    const result = updateTaskTitle(tasks, "1", "   ");

    expect(result).toBe(false);
    expect(tasks[0]?.title).toBe("変更前");
  });
});

describe("getFilteredTasks", () => {
  const tasks = [
    createTask("1", "未完了のタスク"),
    createTask("2", "完了したタスク", true),
  ];

  test("未完了のタスクだけを取得する", () => {
    const result = getFilteredTasks(tasks, "active");

    expect(result).toEqual([tasks[0]]);
  });

  test("完了したタスクだけを取得する", () => {
    const result = getFilteredTasks(tasks, "completed");

    expect(result).toEqual([tasks[1]]);
  });
});
