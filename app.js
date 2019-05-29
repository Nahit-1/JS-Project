//Define UI Variables 
const form = document.querySelector('#task-form')
const taskList = document.querySelector('.collection')
const clearBtn = document.querySelector('.clear-tasks')
const filter = document.querySelector('#filter')
const taskInput = document.querySelector('#task')

//Function to load all event listeners
loadEventListeners()

//Load all event listeners
function loadEventListeners() {
    //DOM LOAD EVENT
    document.addEventListener('DOMContentLoaded', getTasks)
    //add task event 
    form.addEventListener('submit', addTask)
    //remove task event 
    taskList.addEventListener('click', removeTask)
    //clear task event 
    clearBtn.addEventListener('click', clearTasks)
    //filter tasks event 
    filter.addEventListener('keyup', filterTasks)
}

function fetchTasks() {
    return fetch("http://localhost:3000/tasks")
    .then(resp => resp.json())
}

function renderTasks(tasks) {
   tasks.forEach(renderTask)
}

function renderTask(task) { 
        const li = document.createElement('li')
        //Add class to element 
        li.className = 'collection-item' 
        //Create text node & append to li
        li.appendChild(document.createTextNode(task)) // ****
        //Create new link element 
        const link = document.createElement('a')
        //Add class to link element 
        link.className = 'delete-item secondary-content'  
        //Add icon HTML 
        link.innerHTML = '<i class="fa fa-remove"></i>' 
        //Append the link to li 
        li.appendChild(link)
        //Append li to the ul 
        taskList.appendChild(li)
}

fetchTasks()
.then(tasks => renderTasks(tasks))



//Add Task
function addTask(e) {
    if(taskInput.value === '') {
        alert('Add a task')
    }

    //create li element (for new task added..)
    const li = document.createElement('li')
    //Add class to element 
    li.className = 'collection-item' // for materliaze to look good ul has to have class of collection and li therefore collection-item)
    //Create text node & append to li
    li.appendChild(document.createTextNode(taskInput.value))
    //Create new link element 
    const link = document.createElement('a')
    //Add class to link element 
    link.className = 'delete-item secondary-content' //in materialize, secondary-content class offsets the item to the right. 
    //Add icon HTML 
    link.innerHTML = '<i class="fa fa-remove"></i>' //adds html for X icon 
    //Append the link to li 
    li.appendChild(link)

    //Append li to the ul --> taskList was defined as the ul above!
    taskList.appendChild(li)

    //STORE IN LOCAL STORAGE
    storeTaskInLocalStorage(taskInput.value)

    //CLEAR INPUT FIELD FOR NEW TASK 
    taskInput.value = ''

    e.preventDefault()
}

//Store task function (local storage --> doesnt show in ul with this)
function storeTaskInLocalStorage(task) {
    let tasks
    if(localStorage.getItem('tasks') === null){
        tasks = []
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }

    tasks.push(task)

    localStorage.setItem('tasks', JSON.stringify(tasks))
}

//Remove Task Logic
function removeTask(e) {
    //target delete item icon 
    if(e.target.parentElement.classList.contains('delete-item')) {
        if(confirm('Are you sure?')) {
        e.target.parentElement.parentElement.remove()

        // EDITED HERE TO ADD DELETE FROM LOCAL STORAGE FUNCTIONALITY !!!
        //Remove from local storage 
        removeTaskFromLocalStorage(e.target.parentElement.parentElement) //usually we would have an id reference .. 
        }
    }
}

// REMOVE FROM LOCAL STORAGE FUNCTION   
function removeTaskFromLocalStorage(taskItem) {
    // COPY PASTE from store task ... 
    let tasks
    if(localStorage.getItem('tasks') === null){
        tasks = []
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }
    // LOOP THROUGH 
    tasks.forEach(function(task, index){
        if (taskItem.textContent === task) {
            tasks.splice(index, 1)
        }
    })
// now set local storage again... 
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

//Clear Tasks
function clearTasks(){
    // below is one way of clearing the list but is slow.. 
    taskList.innerHTML = '' 
    // another way is with a while loop to remove each one.. (Much faster..)
    while(taskList.firstChild) {
        taskList.removeChild(taskList.firstChild)
    }
//CLEAR FROM LOCAL STORAGE added functionality.. 
    clearTasksFromLocalStorage()
}


// CLEAR TASKS FROM LOCAL STORAGE added functionality... 
function clearTasksFromLocalStorage() {
    localStorage.clear()
}


//Filter tasks logic
function filterTasks(e) {
    const text = e.target.value.toLowerCase() // this gets us whatever is being typed in

    // get all list items --> can use forEach because querySelAll returns a node list 
    document.querySelectorAll('.collection-item').forEach(function(task){ 
        const item = task.firstChild.textContent
        if (item.toLowerCase().indexOf(text) != -1) { //if no match will result -1
            task.style.display = 'block'
        } else {
            task.style.display = 'none'
        }
    }) 
}