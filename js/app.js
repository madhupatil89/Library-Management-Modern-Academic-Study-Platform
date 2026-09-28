/**
 * Library Management - Modern Academic & Study Management Portal
 * Core JavaScript Application Controller
 */

// Application State
const AppState = {
  books: [],
  desks: [],
  borrowedBooks: [],
  selectedDesk: null,
  activeCategory: "All Categories",
  searchQuery: "",
  availabilityFilter: "all",
  sortBy: "rating",
  pomo: {
    mode: "pomodoro", // 'pomodoro' | 'shortBreak' | 'longBreak'
    duration: 25 * 60,
    remaining: 25 * 60,
    timerId: null,
    isRunning: false,
    totalMinutesFocused: 0
  },
  currentUser: {
    name: "Alex Sterling",
    studentId: "LM-88942-CS",
    program: "B.S. Computer Science & AI",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    validThru: "DEC 2027"
  }
};

// Storage Keys
const STORAGE_KEYS = {
  BOOKS: "lib_mgmt_books_v1",
  DESKS: "lib_mgmt_desks_v1",
  BORROWED: "lib_mgmt_borrowed_v1",
  NOTES: "lib_mgmt_notes_v1",
  POMO_MINUTES: "lib_mgmt_pomo_minutes_v1"
};

// DOM Content Loaded Handler
document.addEventListener("DOMContentLoaded", () => {
  initStorage();
  initUIComponents();
  renderCatalog();
  renderDeskLayout();
  renderDashboard();
  renderResources();
  renderFAQs();
  initPomodoro();
  initNotes();
  initNavbarScroll();
});

/* ==========================================================================
   INITIALIZATION & STORAGE
   ========================================================================== */
function initStorage() {
  // Initialize Books
  const storedBooks = localStorage.getItem(STORAGE_KEYS.BOOKS);
  if (storedBooks) {
    try {
      AppState.books = JSON.parse(storedBooks);
    } catch (e) {
      AppState.books = [...INITIAL_BOOKS];
    }
  } else {
    AppState.books = [...INITIAL_BOOKS];
    saveBooks();
  }

  // Initialize Desks
  const storedDesks = localStorage.getItem(STORAGE_KEYS.DESKS);
  if (storedDesks) {
    try {
      AppState.desks = JSON.parse(storedDesks);
    } catch (e) {
      AppState.desks = [...INITIAL_STUDY_DESKS];
    }
  } else {
    AppState.desks = [...INITIAL_STUDY_DESKS];
    saveDesks();
  }

  // Initialize Borrowed Books
  const storedBorrowed = localStorage.getItem(STORAGE_KEYS.BORROWED);
  if (storedBorrowed) {
    try {
      AppState.borrowedBooks = JSON.parse(storedBorrowed);
    } catch (e) {
      AppState.borrowedBooks = [];
    }
  } else {
    // Seed with 1 borrowed book for demonstration
    const sampleBook = AppState.books[0];
    if (sampleBook) {
      AppState.borrowedBooks = [
        {
          id: sampleBook.id,
          title: sampleBook.title,
          author: sampleBook.author,
          coverImage: sampleBook.coverImage,
          borrowDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          dueDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          dueTimestamp: Date.now() + 11 * 24 * 60 * 60 * 1000,
          shelfLocation: sampleBook.shelfLocation
        }
      ];
      saveBorrowed();
    }
  }

  // Initialize Focus Minutes
  const storedPomoMins = localStorage.getItem(STORAGE_KEYS.POMO_MINUTES);
  if (storedPomoMins) {
    AppState.pomo.totalMinutesFocused = parseInt(storedPomoMins, 10) || 0;
  }
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(AppState.books));
}

function saveDesks() {
  localStorage.setItem(STORAGE_KEYS.DESKS, JSON.stringify(AppState.desks));
}

function saveBorrowed() {
  localStorage.setItem(STORAGE_KEYS.BORROWED, JSON.stringify(AppState.borrowedBooks));
  updateBorrowedBadge();
}

function updateBorrowedBadge() {
  const badge = document.getElementById("nav-borrowed-count");
  if (badge) {
    badge.textContent = AppState.borrowedBooks.length;
  }
}

/* ==========================================================================
   NAVIGATION & SCROLL EFFECTS
   ========================================================================== */
function initNavbarScroll() {
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Mobile navigation toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      const isVisible = navLinks.style.display === "flex";
      navLinks.style.display = isVisible ? "none" : "flex";
      if (!isVisible) {
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "76px";
        navLinks.style.left = "0";
        navLinks.style.right = "0";
        navLinks.style.background = "#ffffff";
        navLinks.style.padding = "1.5rem";
        navLinks.style.borderBottom = "1px solid #dbeafe";
        navLinks.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
      }
    });
  }

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          if (window.innerWidth < 768 && navLinks) {
            navLinks.style.display = "none";
          }
        }
      }
    });
  });
}

/* ==========================================================================
   CATALOG FILTER & SEARCH CONTROLS
   ========================================================================== */
