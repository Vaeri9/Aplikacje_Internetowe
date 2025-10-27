const searchBar = document.getElementById("searchBar");
const taskAddText = document.getElementById("taskAddText");
const taskAddDate = document.getElementById("taskAddDate");
const taskAddSave = document.getElementById("taskAddSave");
const taskList = document.getElementById("taskList");

let Todo = {
    tasks: [],
    draw: function() {
        toSave = [];
        for (let task of this.tasks) {
            toSave.push(task.innerHTML);
        }
        localStorage.setItem("tasks", JSON.stringify(toSave));
        
        taskList.innerHTML = "";
        for (let task of this.tasks) {
            taskList.appendChild(task);
        }
    },
    filterTasks: function(){
        var ul, li, a, i;
        ul = document.getElementById("taskList");
        li = ul.getElementsByTagName('li');

        if (searchBar.value.length > 1) {
            for (i = 0; i < li.length; i++) {
                a = li[i].querySelector(".taskText").innerHTML;
                li[i].querySelector(".taskText").innerHTML = li[i].querySelector(".taskText").innerHTML.replaceAll("<mark>", "");
                li[i].querySelector(".taskText").innerHTML = li[i].querySelector(".taskText").innerHTML.replaceAll("</mark>", "");
                if (a.includes(searchBar.value)) {
                    li[i].style.display = "";
                    li[i].querySelector(".taskText").innerHTML = li[i].querySelector(".taskText").innerHTML.replace(searchBar.value, "<mark>"+searchBar.value+"</mark>");
                    console.log(li[i].querySelector(".taskText").innerHTML);
                }
                else {
                    li[i].style.display = "none";
                    //li[i].querySelector(".taskText").innerHTML = li[i].querySelector(".taskText").innerHTML.replace("<mark>", "");
                    //li[i].querySelector(".taskText").innerHTML = li[i].querySelector(".taskText").innerHTML.replace("</mark>", "");
                }
            }
        }
        else {
            for (i = 0; i < li.length; i++) {
                li[i].style.display = "";
                li[i].querySelector(".taskText").innerHTML = li[i].querySelector(".taskText").innerHTML.replaceAll("<mark>", "");
                li[i].querySelector(".taskText").innerHTML = li[i].querySelector(".taskText").innerHTML.replaceAll("</mark>", "");
            }
        }
    },
    deleteTask: function(listItem) {
        this.tasks.splice(this.tasks.indexOf(listItem), 1);
        this.draw();
    },
    editTaskName: function(listItem){
        let newTask = document.createElement("input");
        newTask.addEventListener("blur", function(){   
            newTaskText = newTask.value.trim();

            let newSpan = document.createElement("span");
            newSpan.className = "taskText";
            newSpan.innerHTML = `${newTaskText}`;

            newSpan.addEventListener("click", function(){Todo.editTaskName(listItem)});

            newTask.replaceWith(newSpan);
        });

        let oldTask = listItem.querySelector(".taskText");
        newTask.value = oldTask.innerHTML;
        oldTask.replaceWith(newTask);

        console.log(listItem.innerHTML);

        this.draw();
    },
    editTaskDate: function(listItem){
        let newDate = document.createElement("input");
        newDate.type = "date";
        newDate.addEventListener("blur", function(){
            newTaskDate = newDate.value;

            let newSpan = document.createElement("span");
            newSpan.className = "taskDate";
            newSpan.innerHTML = `${newTaskDate}`;

            newSpan.addEventListener("click", function(){Todo.editTaskDate(listItem)});

            newDate.replaceWith(newSpan);
        })

        let oldDate = listItem.querySelector(".taskDate");
        newDate.value = oldDate.innerHTML;
        oldDate.replaceWith(newDate);

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
        li.innerHTML = `<input type="checkbox"><span class="taskText">${myTask}</span> <span class="taskDate">${myDate}</span><button type="button" class="deleteButton">Delete</button>`;

        let deleteButton = li.querySelector(".deleteButton");
        deleteButton.addEventListener("click", function(){Todo.deleteTask(li)});

        let editTask = li.querySelector(".taskText");
        editTask.addEventListener("click", function(){Todo.editTaskName(li)});

        let editDate = li.querySelector(".taskDate");
        editDate.addEventListener("click", function(){Todo.editTaskDate(li)});

        this.tasks.push(li);
        taskAddText.value = "";
        taskAddDate.value = "";

        this.draw()
    },
    restorePreviousTasks(){
        // read previous tasks. If no tasks were found, start with an empty list
        let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

        if (storedTasks.length > 0){
            for (let oldtask of storedTasks) {
                var li = document.createElement("li");
                li.innerHTML = oldtask;

                let deleteButton = li.querySelector(".deleteButton");
                deleteButton.addEventListener("click", function(){Todo.deleteTask(li)});

                let editTask = li.querySelector(".taskText");
                editTask.addEventListener("click", function(){Todo.editTaskName(li)});

                let editDate = li.querySelector(".taskDate");
                editDate.addEventListener("click", function(){Todo.editTaskDate(li)});

                this.tasks.push(li);
            }

            this.draw();
        }
    }
}

Todo.restorePreviousTasks();