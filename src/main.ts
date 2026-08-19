import "./style.css";
import type { Task } from "./task.ts";

// Task[] は「Task型の値だけを入れられる配列」という意味です。
// まずは保存機能を使わず、固定データの描画から始めます。
const tasks: Task[] = [
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

const app = document.querySelector<HTMLDivElement>("#app");

if (app === null) {
  throw new Error("#app が見つかりません。");
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

  item.append(mark, title);

  item.addEventListener("click", () => {
    task.done = !task.done;
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
  renderTasks(tasks);

  taskInput.value = "";
  taskInput.focus();
});

renderTasks(tasks);
