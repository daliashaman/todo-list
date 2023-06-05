// SELECT ELEMENT
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todosListElement = document.getElementById("todos-list");
const notificationElement = document.querySelector(".notification");

// VARS
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;

//1st render
renderTodos();

// FORM SUBMIT
form.addEventListener('submit', function (event){
event.preventDefault();

saveTodo();
renderTodos();
localStorage.setItem('todos', JSON.stringify(todos))
});

// SAVE TODO

function saveTodo(){
const todoValue = todoInput.value; 

// if todo is empty
const isEmpty = todoValue === '';

// check for duplicate todos
const isDuplicate = 
todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());

if(isEmpty){
    showNotification("Todo's input is empty");
}else if (isDuplicate) {
    showNotification("Todo already exists");
}else {
    if(EditTodoId >= 0){
        todos = todos.map((todo, index) => ({
                 ...todo,
                value: index === EditTodoId ? todoValue : todo.value,
        }));
        EditTodoId = -1;
    }else {
 todos.push({
    value: todoValue,
    checked: false,
    color: '#' + Math.floor(Math.random()*16777215).toString(16)
 });
}
}
todoInput.value = "";
}

console.log(todos);

// RENDER TODOS
function renderTodos(){
    if(todos.length === 0){
        todosListElement.innerHTML = '<center>Nothing to do!</center>'
        return
    }

    // CLEAR ELEMENT BEFORE A RE-RENDER
    todosListElement.innerHTML= '';

    todos.forEach((todo, index) => {
        todosListElement.innerHTML += `
        <div class="todo" id=${index}>
          <i 
            class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}"
            style="color : ${todo.color}"
            data-action="check"
          ></i>
          <p class="${todo.checked ? 'checked' : ''} data-action="check">${todo.value}</p>
          <i class="bi bi-pencil-square" data-action="edit"></i>
          <i class="bi bi-trash" data-action="delete"></i>
        </div>
        `;
      });
    }

//CREATE EVENT LISTENER FOR ALL TODOS
todosListElement.addEventListener('click', (event) =>{
    const target = event.target;
    const parentElement = target.parentNode;

    if(parentElement.className !== 'todo') return;

    // to do id
    const todo = parentElement;
    const todoId = Number(todo.id);
    
    // target action
    const action = target.dataset.action;

    action === "check" && checkTodo(todoId);
    action === "edit" && editTodo(todoId);
    action === "delete" && deleteTodo(todoId);
    
    // console.log(todoId, action);
})

// CHECK TODO
function checkTodo(todoId){
    todos = todos.map((todo, index) =>
        ({
           ...todo,               
            checked: index === todoId ? !todo.checked : todo.checked
        }));

    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos))
}

// EDIT TODO
function editTodo(todoId){
    todoInput.value = todos[todoId].value;
    EditTodoId = todoId;
}

//DELETE TODO
function deleteTodo(todoId) {
    todos = todos.filter((todo, index) => index !== todoId);
    EditTodoId = -1;

    //re-render
    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos))
}

// SHOW A NOTIFICATION
function showNotification(msg) {
    // change the message
    notificationElement.innerHTML = msg;
  
    // notification enter
    notificationElement.classList.add('notif-enter');
  
    // notification leave
    setTimeout(() => {
      notificationElement.classList.remove('notif-enter');
    }, 2000);
  }