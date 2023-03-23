const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const form = document.getElementById("addForm");
const taskInput = document.getElementById("newTask");
const taskList = document.getElementById("taskList");

let draggedTask = null;

function addTask(e) {
  e.preventDefault();
  let task = taskInput.value.trim();
  if (task === "") {
    alert("Enter task");
    return;
  }
  tasks.push({ name: task, completed: false });
  updateTasks();
  form.reset();
}

function removeTask(index) {
  tasks.splice(index, 1);
  updateTasks();
}

function editTask(index) {
  let task = tasks[index];
  let newTask = prompt("Edit task", task.name);
  if (newTask === null || newTask.trim() === "") {
    return;
  }
  task.name = newTask;
  updateTasks();
}

function moveTaskUp(index) {
  if (index === 0) {
    return;
  }
  [tasks[index - 1], tasks[index]] = [tasks[index], tasks[index - 1]];
  updateTasks();
}

function moveTaskDown(index) {
  if (index === tasks.length - 1) {
    return;
  }
  [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
  updateTasks();
}

function completeTask(index) {
  tasks[index].completed = !tasks[index].completed;
  updateTasks();
}

function updateTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskList.innerHTML = "";
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let li = document.createElement("li");
    li.draggable = true;
    li.addEventListener("dragstart", function (e) {
      draggedTask = i;
      e.dataTransfer.setData("text/plain", "");
    });
    li.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    li.addEventListener("drop", function (e) {
      let dropIndex = i;
      if (draggedTask < dropIndex) {
        dropIndex--;
      }
      let [task] = tasks.splice(draggedTask, 1);
      tasks.splice(dropIndex, 0, task);
      updateTasks();
    });
    task.completed ? (li.style.backgroundColor = "#00000045") : (li.style.backgroundColor = "");
    li.innerHTML = `
      <span class="${task.completed ? "completed" : ""}">
        ${task.name}
      </span>
      <span>
        <button onclick="editTask(${i})">Edit</button>
        <button onclick="completeTask(${i})">${task.completed ? "Done" : "Not done"
      }</button>
        <button onclick="moveTaskUp(${i})">↑</button>
        <button onclick="moveTaskDown(${i})">↓</button>
        <button class="remove-btn" onclick="removeTask(${i})">x</button>
      </span>
    `;
    taskList.appendChild(li);
  }
}

updateTasks();

form.addEventListener("submit", addTask);
