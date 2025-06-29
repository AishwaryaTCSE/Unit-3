const userContainer = document.getElementById("user-container");
const pagination = document.getElementById("pagination");

const LIMIT = 6; // Users per page
let currentPage = 1;
const TOTAL_USERS = 10; // JSONPlaceholder has only 10 users
const TOTAL_PAGES = Math.ceil(TOTAL_USERS / LIMIT);

// Fetch users by page
async function fetchUsers(page) {
  try {
    userContainer.innerHTML = "<p>Loading...</p>";
    const res = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${LIMIT}`);
    if (!res.ok) throw new Error("Failed to fetch data");

    const users = await res.json();
    displayUsers(users);
  } catch (error) {
    userContainer.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}

// Render users
function displayUsers(users) {
  userContainer.innerHTML = "";
  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "user-card";
    div.innerHTML = `
      <h3>${user.name}</h3>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
      <p><strong>Company:</strong> ${user.company.name}</p>
    `;
    userContainer.appendChild(div);
  });
}

// Render pagination buttons
function setupPagination() {
  pagination.innerHTML = "";
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = i === currentPage;
    btn.onclick = () => {
      currentPage = i;
      fetchUsers(currentPage);
      setupPagination();
    };
    pagination.appendChild(btn);
  }
}

// On page load
fetchUsers(currentPage);
setupPagination();
