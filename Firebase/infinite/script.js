const gallery = document.getElementById("gallery");
const loading = document.getElementById("loading");

let page = 1;
const limit = 10;
let isLoading = false;

// Fetch images from API
async function fetchImages() {
  try {
    isLoading = true;
    loading.style.display = "block";

    const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=${limit}`);
    
    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();

    if (data.length === 0) {
      loading.textContent = "No more photos to load.";
      window.removeEventListener("scroll", handleScroll);
      return;
    }

    data.forEach(photo => {
      const div = document.createElement("div");
      div.classList.add("photo-card");

      div.innerHTML = `
        <img src="${photo.thumbnailUrl}" alt="${photo.title}" />
        <p>${photo.title}</p>
      `;

      gallery.appendChild(div);
    });

    loading.style.display = "none";
    isLoading = false;
  } catch (error) {
    console.error("Error fetching images:", error);
    loading.textContent = "Error loading photos.";
  }
}

// Scroll handler
function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (!isLoading && scrollTop + clientHeight >= scrollHeight - 10) {
    page++;
    fetchImages();
  }
}

// Initial load
fetchImages();
window.addEventListener("scroll", handleScroll);
