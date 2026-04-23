document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const booksGrid = document.getElementById('booksGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const emptyState = document.getElementById('emptyState');
    const totalBooksCount = document.getElementById('totalBooksCount');
    const borrowedBooksCount = document.getElementById('borrowedBooksCount');
    const totalRevenueCount = document.getElementById('totalRevenueCount');
    
    // Modal Elements
    const bookModal = document.getElementById('bookModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalBody = document.getElementById('modalBody');

    // Reader Elements
    const readerModal = document.getElementById('readerModal');
    const closeReaderBtn = document.getElementById('closeReaderBtn');
    const readerTitle = document.getElementById('readerTitle');
    const readerBody = document.getElementById('readerBody');
    
    // Toast Element
    const toast = document.getElementById('toast');

    // State
    let currentTab = 'all'; // 'all' or 'borrowed'
    let currentSearch = '';
    let currentCategory = 'All';

    // Initialize App
    init();

    function init() {
        renderBooks();
        updateStats();
        setupEventListeners();
    }

    function setupEventListeners() {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            renderBooks();
        });

        categoryFilter.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            renderBooks();
        });

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active class
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update state and render
                currentTab = btn.dataset.tab;
                renderBooks();
            });
        });

        closeModalBtn.addEventListener('click', closeModal);
        closeReaderBtn.addEventListener('click', closeReader);
        
        // Close modal on outside click
        bookModal.addEventListener('click', (e) => {
            if (e.target === bookModal) {
                closeModal();
            }
        });

        readerModal.addEventListener('click', (e) => {
            if (e.target === readerModal) {
                closeReader();
            }
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!readerModal.classList.contains('hidden')) {
                    closeReader();
                } else if (!bookModal.classList.contains('hidden')) {
                    closeModal();
                }
            }
        });
    }

    function getFilteredBooks() {
        return booksData.filter(book => {
            // Filter by Tab
            if (currentTab === 'borrowed' && !book.isBorrowed) return false;
            
            // Filter by Category
            if (currentCategory !== 'All' && book.category !== currentCategory) return false;
            
            // Filter by Search
            if (currentSearch) {
                const matchTitle = book.title.toLowerCase().includes(currentSearch);
                const matchAuthor = book.author.toLowerCase().includes(currentSearch);
                if (!matchTitle && !matchAuthor) return false;
            }
            
            return true;
        });
    }

    function renderBooks() {
        const filteredBooks = getFilteredBooks();
        booksGrid.innerHTML = '';

        if (filteredBooks.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            
            filteredBooks.forEach(book => {
                const card = document.createElement('div');
                card.className = 'book-card';
                card.onclick = () => openModal(book.id);
                
                const statusBadge = book.isBorrowed 
                    ? `<div class="status-badge status-borrowed">Borrowed</div>`
                    : `<div class="status-badge status-available">Available</div>`;
                    
                const dateInfo = book.isBorrowed && book.borrowDate
                    ? `<div class="borrow-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        Borrowed: ${new Date(book.borrowDate).toLocaleDateString()}
                       </div>`
                    : '';

                card.innerHTML = `
                    <div class="book-cover-wrapper">
                        ${statusBadge}
                        <img src="${book.coverImage}" alt="${book.title}" class="book-cover">
                    </div>
                    <div class="book-info">
                        <span class="book-category">${book.category}</span>
                        <h3 class="book-title">${book.title}</h3>
                        <p class="book-author">${book.author}</p>
                        ${dateInfo}
                    </div>
                `;
                booksGrid.appendChild(card);
            });
        }
    }

    function updateStats() {
        totalBooksCount.textContent = booksData.length;
        const borrowedCount = booksData.filter(b => b.isBorrowed).length;
        borrowedBooksCount.textContent = borrowedCount;
        totalRevenueCount.textContent = `$${totalRevenue.toFixed(2)}`;
    }

    function openModal(bookId) {
        const book = booksData.find(b => b.id === bookId);
        if (!book) return;

        let dynamicContent = '';

        if (book.isBorrowed) {
            const borrowDateStr = new Date(book.borrowDate).toLocaleDateString();
            dynamicContent = `
                <div class="borrower-info">
                    <p><strong>Currently borrowed by:</strong> ${book.borrowerName || 'Unknown'}</p>
                    <p><strong>Borrowed on:</strong> ${borrowDateStr}</p>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-secondary" onclick="openReader('${book.id}')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        Read Book
                    </button>
                    <button class="btn btn-danger" onclick="toggleBorrow('${book.id}')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        Return Book
                    </button>
                </div>
            `;
        } else {
            dynamicContent = `
                <div class="borrower-input-group">
                    <label for="borrowerName">Borrower Name</label>
                    <input type="text" id="borrowerName" class="borrower-input" placeholder="Enter your name" required>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="toggleBorrow('${book.id}')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        Borrow Book
                    </button>
                </div>
            `;
        }

        modalBody.innerHTML = `
            <img src="${book.coverImage}" alt="${book.title}" class="modal-cover">
            <div class="modal-details">
                <span class="modal-category">${book.category}</span>
                <h2 class="modal-title">${book.title}</h2>
                <p class="modal-author">by ${book.author}</p>
                <p class="modal-desc">${book.description}</p>
                <div style="margin-top: auto;">
                    ${dynamicContent}
                </div>
            </div>
        `;

        bookModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeModal() {
        bookModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Make functions accessible globally
    window.toggleBorrow = function(bookId) {
        const bookIndex = booksData.findIndex(b => b.id === bookId);
        if (bookIndex !== -1) {
            const isCurrentlyBorrowed = booksData[bookIndex].isBorrowed;
            
            if (!isCurrentlyBorrowed) {
                // Borrowing logic
                const nameInput = document.getElementById('borrowerName');
                const borrowerName = nameInput ? nameInput.value.trim() : '';
                
                if (!borrowerName) {
                    showToast('Please enter your name to borrow this book.', 'danger');
                    return;
                }

                booksData[bookIndex].isBorrowed = true;
                booksData[bookIndex].borrowDate = new Date().toISOString();
                booksData[bookIndex].borrowerName = borrowerName;

                showToast(`You borrowed "${booksData[bookIndex].title}"`, 'info');
            } else {
                // Returning logic
                const borrowDate = new Date(booksData[bookIndex].borrowDate);
                const returnDate = new Date();
                
                // Calculate fee: $1 per day, minimum $1
                const diffTime = Math.abs(returnDate - borrowDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const fee = Math.max(1, diffDays * 1); // $1 per day
                
                totalRevenue += fee;

                booksData[bookIndex].isBorrowed = false;
                booksData[bookIndex].borrowDate = null;
                booksData[bookIndex].borrowerName = null;

                showToast(`Returned "${booksData[bookIndex].title}". Fee collected: $${fee.toFixed(2)}`, 'success');
            }
            
            saveData();
            updateStats();
            renderBooks();
            openModal(bookId); // Refresh modal
        }
    };

    window.openReader = function(bookId) {
        const book = booksData.find(b => b.id === bookId);
        if (!book) return;

        readerTitle.textContent = book.title;
        readerBody.innerHTML = book.content || '<p>Content not available.</p>';
        
        bookModal.classList.add('hidden'); // Hide details modal
        readerModal.classList.remove('hidden');
    };

    function closeReader() {
        readerModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }

    function showToast(message, type = 'success') {
        let icon = '✓';
        if (type === 'info') icon = 'ℹ';
        if (type === 'danger') icon = '⚠';
        
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        `;
        
        toast.classList.remove('hidden');
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
});
