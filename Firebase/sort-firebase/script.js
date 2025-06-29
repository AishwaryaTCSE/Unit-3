const API_URL = "https://jsonplaceholder.typicode.com/users";
const productList = document.getElementById("product-list");
const sortSelect = document.getElementById("sortSelect");

// Fetch and display users (as products)
async function fetchAndRender() {
  try {
    productList.innerHTML = "<p>Loading...</p>";

    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error("Network response was not ok.");
    }

    let data = await res.json();

    const sortOrder = sortSelect.value;

    // Sort by name
    data.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    renderProducts(data);
  } catch (error) {
    productList.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}

// Display users
function renderProducts(data) {
  productList.innerHTML = "";

  data.forEach((user) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <h3>${user.name}</h3>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Company:</strong> ${user.company.name}</p>
      <p><strong>City:</strong> ${user.address.city}</p>
    `;

    productList.appendChild(card);
  });
}

// On load
window.onload = fetchAndRender;