function initUIComponents() {
  // Hero Search input
  const heroSearchInput = document.getElementById("hero-search-input");
  const heroSearchBtn = document.getElementById("hero-search-btn");
  if (heroSearchBtn && heroSearchInput) {
    heroSearchBtn.addEventListener("click", () => {
      const query = heroSearchInput.value.trim();
      executeSearch(query);
    });
    heroSearchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        executeSearch(heroSearchInput.value.trim());
      }
    });
  }

  // Catalog Toolbar Search Input
  const catalogSearchInput = document.getElementById("catalog-search-input");
  if (catalogSearchInput) {
    catalogSearchInput.addEventListener("input", (e) => {
      AppState.searchQuery = e.target.value.toLowerCase().trim();
      renderCatalog();
    });
  }

  // Availability Filter
  const filterAvailability = document.getElementById("filter-availability");
  if (filterAvailability) {
    filterAvailability.addEventListener("change", (e) => {
      AppState.availabilityFilter = e.target.value;
      renderCatalog();
    });
  }

  // Sort Filter
  const filterSort = document.getElementById("filter-sort");
  if (filterSort) {
    filterSort.addEventListener("change", (e) => {
      AppState.sortBy = e.target.value;
      renderCatalog();
    });
  }

  // Add Book Modal Triggers
  const openAddBookBtn = document.getElementById("btn-open-add-book");
  const addBookModal = document.getElementById("add-book-modal");
  const closeAddBookBtn = document.getElementById("btn-close-add-modal");
  const cancelAddBookBtn = document.getElementById("btn-cancel-add-modal");
  const addBookForm = document.getElementById("add-book-form");

  if (openAddBookBtn && addBookModal) {
    openAddBookBtn.addEventListener("click", () => {
      addBookModal.classList.add("show");
    });
  }
  if (closeAddBookBtn && addBookModal) {
    closeAddBookBtn.addEventListener("click", () => {
      addBookModal.classList.remove("show");
    });
  }
  if (cancelAddBookBtn && addBookModal) {
    cancelAddBookBtn.addEventListener("click", () => {
      addBookModal.classList.remove("show");
    });
  }

  if (addBookForm) {
    addBookForm.addEventListener("submit", handleAddBookSubmit);
  }

  // Card Pass Modal
  const openPassBtn = document.getElementById("btn-open-card-modal");
  const cardModal = document.getElementById("virtual-card-modal");
  const closeCardBtn = document.getElementById("btn-close-card-modal");
  if (openPassBtn && cardModal) {
    openPassBtn.addEventListener("click", () => {
      cardModal.classList.add("show");
    });
  }
  if (closeCardBtn && cardModal) {
    closeCardBtn.addEventListener("click", () => {
      cardModal.classList.remove("show");
    });
  }

  // Book Preview Modal Close
  const previewModal = document.getElementById("book-preview-modal");
  const closePreviewBtn = document.getElementById("btn-close-preview-modal");
  if (closePreviewBtn && previewModal) {
    closePreviewBtn.addEventListener("click", () => {
      previewModal.classList.remove("show");
    });
  }

  // Desk Ticket Modal Close
  const ticketModal = document.getElementById("ticket-modal");
  const closeTicketBtn = document.getElementById("btn-close-ticket-modal");
  if (closeTicketBtn && ticketModal) {
    closeTicketBtn.addEventListener("click", () => {
      ticketModal.classList.remove("show");
    });
  }

  // Global Backdrop Click to Close
  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove("show");
      }
    });
  });

  // Render Category Filter Pills
  renderCategoryPills();
  updateBorrowedBadge();
}

function executeSearch(query) {
  const catalogSection = document.getElementById("catalog-section");
  if (catalogSection) {
    catalogSection.scrollIntoView({ behavior: "smooth" });
  }
  const catalogSearchInput = document.getElementById("catalog-search-input");
  if (catalogSearchInput) {
    catalogSearchInput.value = query;
  }
  AppState.searchQuery = query.toLowerCase();
  renderCatalog();
}

function renderCategoryPills() {
  const container = document.getElementById("category-pills-container");
  if (!container) return;

  const categories = [
    "All Categories",
    "Computer Science & AI",
    "Medical & Healthcare",
    "Engineering & Physics",
    "Business & Economics",
    "Mathematics & Statistics",
    "Literature & Humanities"
  ];

  container.innerHTML = categories.map(cat => {
    const isActive = cat === AppState.activeCategory ? "active" : "";
    return `<button class="category-pill ${isActive}" onclick="selectCategory('${cat}')">${cat}</button>`;
  }).join("");
}

function selectCategory(cat) {
  AppState.activeCategory = cat;
  renderCategoryPills();
  renderCatalog();
}

/* ==========================================================================
   BOOK CATALOG RENDERING & ACTIONS
   ========================================================================== */
