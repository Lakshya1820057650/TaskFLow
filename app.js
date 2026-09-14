const API_BASE = "/api/tasks";

const form = document.getElementById("task-form");
const taskIdField = document.getElementById("task-id");
const titleField = document.getElementById("title");
const descField = document.getElementById("description");
const statusField = document.getElementById("status");
const priorityField = document.getElementById("priority");
const dueDateField = document.getElementById("dueDate");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formTitle = document.getElementById("form-title");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search");
const filterStatus = document.getElementById("filter-status");

async function fetchTasks() {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.append("search", searchInput.value.trim());
  if (filterStatus.value) params.append("status", filterStatus.value);

  const res = await fetch(`${API_BASE}?${params.toString()}`);
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  taskList.innerHTML = "";
  if (tasks.length === 0) {
    taskList.innerHTML = `<div class="empty-state">No tasks yet. Add one above.</div>`;
    return;
  }

  tasks.forEach(task => {
    const item = document.createElement("div");
    item.className = "task-item";
    item.innerHTML = `
      <div class="info">
        <h3>${escapeHtml(task.title)}</h3>
        <p>${escapeHtml(task.description || "")}</p>
        <span class="badge ${task.status}">${task.status.replace("_", " ")}</span>
        <span class="badge ${task.priority}">${task.priority}</span>
        ${task.dueDate ? `<span style="font-size:12px;color:#777;">Due: ${task.dueDate}</span>` : ""}
      </div>
      <div class="actions">
        <button class="edit-btn" data-id="${task.id}">Edit</button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;
    taskList.appendChild(item);
  });

  document.querySelectorAll(".edit-btn").forEach(btn =>
    btn.addEventListener("click", () => startEdit(btn.dataset.id))
  );
  document.querySelectorAll(".delete-btn").forEach(btn =>
    btn.addEventListener("click", () => deleteTask(btn.dataset.id))
  );
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    title: titleField.value.trim(),
    description: descField.value.trim(),
    status: statusField.value,
    priority: priorityField.value,
    dueDate: dueDateField.value || null
  };

  const id = taskIdField.value;
  const isEdit = !!id;

  const res = await fetch(isEdit ? `${API_BASE}/${id}` : API_BASE, {
    method: isEdit ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json();
    alert("Error: " + (err.message || JSON.stringify(err.fieldErrors)));
    return;
  }

  resetForm();
  fetchTasks();
});

async function startEdit(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  const task = await res.json();

  taskIdField.value = task.id;
  titleField.value = task.title;
  descField.value = task.description || "";
  statusField.value = task.status;
  priorityField.value = task.priority;
  dueDateField.value = task.dueDate || "";

  formTitle.textContent = "Edit Task";
  submitBtn.textContent = "Save Changes";
  cancelBtn.classList.remove("hidden");
}

async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  fetchTasks();
}

cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  form.reset();
  taskIdField.value = "";
  formTitle.textContent = "Add Task";
  submitBtn.textContent = "Add Task";
  cancelBtn.classList.add("hidden");
}

searchInput.addEventListener("input", debounce(fetchTasks, 300));
filterStatus.addEventListener("change", fetchTasks);

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

fetchTasks();
