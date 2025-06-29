const todosContainer = document.getElementById("todos");
const paginationContainer = document.getElementById("pagination");

let currentPage = 1;
const todosPerPage = 10;
const totalTodos = 200; // Total available from the API
const totalPages = Math.ceil(totalTodos / todosPerPage);

// Fetch and display todos for a given page
async function fetchTodos(page) {
  const start = (page - 1) * todosPerPage + 1;
  const url = `https://jsonplaceholder.typicode.com/todos?_start=${start - 1}&_limit=${todosPerPage}`;

  try {
    const res = await fetch(url);
    const todos = await res.json();
    renderTodos(todos);
    setActivePage(page);
  } catch (error) {
    console.error("Failed to fetch todos:", error);
  }
}

// Render todos to the DOM
function renderTodos(todos) {
  todosContainer.innerHTML = "";
  todos.forEach(todo => {
    const div = document.createElement("div");
    div.className = "todo";
    div.innerHTML = `
      <strong>${todo.title}</strong><br/>
      Completed: ${todo.completed ? "✅" : "❌"}
    `;
    todosContainer.appendChild(div);
  });
}

// Create pagination buttons
function createPaginationButtons() {
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "page-btn";
    btn.addEventListener("click", () => {
      currentPage = i;
      fetchTodos(currentPage);
    });
    paginationContainer.appendChild(btn);
  }
}

// Highlight the active button
function setActivePage(page) {
  const buttons = document.querySelectorAll(".page-btn");
  buttons.forEach((btn, index) => {
    if (index === page - 1) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Initial render
createPaginationButtons();
fetchTodos(currentPage);
