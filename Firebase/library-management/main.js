const firebaseURL = "https://library-management-b700c-default-rtdb.asia-southeast1.firebasedatabase.app";

// Save to localStorage
function saveState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Load from localStorage
function loadState(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Add or update a book
async function addOrUpdateBook() {
  const id = document.getElementById("book-id").value.trim();
  const title = document.getElementById("book-title").value.trim();
  const author = document.getElementById("book-author").value.trim();
  const genre = document.getElementById("book-genre").value.trim();
  const year = parseInt(document.getElementById("book-year").value.trim());
  const available = document.getElementById("book-available").value === "true";

  if (!title || !author || !genre || isNaN(year)) {
    alert("Please fill all fields correctly.");
    return;
  }

  const bookData = { title, author, genre, publishedYear: year, available };

  try {
    if (id) {
      await fetch(`${firebaseURL}/books/${id}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      alert("Book updated.");
    } else {
      await fetch(`${firebaseURL}/books.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      alert("Book added.");
    }

    document.getElementById("book-id").value = "";
    document.getElementById("book-title").value = "";
    document.getElementById("book-author").value = "";
    document.getElementById("book-genre").value = "";
    document.getElementById("book-year").value = "";
    document.getElementById("book-available").value = "true";

    fetchBooks();
  } catch (error) {
    alert("Error saving book: " + error.message);
  }
}

// Fetch books from Firebase and display
async function fetchBooks() {
  try {
    let res = await fetch(`${firebaseURL}/books.json`);
    let data = await res.json();

    if (!data) {
      document.getElementById("books-container").innerHTML = "<p>No books found.</p>";
      return;
    }

    let books = Object.entries(data).map(([key, val]) => ({ id: key, ...val }));

    const genre = document.getElementById("filter-genre").value.toLowerCase();
    const author = document.getElementById("filter-author").value.toLowerCase();
    const availability = document.getElementById("filter-availability").value;
    const sortBy = document.getElementById("sort-books").value;

    books = books.filter(book =>
      (!genre || book.genre?.toLowerCase().includes(genre)) &&
      (!author || book.author?.toLowerCase().includes(author)) &&
      (availability === "" || String(book.available) === availability)
    );

    if (sortBy) {
      books.sort((a, b) => {
        if (typeof a[sortBy] === "string") {
          return a[sortBy].localeCompare(b[sortBy]);
        } else {
          return a[sortBy] - b[sortBy];
        }
      });
    }

    saveState("bookFilters", { genre, author, availability, sortBy });
    displayBooks(books);
  } catch (error) {
    alert("Failed to fetch books: " + error.message);
  }
}

// Display books on screen
function displayBooks(books) {
  const container = document.getElementById("books-container");
  container.innerHTML = "";

  const page = loadState("bookPage") || 1;
  const perPage = 5;
  const start = (page - 1) * perPage;
  const paginated = books.slice(start, start + perPage);

  paginated.forEach(book => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${book.title}</strong> by ${book.author} (${book.publishedYear}) - ${book.genre}<br>
      <em>Available:</em> ${book.available ? "Yes" : "No"}
      <br>
      <button onclick="deleteBook('${book.id}')">Delete</button>
      <button onclick="prefillForm('${book.id}', ${JSON.stringify(book).replace(/"/g, '&quot;')})">Edit</button>
      <hr>
    `;
    container.appendChild(div);
  });

  displayPagination(books.length, perPage, page, "bookPage");
}

// Delete a book
async function deleteBook(id) {
  if (!confirm("Delete this book?")) return;
  try {
    await fetch(`${firebaseURL}/books/${id}.json`, {
      method: "DELETE",
    });
    alert("Book deleted.");
    fetchBooks();
  } catch (err) {
    alert("Delete failed: " + err.message);
  }
}

// Apply filters
function applyFilters() {
  saveState("bookPage", 1);
  fetchBooks();
}

// Display pagination buttons
function displayPagination(total, perPage, currentPage, key) {
  const pages = Math.ceil(total / perPage);
  const pagDiv = document.getElementById("pagination-books");
  pagDiv.innerHTML = "";

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = i === currentPage;
    btn.onclick = () => {
      saveState(key, i);
      fetchBooks();
    };
    pagDiv.appendChild(btn);
  }
}

// Prefill form for editing
function prefillForm(id, book) {
  document.getElementById("book-id").value = id;
  document.getElementById("book-title").value = book.title;
  document.getElementById("book-author").value = book.author;
  document.getElementById("book-genre").value = book.genre;
  document.getElementById("book-year").value = book.publishedYear;
  document.getElementById("book-available").value = book.available;
}

// On load
window.onload = function () {
  const filters = loadState("bookFilters");
  if (filters) {
    document.getElementById("filter-genre").value = filters.genre;
    document.getElementById("filter-author").value = filters.author;
    document.getElementById("filter-availability").value = filters.availability;
    document.getElementById("sort-books").value = filters.sortBy;
  }
  fetchBooks();
};
