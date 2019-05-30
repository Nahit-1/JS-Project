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
    document.addEventListener('DOMContentLoaded', () => {
        fetchTasks()
        .then(tasks => renderTasks(tasks))
    })
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
    return fetch("http://localhost:3000/tasks.json")
    .then(resp => resp.json())
}

function renderTasks(tasks) {
   tasks.forEach(task => {
    //    console.log(task)
       renderTask(task)
    })
}

function renderTask(task) { 
        const li = document.createElement('li')
        //Add class to element 
        li.className = 'collection-item' 
        //Create text node & append to li
        li.appendChild(document.createTextNode(task.title)) // ****
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



//Add Task
function addTask(e) {
    e.preventDefault()
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
    link.innerHTML = '<i class="fa fa-remove"></i>' //html for X icon 
    //Append the link to li 
    li.appendChild(link)

    //Append li to the ul --> taskList was defined as the ul above!
    taskList.appendChild(li)

    //STORE IN LOCAL STORAGE
    // storeTaskInLocalStorage(taskInput.value)
    createTaskOnServer(taskInput.value)

    //CLEAR INPUT FIELD FOR NEW TASK 
    taskInput.value = ''

}

// ************************* Uncaught SyntaxError: Unexpected identifier ******************** 
function createTaskOnServer(task) {
    // debugger
    return fetch("http://localhost:3000/tasks.json", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({task: {title: task}})
    }).then(resp => resp.json())
            // .then(resp=> console.log('Success:', JSON.stringify(resp)))
            .then(console.log)
            .catch(error => console.error('Error:', error));
    
}
// ********************************************************************************************
//Store task function (local storage )
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

//Remove Task from page 
function removeTask(e) {
    //target delete item icon 
    if(e.target.parentElement.classList.contains('delete-item')) {
        if(confirm('Are you sure?')) {
        e.target.parentElement.parentElement.remove()

        
        //Remove task from local storage 
        removeTaskFromLocalStorage(e.target.parentElement.parentElement) 
        //For sremove from server erver we need an id reference ???
        
        
        }
    }
}


//******************************************************************* DELETE TASK FROM SERVER TEST  */************************** */

// function deleteTaskFromServer(task) {
//     return fetch("http://localhost:3000/tasks" + `/${task.user_id}`, {
//         method: 'DELETE'
//     }).then(resp => resp.json())
// }

// function removeTask(e) {
//     //target delete item icon 
//     if(e.target.parentElement.classList.contains('delete-item')) {
//         if(confirm('Are you sure?')) {
//         e.target.parentElement.parentElement.remove()

        
        
//         deleteTaskFromServer(task) //does this need an id reference ??? 
        
//         }
//     }
// }



// ********************************************************************************************************************************** /
// REMOVE FROM LOCAL STORAGE FUNCTION   
function removeTaskFromLocalStorage(taskItem) {
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