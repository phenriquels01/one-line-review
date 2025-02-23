// SEARCH BY + VALUE
document.querySelectorAll('.search-type').forEach(item => {
  item.addEventListener('click', (e) => {
      e.preventDefault();
      const type = e.target.dataset.type;
      const typeLabel = e.target.textContent;
      const dropdown = document.getElementById('searchDropdown');

      dropdown.innerHTML = `Search by ${typeLabel}`;
      document.getElementById('searchType').value = type;
      dropdown.dataset.currentType = type;
      dropdown.classList.add('active-filter');
  });
});

// SEARCH MESSAGE
document.addEventListener('DOMContentLoaded', () => {
  let currentSearchType = 'title';
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const searchMessage = document.getElementById('search-message');
  
  document.querySelectorAll('.search-type').forEach(item => {
      item.addEventListener('click', (e) => {
          e.preventDefault();
          currentSearchType = e.target.dataset.type;
          document.getElementById('searchType').value = currentSearchType;
      });
  });


  // FORMS SUBMISSION
  searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      const currentSearchType = document.getElementById('searchType').value;
      if (!query) return;
      try {
          const response = await axios.get('/api/search', {
              params: {
                  query: query,
                  type: currentSearchType
              }
          });
          if (response.data.results.length === 0) {
              searchMessage.style.display = 'block';
          } else {
              searchMessage.style.display = 'none';
              if (response.data.results.length === 1) {
                  window.location.href = `/books/${response.data.results[0].isbn}`;
              } else {
                  // Multiple results logic
                  console.log('Multiple results:', response.data.results);
              }
          }
      } catch (error) {
          console.error('Search failed:', error);
          searchMessage.style.display = 'block';
      }
  });
  document.addEventListener('click', (e) => {
      if (!searchForm.contains(e.target)) {
          searchMessage.style.display = 'none';
      }
  });
});



// SORTING BUTTON
const toggleButton = document.getElementById("toggleFilters");
const filtersSection = document.getElementById("filtersSection");

toggleButton.addEventListener("click", () => {
  filtersSection.classList.toggle("show");
});



// SORTING FILTERS + AXIOS
const filterLinks = document.querySelectorAll('.filter-options .nav-link');

filterLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    filterLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    // Transforms: "Newest" -> "newest", etc.
    const sortParam = this.getAttribute('data-sort');
    axios.get(`/api/books?sort=${sortParam}`)
      .then(response => {
        const books = response.data.books;
        // Updates DOM with new books
        updateBooksList(books);
      })
      .catch(error => {
        console.error("Erro ao carregar livros:", error);
      });
  });
});



// updateBooksList FUNCTION
function updateBooksList(books) {
  const booksList = document.getElementById('booksList');
  // Fade out
  booksList.style.opacity = 0;
  setTimeout(() => {

    booksList.innerHTML = '';
    
    books.forEach(book => {
      const bookLink = document.createElement('a');
      bookLink.className = 'book-item-link';
      bookLink.href = `/books/${book.isbn}`;
      
      bookLink.innerHTML = `
        <div class="book-item">
          <img src="${book.coverUrl}" alt="${book.title}">
          <h3>${book.title}</h3>
          <p>${book.author}</p>
          <div class="book-meta">
            <span>⭐ ${book.rating}</span>
          </div>
        </div>
      `;
      bookLink.addEventListener('mouseenter', () => {
        bookLink.style.transform = 'translateY(-5px)';
      });
      bookLink.addEventListener('mouseleave', () => {
        bookLink.style.transform = 'translateY(0)';
      });
      booksList.appendChild(bookLink);
    });
    // Fade in
    booksList.style.opacity = 1;
    updateCarouselButtons();
    void booksList.offsetWidth;
    
  }, 300);
}



// BOOKS CAROUSSEL
document.addEventListener('DOMContentLoaded', () => {
  const scrollLeftBtn = document.getElementById('scroll-left');
  const scrollRightBtn = document.getElementById('scroll-right');
  const booksList = document.getElementById('booksList');
  const books = document.querySelectorAll('.book-item');
  const visibleBooksCount = 4;
  const bookWidth = books[0]?.offsetWidth || 270;
  const gap = 20;
  const scrollAmount = (bookWidth + gap) * visibleBooksCount;

  const updateButtons = () => {
    scrollLeftBtn.style.display = booksList.scrollLeft <= 0 ? 'none' : 'block';
    scrollRightBtn.style.display = booksList.scrollLeft + booksList.offsetWidth >= booksList.scrollWidth ? 'none' : 'block';
  };

  scrollRightBtn.addEventListener('click', () => {
    booksList.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(updateButtons, 300);
  });

  scrollLeftBtn.addEventListener('click', () => {
    booksList.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(updateButtons, 300);
  });

  updateButtons();

  window.addEventListener('resize', () => {
    updateButtons();
  });
});



// updatateCarouselButtons FUNCTION
function updateCarouselButtons() {
  const scrollLeftBtn = document.getElementById('scroll-left');
  const scrollRightBtn = document.getElementById('scroll-right');
  const booksList = document.getElementById('booksList');
  scrollLeftBtn.style.display = booksList.scrollLeft <= 0 ? 'none' : 'block';
  scrollRightBtn.style.display = booksList.scrollLeft + booksList.offsetWidth >= booksList.scrollWidth ? 'none' : 'block';
}