const searchBar = document.getElementById("searchBar");
const taskAddText = document.getElementById("taskAddText");
const taskAddDate = document.getElementById("taskAddDate");
const taskAddSave = document.getElementById("taskAddSave");
const taskList = document.getElementById("taskList");

let Todo = {
    tasks: [],
    draw: function() {
        taskList.innerHTML = "";
        for (let task of this.tasks) {
            taskList.appendChild(task);
        }
    },
    deleteTask: function(listItem) {
        this.tasks.splice(this.tasks.indexOf(listItem), 1);
        this.draw();
    },
    editTask: function(listItem){
        const newTask = document.createElement("input");
        let oldTask = listItem.querySelector(".taskText");
        oldTask.replaceWith(newTask);
        newTaskText = newTask.value.trim();

        let newSpan = document.createElement("span");
        newSpan.className = "taskText";
        newSpan.innerHTML = `${newTaskText}`;

        //newTask.replaceWith(newSpan);

        this.draw();
    },
    addTask: function() {
        const myTask = taskAddText.value.trim();
        const myDate = taskAddDate.value;
        
        if (!myTask) {
            alert("Please name your task");
            return;
        }

        var li = document.createElement("li");
        li.innerHTML = `<input type="checkbox"><span class="taskText">${myTask}</span> <span>${myDate}</span><button type="button" class="deleteButton">Delete</button>`;

        let deleteButton = li.querySelector(".deleteButton");
        deleteButton.addEventListener("click", function(){Todo.deleteTask(li)});

        let edit = li.querySelector(".taskText");
        edit.addEventListener("click", function(){Todo.editTask(li)});

        this.tasks.push(li);
        taskAddText.value = "";
        taskAddDate.value = "";
        this.draw()
    }
}