function renderCatalog() {
  const grid = document.getElementById("books-grid");
  if (!grid) return;

  let filtered = AppState.books.filter(book => {
    // Category filter
    const matchesCategory = AppState.activeCategory === "All Categories" || book.category === AppState.activeCategory;
    
    // Search query filter
    const q = AppState.searchQuery;
    const matchesQuery = !q || 
      book.title.toLowerCase().includes(q) || 
      book.author.toLowerCase().includes(q) || 
      book.isbn.toLowerCase().includes(q) ||
      book.category.toLowerCase().includes(q);

    // Availability filter
    let matchesAvail = true;
    if (AppState.availabilityFilter === "available") {
      matchesAvail = book.copiesAvailable > 0;
    } else if (AppState.availabilityFilter === "digital") {
      matchesAvail = book.isDigital;
    }

    return matchesCategory && matchesQuery && matchesAvail;
  });

  // Sort
  if (AppState.sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (AppState.sortBy === "newest") {
    filtered.sort((a, b) => b.publishedYear - a.publishedYear);
  } else if (AppState.sortBy === "copies") {
    filtered.sort((a, b) => b.copiesAvailable - a.copiesAvailable);
  } else if (AppState.sortBy === "title") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Update counter
  const counterEl = document.getElementById("catalog-result-count");
  if (counterEl) {
    counterEl.textContent = `Showing ${filtered.length} of ${AppState.books.length} study volumes`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-catalog-state">
        <i class="fa-solid fa-book-open-reader"></i>
        <h3 style="font-size: 1.25rem; color: #1e3a8a; margin-bottom: 0.5rem;">No Study Materials Found</h3>
        <p style="color: #64748b; font-size: 0.95rem; max-width: 420px; margin: 0 auto 1.5rem;">
          We couldn't find any resources matching your search criteria. Try modifying your keywords or resetting filters.
        </p>
        <button class="btn-primary" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(book => {
    const isOutOfStock = book.copiesAvailable <= 0;
    const isAlreadyBorrowed = AppState.borrowedBooks.some(b => b.id === book.id);
    const stockClass = book.copiesAvailable <= 2 ? "low-stock" : "";

    return `
      <article class="book-card" data-id="${book.id}">
        <div class="book-card-cover">
          <img src="${book.coverImage}" alt="${book.title}" loading="lazy">
          ${book.isDigital ? '<span class="book-badge-digital"><i class="fa-solid fa-bolt"></i> Digital E-Book</span>' : ''}
          <span class="book-badge-stock ${stockClass}">
            ${book.copiesAvailable > 0 ? `${book.copiesAvailable} In Stock` : 'Reserved'}
          </span>
        </div>
        <div class="book-card-body">
          <div class="book-category">${book.category}</div>
          <h3 class="book-title" title="${book.title}">${book.title}</h3>
          <div class="book-author">by ${book.author}</div>
          <div class="book-rating-row">
            <i class="fa-solid fa-star"></i>
            <strong>${book.rating.toFixed(1)}</strong>
            <span>(${book.reviewsCount} reviews)</span>
          </div>
          <div class="book-shelf">
            <i class="fa-solid fa-location-dot"></i>
            <span>${book.shelfLocation || "Main Wing • CS Section"}</span>
          </div>
          <div class="book-card-footer">
            ${isAlreadyBorrowed 
              ? `<button class="btn-borrow" style="background: #10b981;" disabled><i class="fa-solid fa-check"></i> In Your Bag</button>`
              : `<button class="btn-borrow" onclick="borrowBook('${book.id}')" ${isOutOfStock ? "disabled style='opacity: 0.5; cursor: not-allowed;'" : ""}>
                  <i class="fa-solid fa-bookmark"></i> ${isOutOfStock ? "Unavailable" : "Borrow Book"}
                 </button>`
            }
            <button class="btn-preview" onclick="openBookPreview('${book.id}')" title="Preview Chapter Excerpts">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function resetFilters() {
  AppState.activeCategory = "All Categories";
  AppState.searchQuery = "";
  AppState.availabilityFilter = "all";
  AppState.sortBy = "rating";

  const searchInput = document.getElementById("catalog-search-input");
  if (searchInput) searchInput.value = "";
  const filterAvail = document.getElementById("filter-availability");
  if (filterAvail) filterAvail.value = "all";
  const filterSort = document.getElementById("filter-sort");
  if (filterSort) filterSort.value = "rating";

  renderCategoryPills();
  renderCatalog();
  showToast("Catalog filters have been reset", "info");
}

/* ==========================================================================
   BORROWING & RETURNING OPERATIONS
   ========================================================================== */
function borrowBook(bookId) {
  const book = AppState.books.find(b => b.id === bookId);
  if (!book) return;

  if (book.copiesAvailable <= 0) {
    showToast("Sorry, all copies of this book are currently on loan.", "warning");
    return;
  }

  // Check if student already borrowed it
  if (AppState.borrowedBooks.some(b => b.id === bookId)) {
    showToast("You currently have this volume checked out.", "warning");
    return;
  }

  // Check student borrow quota (max 5)
  if (AppState.borrowedBooks.length >= 5) {
    showToast("Borrowing limit reached (maximum 5 active study loans allowed).", "danger");
    return;
  }

  // Issue the book
  book.copiesAvailable -= 1;
  saveBooks();

  const borrowDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 14 days loan period

  const newBorrowRecord = {
    id: book.id,
    title: book.title,
    author: book.author,
    coverImage: book.coverImage,
    borrowDate: borrowDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    dueDate: dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    dueTimestamp: dueDate.getTime(),
    shelfLocation: book.shelfLocation
  };

  AppState.borrowedBooks.unshift(newBorrowRecord);
  saveBorrowed();

  renderCatalog();
  renderDashboard();

  showToast(`"${book.title}" successfully issued! Due on ${newBorrowRecord.dueDate}.`, "success");
}

function returnBook(bookId) {
  const borrowIndex = AppState.borrowedBooks.findIndex(b => b.id === bookId);
  if (borrowIndex === -1) return;

  const borrowed = AppState.borrowedBooks[borrowIndex];
  
  // Find catalog entry and increment stock
  const catalogBook = AppState.books.find(b => b.id === bookId);
  if (catalogBook) {
    catalogBook.copiesAvailable = Math.min(catalogBook.copiesTotal, catalogBook.copiesAvailable + 1);
    saveBooks();
  }

  // Remove from borrowed
  AppState.borrowedBooks.splice(borrowIndex, 1);
  saveBorrowed();

  renderCatalog();
  renderDashboard();

  showToast(`"${borrowed.title}" has been returned to the library shelves!`, "success");
}

function renewBook(bookId) {
  const item = AppState.borrowedBooks.find(b => b.id === bookId);
  if (!item) return;

  const currentDue = new Date(item.dueTimestamp);
  currentDue.setDate(currentDue.getDate() + 7); // add 7 days

  item.dueTimestamp = currentDue.getTime();
  item.dueDate = currentDue.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  saveBorrowed();
  renderDashboard();

  showToast(`Loan extended by 7 days. New due date: ${item.dueDate}`, "success");
}

/* ==========================================================================
   BOOK PREVIEW MODAL
   ========================================================================== */
function openBookPreview(bookId) {
  const book = AppState.books.find(b => b.id === bookId);
  if (!book) return;

  const modal = document.getElementById("book-preview-modal");
  const modalContent = document.getElementById("book-preview-content");
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
      <img src="${book.coverImage}" alt="${book.title}" style="width: 140px; height: 190px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.12);">
      <div style="flex: 1; min-width: 240px;">
        <span class="section-tag" style="margin-bottom: 0.5rem;">${book.category}</span>
        <h2 style="font-size: 1.45rem; color: #1e3a8a; margin-bottom: 0.35rem;">${book.title}</h2>
        <p style="font-size: 0.95rem; color: #64748b; margin-bottom: 0.75rem;">By <strong>${book.author}</strong> • ${book.publishedYear}</p>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; font-size: 0.85rem; background: #eff6ff; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #dbeafe;">
          <div><strong style="color: #1e3a8a;">ISBN:</strong> ${book.isbn}</div>
          <div><strong style="color: #1e3a8a;">Pages:</strong> ${book.pages || 480} pp.</div>
          <div><strong style="color: #1e3a8a;">Location:</strong> ${book.shelfLocation}</div>
          <div><strong style="color: #1e3a8a;">In Stock:</strong> ${book.copiesAvailable} of ${book.copiesTotal}</div>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 1rem; color: #1e3a8a; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.5rem;">
        <i class="fa-solid fa-align-left" style="color: #3b82f6;"></i> Academic Abstract & Overview
      </h4>
      <p style="font-size: 0.92rem; color: #475569; line-height: 1.6;">${book.summary}</p>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 1rem; color: #1e3a8a; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.5rem;">
        <i class="fa-solid fa-list-ol" style="color: #3b82f6;"></i> Key Curated Chapters
      </h4>
      <ul style="list-style: none; padding-left: 0;">
        ${(book.tableOfContents || []).map(ch => `
          <li style="padding: 0.45rem 0.75rem; background: #f8fafc; border-left: 3px solid #3b82f6; margin-bottom: 0.35rem; font-size: 0.88rem; border-radius: 0 6px 6px 0;">
            ${ch}
          </li>
        `).join("")}
      </ul>
    </div>

    <div style="background: #f0f7ff; border: 1.5px dashed #bfdbfe; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
      <h4 style="font-size: 0.95rem; color: #1e40af; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.5rem;">
        <i class="fa-solid fa-quote-left"></i> Representative Study Excerpt
      </h4>
      <p style="font-style: italic; font-size: 0.9rem; color: #334155; line-height: 1.6;">
        "${book.sampleExcerpt || 'Detailed study analysis and formula breakdown available in library reserve copies.'}"
      </p>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
      <button class="btn-secondary" onclick="document.getElementById('book-preview-modal').classList.remove('show')">Close Reader</button>
      <button class="btn-primary" onclick="borrowBook('${book.id}'); document.getElementById('book-preview-modal').classList.remove('show');">
        <i class="fa-solid fa-bookmark"></i> Issue This Book
      </button>
    </div>
  `;

  modal.classList.add("show");
}

/* ==========================================================================
   ADD BOOK SUBMISSION HANDLER
   ========================================================================== */
function handleAddBookSubmit(e) {
  e.preventDefault();
  const form = e.target;

  const title = form.title.value.trim();
  const author = form.author.value.trim();
  const category = form.category.value;
  const isbn = form.isbn.value.trim() || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const copies = parseInt(form.copies.value, 10) || 3;
  const pages = parseInt(form.pages.value, 10) || 350;
  const summary = form.summary.value.trim();
  const shelf = form.shelf.value.trim() || "Main Wing • Special Collections";
  const coverUrl = form.coverUrl.value.trim() || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";

  const newBook = {
    id: `bk-${Date.now()}`,
    title,
    author,
    category,
    isbn,
    rating: 5.0,
    reviewsCount: 1,
    publishedYear: 2026,
    copiesTotal: copies,
    copiesAvailable: copies,
    coverImage: coverUrl,
    summary: summary || "Comprehensive university course guide and syllabus research literature.",
    tableOfContents: [
      "1. Fundamental Theoretical Principles",
      "2. Case Analysis & Advanced Applications",
      "3. Experimental Review & Formulas",
      "4. Examination Review & Practice Problems"
    ],
    sampleExcerpt: "Academic knowledge expands when students actively synthesize empirical evidence with structured analytical methodologies.",
    isDigital: true,
    pages,
    shelfLocation: shelf
  };

  AppState.books.unshift(newBook);
  saveBooks();
  renderCatalog();

  // Close modal and reset form
  form.reset();
  document.getElementById("add-book-modal").classList.remove("show");

  showToast(`"${title}" has been successfully cataloged into the library system!`, "success");
}

/* ==========================================================================
   STUDY SPACE & SEAT RESERVATION SYSTEM
   ========================================================================== */
function renderDeskLayout() {
  const container = document.getElementById("desks-grid");
  if (!container) return;

  const activeZoneFilter = document.querySelector(".zone-tab.active")?.dataset.zone || "all";

  let filteredDesks = AppState.desks;
  if (activeZoneFilter !== "all") {
    filteredDesks = AppState.desks.filter(d => d.zone === activeZoneFilter);
  }

  container.innerHTML = filteredDesks.map(desk => {
    const isBooked = desk.status === "booked";
    const isSelected = AppState.selectedDesk && AppState.selectedDesk.id === desk.id;
    let nodeClasses = `desk-node ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`;

    return `
      <div class="${nodeClasses}" onclick="selectDesk('${desk.id}')">
        <div class="desk-icon">
          <i class="fa-solid ${getDeskIcon(desk.zone)}"></i>
        </div>
        <div class="desk-id">${desk.id}</div>
        <div class="desk-features">${desk.features}</div>
        <div class="desk-status-text">
          ${isBooked ? `<i class="fa-solid fa-lock"></i> Booked (${desk.time || 'Occupied'})` : `<i class="fa-solid fa-circle-check"></i> Available`}
        </div>
      </div>
    `;
  }).join("");
}

function getDeskIcon(zone) {
  switch (zone) {
    case "Silent Pod": return "fa-headphones-simple";
    case "Collaborative Desk": return "fa-users-rectangle";
    case "Research Lab": return "fa-desktop";
    default: return "fa-chair";
  }
}

function filterDesksByZone(zone, tabElement) {
  document.querySelectorAll(".zone-tab").forEach(tab => tab.classList.remove("active"));
  if (tabElement) tabElement.classList.add("active");
  renderDeskLayout();
}

function selectDesk(deskId) {
  const desk = AppState.desks.find(d => d.id === deskId);
  if (!desk || desk.status === "booked") {
    if (desk && desk.status === "booked") {
      showToast(`Desk ${deskId} is currently reserved by ${desk.bookedBy || 'another student'}.`, "warning");
    }
    return;
  }

  AppState.selectedDesk = desk;
  renderDeskLayout();

  // Update Sidebar
  const summaryBox = document.getElementById("selected-seat-summary");
  const seatIdDisplay = document.getElementById("summary-seat-id");
  const seatZoneDisplay = document.getElementById("summary-seat-zone");
  const seatFeaturesDisplay = document.getElementById("summary-seat-features");
  const bookBtn = document.getElementById("btn-confirm-seat-booking");

  if (summaryBox) {
    summaryBox.style.display = "block";
    seatIdDisplay.textContent = desk.id;
    seatZoneDisplay.textContent = desk.zone;
    seatFeaturesDisplay.textContent = desk.features;
  }

  if (bookBtn) {
    bookBtn.disabled = false;
  }
}

function confirmSeatBooking(e) {
  if (e) e.preventDefault();
  if (!AppState.selectedDesk) {
    showToast("Please choose an available study pod or desk on the floor map.", "warning");
    return;
  }

  const nameInput = document.getElementById("seat-student-name");
  const idInput = document.getElementById("seat-student-id");
  const timeInput = document.getElementById("seat-time-slot");
  const durationInput = document.getElementById("seat-duration");

  const studentName = nameInput ? nameInput.value.trim() : AppState.currentUser.name;
  const studentId = idInput ? idInput.value.trim() : AppState.currentUser.studentId;
  const timeSlot = timeInput ? timeInput.value : "14:00 - 16:00";
  const duration = durationInput ? durationInput.value : "2 Hours";

  // Mark desk as booked
  AppState.selectedDesk.status = "booked";
  AppState.selectedDesk.bookedBy = studentName;
  AppState.selectedDesk.time = timeSlot;

  saveDesks();
  renderDeskLayout();

  // Show ticket modal
  const ticketModal = document.getElementById("ticket-modal");
  const ticketBody = document.getElementById("ticket-modal-body");
  if (ticketModal && ticketBody) {
    ticketBody.innerHTML = `
      <div style="text-align: center; border-bottom: 2px dashed #dbeafe; padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
        <div style="font-size: 2.2rem; color: #10b981; margin-bottom: 0.5rem;">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h3 style="font-size: 1.35rem; color: #1e3a8a;">Study Pod Reservation Confirmed</h3>
        <p style="font-size: 0.85rem; color: #64748b;">Library Management Automated Access Ticket</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem; margin-bottom: 1.5rem;">
        <div>
          <span style="color: #64748b; font-size: 0.75rem; text-transform: uppercase;">Seat Number</span>
          <p style="font-size: 1.25rem; font-weight: 800; color: #1d4ed8;">${AppState.selectedDesk.id}</p>
        </div>
        <div>
          <span style="color: #64748b; font-size: 0.75rem; text-transform: uppercase;">Zone Type</span>
          <p style="font-weight: 700; color: #0f172a;">${AppState.selectedDesk.zone}</p>
        </div>
        <div>
          <span style="color: #64748b; font-size: 0.75rem; text-transform: uppercase;">Student Name</span>
          <p style="font-weight: 600; color: #0f172a;">${studentName}</p>
        </div>
        <div>
          <span style="color: #64748b; font-size: 0.75rem; text-transform: uppercase;">ID / Pass</span>
          <p style="font-weight: 600; color: #0f172a;">${studentId}</p>
        </div>
        <div>
          <span style="color: #64748b; font-size: 0.75rem; text-transform: uppercase;">Time Slot</span>
          <p style="font-weight: 600; color: #0f172a;">${timeSlot}</p>
        </div>
        <div>
          <span style="color: #64748b; font-size: 0.75rem; text-transform: uppercase;">Duration</span>
          <p style="font-weight: 600; color: #0f172a;">${duration}</p>
        </div>
      </div>

      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 0.85rem; font-size: 0.8rem; color: #1e40af; display: flex; align-items: center; gap: 0.75rem;">
        <i class="fa-solid fa-wifi" style="font-size: 1.2rem;"></i>
        <div>High-speed Academic Wi-Fi network <strong>Lib-Secure-5G</strong> is activated for this desk during your booking.</div>
      </div>
    `;
    ticketModal.classList.add("show");
  }

  showToast(`Seat ${AppState.selectedDesk.id} successfully booked for ${studentName}!`, "success");
  AppState.selectedDesk = null;
  const summaryBox = document.getElementById("selected-seat-summary");
  if (summaryBox) summaryBox.style.display = "none";
  const bookBtn = document.getElementById("btn-confirm-seat-booking");
  if (bookBtn) bookBtn.disabled = true;
}

/* ==========================================================================
   POMODORO STUDY TIMER WITH WEB AUDIO CHIME
   ========================================================================== */
function initPomodoro() {
  updateTimerDisplay();
  updateTimerRing();

  const startBtn = document.getElementById("btn-pomo-start");
  const pauseBtn = document.getElementById("btn-pomo-pause");
  const resetBtn = document.getElementById("btn-pomo-reset");

  if (startBtn) startBtn.addEventListener("click", startPomodoro);
  if (pauseBtn) pauseBtn.addEventListener("click", pausePomodoro);
  if (resetBtn) resetBtn.addEventListener("click", resetPomodoro);
}

function setPomodoroMode(mode) {
  AppState.pomo.mode = mode;
  document.querySelectorAll(".pomo-mode-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  if (mode === "pomodoro") AppState.pomo.duration = 25 * 60;
  else if (mode === "shortBreak") AppState.pomo.duration = 5 * 60;
  else if (mode === "longBreak") AppState.pomo.duration = 15 * 60;

  pausePomodoro();
  AppState.pomo.remaining = AppState.pomo.duration;
  updateTimerDisplay();
  updateTimerRing();

  const statusText = document.getElementById("pomo-status-text");
  if (statusText) {
    statusText.textContent = mode === "pomodoro" ? "Deep Focus Session" : "Rest & Refresh Break";
  }
}

function startPomodoro() {
  if (AppState.pomo.isRunning) return;

  AppState.pomo.isRunning = true;
  document.getElementById("btn-pomo-start").style.display = "none";
  document.getElementById("btn-pomo-pause").style.display = "inline-flex";

  AppState.pomo.timerId = setInterval(() => {
    if (AppState.pomo.remaining > 0) {
      AppState.pomo.remaining--;
      updateTimerDisplay();
      updateTimerRing();

      // If in focus mode, accumulate study minutes every 60 seconds
      if (AppState.pomo.mode === "pomodoro" && (AppState.pomo.duration - AppState.pomo.remaining) % 60 === 0) {
        AppState.pomo.totalMinutesFocused++;
        localStorage.setItem(STORAGE_KEYS.POMO_MINUTES, AppState.pomo.totalMinutesFocused);
        updateDashboardPomoStats();
      }
    } else {
      // Completed timer!
      pausePomodoro();
      playTimerChime();
      showToast(
        AppState.pomo.mode === "pomodoro" 
          ? "🎉 25-Minute Study Interval Complete! Take a well-deserved 5-minute break." 
          : "⏰ Break ended! Ready for your next deep focus block?", 
        "success"
      );
    }
  }, 1000);
}

function pausePomodoro() {
  AppState.pomo.isRunning = false;
  if (AppState.pomo.timerId) {
    clearInterval(AppState.pomo.timerId);
    AppState.pomo.timerId = null;
  }
  const startBtn = document.getElementById("btn-pomo-start");
  const pauseBtn = document.getElementById("btn-pomo-pause");
  if (startBtn) startBtn.style.display = "inline-flex";
  if (pauseBtn) pauseBtn.style.display = "none";
}

function resetPomodoro() {
  pausePomodoro();
  AppState.pomo.remaining = AppState.pomo.duration;
  updateTimerDisplay();
  updateTimerRing();
}

function updateTimerDisplay() {
  const minutes = Math.floor(AppState.pomo.remaining / 60);
  const seconds = AppState.pomo.remaining % 60;
  const str = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const el = document.getElementById("pomo-digits");
  if (el) el.textContent = str;
}

function updateTimerRing() {
  const circle = document.getElementById("pomo-circle-progress");
  if (!circle) return;

  const totalLength = 2 * Math.PI * 105; // radius = 105
  const fraction = (AppState.pomo.duration - AppState.pomo.remaining) / AppState.pomo.duration;
  const offset = totalLength - (fraction * totalLength);

  circle.style.strokeDasharray = `${totalLength}`;
  circle.style.strokeDashoffset = `${offset}`;
}

// Pleasant browser Web Audio API chime bell
function playTimerChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
  } catch (err) {
    console.log("Audio alert playback", err);
  }
}

/* ==========================================================================
   QUICK STUDY NOTES & SCRATCHPAD
   ========================================================================== */
function initNotes() {
  const textarea = document.getElementById("study-notes-area");
  const saveStatus = document.getElementById("notes-autosave-status");
  const exportBtn = document.getElementById("btn-export-notes");
  const clearBtn = document.getElementById("btn-clear-notes");

  if (!textarea) return;

  // Load saved notes
  const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
  if (savedNotes) {
    textarea.value = savedNotes;
  }

  // Autosave with debounce
  let timeoutId = null;
  textarea.addEventListener("input", () => {
    if (saveStatus) saveStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEYS.NOTES, textarea.value);
      if (saveStatus) {
        saveStatus.innerHTML = '<i class="fa-solid fa-check" style="color: #10b981;"></i> Saved to Local Storage';
      }
    }, 500);
  });

  // Export as .txt
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const content = textarea.value;
      if (!content.trim()) {
        showToast("Study notes pad is currently empty.", "warning");
        return;
      }
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Study_Notes_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Notes exported successfully as text file!", "success");
    });
  }

  // Clear notes
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your current study notes?")) {
        textarea.value = "";
        localStorage.removeItem(STORAGE_KEYS.NOTES);
        if (saveStatus) {
          saveStatus.innerHTML = '<i class="fa-solid fa-check" style="color: #10b981;"></i> Notes Cleared';
        }
        showToast("Study notes cleared", "info");
      }
    });
  }
}

