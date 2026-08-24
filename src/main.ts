import "./style.css";
import type { Task } from "./task.ts";

// Task[] は「Task型の値だけを入れられる配列」という意味です。
// 保存データがない場合は、次の初期タスクを表示します。

type TaskFilter = "all" | "active" | "completed";

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

let currentFilter: TaskFilter = "all";

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

function updateTaskTitle(taskId: string, editedTitle: string): boolean {
  const task = tasks.find((task) => task.id === taskId);

  if (task === undefined) {
    return false;
  }

  const title = editedTitle.trim();

  if (title === "") {
    return false;
  }

  task.title = title;
  saveTasks(tasks);
  renderTasks(tasks);
  return true;
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

  const editButton = document.createElement("button");
  editButton.className = "task__edit";
  editButton.type = "button";
  editButton.textContent = "編集";

  editButton.addEventListener("click", (event) => {
    event.stopPropagation();

    item.classList.add("task--editing");

    const editForm = document.createElement("form");
    editForm.className = "task__edit-form";

    const editInput = document.createElement("input");
    editInput.className = "task__edit-input";
    editInput.type = "text";
    editInput.value = task.title;
    editInput.setAttribute("aria-label", "タスク名を編集");

    const saveButton = document.createElement("button");
    saveButton.className = "task__save";
    saveButton.type = "submit";
    saveButton.textContent = "保存";

    const cancelButton = document.createElement("button");
    cancelButton.className = "task__cancel";
    cancelButton.type = "button";
    cancelButton.textContent = "キャンセル";

    editForm.append(editInput, saveButton, cancelButton);
    title.replaceWith(editForm);
    editButton.hidden = true;
    deleteButton.hidden = true;

    editForm.addEventListener("click", (formEvent) => {
      formEvent.stopPropagation();
    });

    editForm.addEventListener("submit", (formEvent) => {
      formEvent.preventDefault();
      formEvent.stopPropagation();

      if (!updateTaskTitle(task.id, editInput.value)) {
        editInput.setCustomValidity("タスク名を入力してください。");
        editInput.reportValidity();
      }
    });

    const cancelEditing = (): void => {
      editForm.replaceWith(title);
      editButton.hidden = false;
      deleteButton.hidden = false;
      item.classList.remove("task--editing");
      editButton.focus();
    };

    cancelButton.addEventListener("click", cancelEditing);

    editInput.addEventListener("input", () => {
      editInput.setCustomValidity("");
    });

    editInput.addEventListener("keydown", (keyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        keyboardEvent.preventDefault();
        cancelEditing();
      }
    });

    editInput.focus();
    editInput.select();
  });

  const deleteButton = document.createElement("button");
  deleteButton.className = "task__delete";
  deleteButton.type = "button";
  deleteButton.textContent = "削除";

  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    deleteTask(task.id);
  });

  item.append(mark, title, editButton, deleteButton);

  item.addEventListener("click", () => {
    if (item.classList.contains("task--editing")) {
      return;
    }

    task.done = !task.done;
    saveTasks(tasks);
    renderTasks(tasks);
  });

  return item;
}

function getFilteredTasks(taskList: Task[]): Task[] {
  if (currentFilter === "active") {
    return taskList.filter((task) => !task.done);
  }

  if (currentFilter === "completed") {
    return taskList.filter((task) => task.done);
  }

  return taskList;
}

function renderTasks(taskList: Task[]): void {
  const list = document.querySelector<HTMLUListElement>("#task-list");
  const count = document.querySelector<HTMLSpanElement>("#task-count");

  if (list === null || count === null) {
    throw new Error("タスクの表示先が見つかりません。");
  }

  const filteredTasks = getFilteredTasks(taskList);

  list.replaceChildren(...filteredTasks.map(createTaskElement));
  count.textContent = `${filteredTasks.length}件`;
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

    <div class="task-filters" aria-label="タスクの絞り込み">
      <button type="button" class="is-active" data-filter="all">すべて</button>
      <button type="button" data-filter="active">未完了</button>
      <button type="button" data-filter="completed">完了</button>
    </div>

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
const filterButtons = document.querySelectorAll<HTMLButtonElement>(
  ".task-filters button",
);
if (taskForm === null || taskInput === null) {
  throw new Error("フォームまたは入力欄が見つかりません。");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    if (filter !== "all" && filter !== "active" && filter !== "completed") {
      return;
    }

    currentFilter = filter;

    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;

      filterButton.classList.toggle("is-active", isSelected);
    });

    renderTasks(tasks);
  });
});

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
