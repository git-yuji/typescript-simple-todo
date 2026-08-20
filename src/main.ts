import "./style.css";
import type { Task } from "./task.ts";

// Task[] は「Task型の値だけを入れられる配列」という意味です。
// 保存データがない場合は、次の初期タスクを表示します。
const initialTasks: Task[] = [
  {
    id: "1",
    title: "TypeScriptの型を理解する",
    done: true,
    createdAt: "2026-08-17T09:00:00+09:00",
  },
  {
    id: "2",
    title: "Todoアプリを少しずつ作る",
    done: true,
    createdAt: "2026-08-17T09:10:00+09:00",
  },
  {
    id: "3",
    title: "Todoアプリを少しずつ作る",
    done: false,
    createdAt: "2026-08-17T09:10:00+09:00",
  },
];

const tasks: Task[] = loadTasks(initialTasks);

const app = document.querySelector<HTMLDivElement>("#app");

if (app === null) {
  throw new Error("#app が見つかりません。");
}

function saveTasks(taskList: Task[]): void {
  const taskListJson = JSON.stringify(taskList);
  localStorage.setItem("tasks", taskListJson);
}

function loadTasks(defaultTasks: Task[]): Task[] {
  const savedTasksJson = localStorage.getItem("tasks");

  if (savedTasksJson === null) {
    return defaultTasks;
  }

  const savedTasks = JSON.parse(savedTasksJson) as Task[];
  return savedTasks;
}

function deleteTask(taskId: string): void {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return;
  }

  tasks.splice(taskIndex, 1);
  saveTasks(tasks);
  renderTasks(tasks);
}

function createTaskElement(task: Task): HTMLLIElement {
  const item = document.createElement("li");
  item.className = task.done ? "task task--done" : "task";

  const mark = document.createElement("span");
  mark.className = "task__mark";
  mark.textContent = task.done ? "✓" : "";

  const title = document.createElement("span");
  title.className = "task__title";
  title.textContent = task.title;

  const deleteButton = document.createElement("button");
  deleteButton.className = "task__delete";
  deleteButton.type = "button";
  deleteButton.textContent = "削除";

  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    deleteTask(task.id);
  });

  item.append(mark, title, deleteButton);

  item.addEventListener("click", () => {
    task.done = !task.done;
    saveTasks(tasks);
    renderTasks(tasks);
  });

  return item;
}

function renderTasks(taskList: Task[]): void {
  const list = document.querySelector<HTMLUListElement>("#task-list");
  const count = document.querySelector<HTMLSpanElement>("#task-count");

  if (list === null || count === null) {
    throw new Error("タスクの表示先が見つかりません。");
  }

  list.replaceChildren(...taskList.map(createTaskElement));
  count.textContent = `${taskList.length}件`;
}

app.innerHTML = `
  <main class="app">
    <header class="app__header">
      <div>
        <p class="eyebrow">TYPESCRIPT LEARNING</p>
        <h1>Mini Todo</h1>
        <p class="subtitle">小さな機能から、ひとつずつ。</p>
      </div>
    </header>

    <form class="task-form">
      <input type="text" id="task-input" placeholder="新しいタスクを入力..." />
      <button type="submit">追加</button>
    </form>

    <section class="task-section" aria-labelledby="task-heading">
      <div class="section-heading">
        <h2 id="task-heading">タスク一覧</h2>
        <span id="task-count"></span>
      </div>
      <ul id="task-list" class="task-list"></ul>
    </section>
  </main>
`;

const taskForm = document.querySelector<HTMLFormElement>(".task-form");
const taskInput = document.querySelector<HTMLInputElement>("#task-input");
if (taskForm === null || taskInput === null) {
  throw new Error("フォームまたは入力欄が見つかりません。");
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();
  if (title === "") {
    return;
  }

  const newTask: Task = {
    id: crypto.randomUUID(),
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks(tasks);

  taskInput.value = "";
  taskInput.focus();
});

renderTasks(tasks);
