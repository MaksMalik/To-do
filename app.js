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
      li.classList.add('dragging');
      draggedTask = i;
      e.dataTransfer.setData("text/plain", i);
    });
    li.addEventListener("dragover", function (e) {
      e.preventDefault();
      const activeTask = document.querySelector('.dragging');
      if (activeTask !== null && activeTask !== li) {
        const currentTaskBounding = li.getBoundingClientRect();
        const isMiddle = (e.clientY - currentTaskBounding.top) / currentTaskBounding.height > 0.5;
        if (isMiddle) {
          if (li.nextElementSibling !== null && li.nextElementSibling !== activeTask) {
            taskList.insertBefore(activeTask, li.nextElementSibling);
            tasks.splice(i + 1, 0, tasks.splice(draggedTask, 1)[0]);
            draggedTask = i + 1;
          }
        } else {
          if (li.previousElementSibling !== null && li.previousElementSibling !== activeTask) {
            taskList.insertBefore(activeTask, li);
            tasks.splice(i, 0, tasks.splice(draggedTask, 1)[0]);
            draggedTask = i;
          }
        }
      }
    });
    li.addEventListener("dragend", function () {
      li.classList.remove('dragging');
      updateTasks();
    });
    task.completed ? (li.style.backgroundColor = "lightgreen") : (li.style.backgroundColor = "white");
    li.innerHTML = `<span class="taskName">${task.name}</span>
    <div class="buttons">
      <button class="editButton" onclick="editTask(${i})"><i class="fas fa-edit"></i></button>
      <button class="upButton" onclick="moveTaskUp(${i})"><i class="fas fa-arrow-up"></i></button>
      <button class="downButton" onclick="moveTaskDown(${i})"><i class="fas fa-arrow-down"></i></button>
      <button class="removeButton" onclick="removeTask(${i})"><i class="fas fa-trash"></i></button>
      <button class="completeButton" onclick="completeTask(${i})"><i class="fas fa-check"></i></button>
    </div>`;
    taskList.appendChild(li);
  }
}


form.addEventListener("submit", addTask);
updateTasks();