/* ==========================================================================
   STUDENT DASHBOARD RENDERING
   ========================================================================== */
function renderDashboard() {
  const container = document.getElementById("borrowed-books-list");
  if (!container) return;

  // Update total counts
  const totalBorrowedEl = document.getElementById("dash-borrowed-count");
  if (totalBorrowedEl) totalBorrowedEl.textContent = AppState.borrowedBooks.length;

  const quotaLeftEl = document.getElementById("dash-quota-left");
  if (quotaLeftEl) quotaLeftEl.textContent = Math.max(0, 5 - AppState.borrowedBooks.length);

  updateDashboardPomoStats();

  if (AppState.borrowedBooks.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; color: #64748b;">
        <i class="fa-solid fa-book" style="font-size: 2.5rem; color: #93c5fd; margin-bottom: 0.75rem;"></i>
        <h4 style="font-size: 1.1rem; color: #1e3a8a; margin-bottom: 0.25rem;">No Books Currently Checked Out</h4>
        <p style="font-size: 0.88rem;">Explore the catalog above to borrow required course texts and research literature.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table class="borrowed-table">
      <thead>
        <tr>
          <th>Book Title & Author</th>
          <th>Issued Date</th>
          <th>Due Date</th>
          <th>Location</th>
          <th style="text-align: right;">Action</th>
        </tr>
      </thead>
      <tbody>
        ${AppState.borrowedBooks.map(item => `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <img src="${item.coverImage}" alt="${item.title}" style="width: 36px; height: 48px; object-fit: cover; border-radius: 4px;">
                <div>
                  <div style="font-weight: 700; color: #1e3a8a;">${item.title}</div>
                  <div style="font-size: 0.8rem; color: #64748b;">${item.author}</div>
                </div>
              </div>
            </td>
            <td>${item.borrowDate}</td>
            <td>
              <span class="due-badge active">
                <i class="fa-regular fa-clock"></i> ${item.dueDate}
              </span>
            </td>
            <td><span style="font-size: 0.8rem; color: #64748b;">${item.shelfLocation || "Main Wing"}</span></td>
            <td style="text-align: right;">
              <div style="display: inline-flex; gap: 0.4rem;">
                <button class="btn-secondary" style="padding: 0.4rem 0.75rem; font-size: 0.78rem;" onclick="renewBook('${item.id}')" title="Renew loan for 7 days">
                  <i class="fa-solid fa-arrows-rotate"></i> Renew
                </button>
                <button class="btn-primary" style="padding: 0.4rem 0.75rem; font-size: 0.78rem; background: #0f172a;" onclick="returnBook('${item.id}')" title="Return to library">
                  <i class="fa-solid fa-reply"></i> Return
                </button>
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function updateDashboardPomoStats() {
  const minsEl = document.getElementById("dash-focus-hours");
  if (minsEl) {
    const hours = (AppState.pomo.totalMinutesFocused / 60).toFixed(1);
    minsEl.textContent = `${hours} hrs`;
  }
}

/* ==========================================================================
   DOWNLOADABLE STUDY GUIDES & E-RESOURCES
   ========================================================================== */
function renderResources() {
  const container = document.getElementById("resources-grid");
  if (!container) return;

  container.innerHTML = STUDY_RESOURCES.map(res => `
    <div class="resource-card">
      <div class="resource-icon-wrap">
        <i class="fa-solid ${res.icon}"></i>
      </div>
      <span class="section-tag" style="margin-bottom: 0.5rem; align-self: flex-start;">${res.category}</span>
      <h3 class="resource-title">${res.title}</h3>
      <div class="resource-meta">
        <span><i class="fa-regular fa-file"></i> ${res.format}</span>
        <span>•</span>
        <span>${res.pages} Pages</span>
        <span>•</span>
        <span>${res.size}</span>
      </div>
      <button class="btn-secondary" style="margin-top: auto; justify-content: center; width: 100%;" onclick="downloadResource('${res.id}')">
        <i class="fa-solid fa-cloud-arrow-down"></i> Download Resource
      </button>
    </div>
  `).join("");
}

function downloadResource(resId) {
  const res = STUDY_RESOURCES.find(r => r.id === resId);
  if (!res) return;

  res.downloads++;
  
  // Create an automated study cheat sheet text blob for instant real download
  const content = `====================================================================
LIBRARY MANAGEMENT ACADEMIC STUDY PACK
Title: ${res.title}
Category: ${res.category}
Format: ${res.format}
Downloaded: ${new Date().toLocaleString()}
Issuer: Library Management & Academic Resource Center
====================================================================

CONTENTS & ESSENTIAL EXAM CONCEPTS:
1. Core Definitions and Architectural Overview
2. Rapid Formula References & Synthesis Axioms
3. Recommended Problem-Solving Strategies
4. University Faculty Syllabus Alignment Guide

Access 45,000+ full volumes on our Library Management portal 24/7.
====================================================================`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${res.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast(`Downloading "${res.title}"...`, "success");
}

/* ==========================================================================
   FAQS ACCORDION
   ========================================================================== */
function renderFAQs() {
  const container = document.getElementById("faq-accordion");
  if (!container) return;

  container.innerHTML = LIBRARY_FAQS.map((faq, index) => `
    <div class="faq-item ${index === 0 ? 'active' : ''}">
      <button class="faq-question" onclick="toggleFaq(this)">
        <span>${faq.question}</span>
        <i class="fa-solid fa-chevron-down faq-icon"></i>
      </button>
      <div class="faq-answer" style="${index === 0 ? 'max-height: 200px;' : ''}">
        <p>${faq.answer}</p>
      </div>
    </div>
  `).join("");
}

function toggleFaq(buttonElement) {
  const item = buttonElement.parentElement;
  const answer = item.querySelector(".faq-answer");
  const isActive = item.classList.contains("active");

  // Close others
  document.querySelectorAll(".faq-item").forEach(other => {
    other.classList.remove("active");
    const otherAns = other.querySelector(".faq-answer");
    if (otherAns) otherAns.style.maxHeight = null;
  });

  if (!isActive) {
    item.classList.add("active");
    answer.style.maxHeight = answer.scrollHeight + 30 + "px";
  }
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let icon = "fa-circle-info";
  if (type === "success") icon = "fa-circle-check";
  else if (type === "warning") icon = "fa-triangle-exclamation";
  else if (type === "danger") icon = "fa-circle-xmark";

  toast.innerHTML = `
    <i class="fa-solid ${icon}" style="font-size: 1.1rem; color: ${type === 'success' ? '#10b981' : type === 'danger' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};"></i>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
