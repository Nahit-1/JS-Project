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
    //update task event 
    // taskList.addEventListener('click', updateTask)
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
        li.dataset.id = task.id
        //Add class to element 
        li.className = 'collection-item' 
        //Create text node & append to li
        li.appendChild(document.createTextNode(task.title)) // ****
        //Create new link element 
        const link = document.createElement('a')
        const ulink = document.createElement('a')
        //Add class to link element 
        link.className = 'delete-item secondary-content'
        ulink.className = 'update-item'  
        //Add icon HTML 
        link.innerHTML = '<i class="fa fa-remove"></i>' 
        ulink.innerHTML = '<i class="fas fa-recycle"></i>'
        //Append the link to li 
        li.appendChild(link)
        li.appendChild(ulink)
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
    const ulink = document.createElement('a')
    //Add class to link element 
    link.className = 'delete-item secondary-content' 
    ulink.className = 'update-item'  
    //Add icon HTML 
    link.innerHTML = '<i class="fa fa-remove"></i>' //html for X icon 
    ulink.innerHTML = '<i class="fas fa-recycle"></i>'
    //Append the link to li 
    li.appendChild(link)
    li.appendChild(ulink)

    //Append li to the ul --> taskList was defined as the ul above!
    taskList.appendChild(li)

    //STORE IN LOCAL STORAGE
    // storeTaskInLocalStorage(taskInput.value)
    createTaskOnServer(taskInput.value)

    //CLEAR INPUT FIELD FOR NEW TASK 
    taskInput.value = ''

}

// ************************* ******************** 
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



//******************************************************************* DELETE TASK FROM SERVER TEST  */************************** */

function deleteTaskFromServer(id) {
    // debugger

    return fetch("http://localhost:3000/tasks" + `/${id}.json`, {
        method: 'DELETE'
    }).then(resp => resp.json())
    
    
}

function removeTask(e) {
    //target delete item icon 
    if(e.target.parentElement.classList.contains('delete-item')) {
        if(confirm('Are you sure?')) {
            const li = e.target.parentElement.parentElement
            const id = li.dataset.id
            li.remove()

            deleteTaskFromServer(id) //does this need an id reference ??? 
        
        }
    }
}

// -----------------------------------------------------
// UPDATING TASKS

// function updateTaskOnServer(id) {
//     return fetch("http://localhost:3000/tasks" + `/${id}.json`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(task)
//     }).then(resp => resp.json())
// }

// function updateTaskOnPage(task) {
//     const textLi = document.querySelector('.collection-item')

//     textLi.innerText = 
    
// //     const 
// // }

// function updateTask(id) {
//     updateTaskOnServer(id)
//     .then(task => updateTaskOnPage)
// }

// ----------------------------------------------------------

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