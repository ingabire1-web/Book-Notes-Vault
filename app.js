// ============================================
// BOOK & NOTES VAULT - Simple Version
// ============================================

console.log('📚 Book Vault is ready!');

// -------- 1. DATA STORAGE --------

// Load books from browser
let books = [];
let saved = localStorage.getItem('myBooks');
if (saved) {
    books = JSON.parse(saved);
}
console.log('Books loaded:', books.length);

// Save books to browser
function saveBooks() {
    localStorage.setItem('myBooks', JSON.stringify(books));
    console.log('Books saved!');
}

// -------- 2. ADD BOOK --------

document.getElementById('book-form').addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Form submitted!');
    
    // Get values
    let title = document.getElementById('title').value.trim();
    let author = document.getElementById('author').value.trim();
    let pages = document.getElementById('pages').value;
    let dateAdded = document.getElementById('dateAdded').value;
    let tags = document.getElementById('tags').value;
    let notes = document.getElementById('notes').value;
    
    // Simple validation
    if (!title || !author || !pages || !dateAdded) {
        alert('Please fill in all required fields (*)');
        return;
    }
    
    // Create book object
    let newBook = {
        id: 'book_' + Date.now(),
        title: title,
        author: author,
        pages: Number(pages),
        dateAdded: dateAdded,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        notes: notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Add to list
    books.push(newBook);
    console.log('New book added:', newBook.title);
    
    // Save and show
    saveBooks();
    showAllBooks();
    updateStats();
    
    // Clear form
    document.getElementById('book-form').reset();
    document.getElementById('form-status').textContent = '✅ Book added!';
    document.getElementById('form-status').style.color = 'green';
});

// -------- 3. SHOW BOOKS --------

function showAllBooks() {
    console.log('Showing all books...');
    
    let searchTerm = document.getElementById('search-input').value.toLowerCase();
    let tableBody = document.getElementById('table-body');
    let cardContainer = document.getElementById('card-container');
    let noResults = document.getElementById('no-results-message');
    
    // Clear
    tableBody.innerHTML = '';
    cardContainer.innerHTML = '';
    
    // Filter books
    let filtered = books;
    if (searchTerm) {
        filtered = books.filter(function(book) {
            return book.title.toLowerCase().includes(searchTerm) ||
                   book.author.toLowerCase().includes(searchTerm) ||
                   (book.tags && book.tags.join(' ').toLowerCase().includes(searchTerm));
        });
    }
    
    // Sort by date (newest first)
    filtered.sort(function(a, b) {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    });
    
    console.log('Books to show:', filtered.length);
    
    // Show message if empty
    if (filtered.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    noResults.style.display = 'none';
    
    // Show each book
    for (let i = 0; i < filtered.length; i++) {
        let book = filtered[i];
        let tagsText = book.tags ? book.tags.join(', ') : '';
        
        // TABLE ROW
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pages}</td>
            <td>${tagsText}</td>
            <td>${book.dateAdded}</td>
            <td>
                <button onclick="deleteBook('${book.id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
        
        // CARD (Mobile)
        let card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <h4>${book.title}</h4>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Pages:</strong> ${book.pages}</p>
            <p><strong>Date:</strong> ${book.dateAdded}</p>
            <p><strong>Tags:</strong> ${tagsText || 'None'}</p>
            ${book.notes ? '<p><strong>Notes:</strong> ' + book.notes + '</p>' : ''}
            <button onclick="deleteBook('${book.id}')">Delete</button>
        `;
        cardContainer.appendChild(card);
    }
}

// -------- 4. DELETE BOOK --------

function deleteBook(bookId) {
    console.log('Deleting book:', bookId);
    
    if (confirm('Delete this book?')) {
        let newList = [];
        for (let i = 0; i < books.length; i++) {
            if (books[i].id !== bookId) {
                newList.push(books[i]);
            }
        }
        books = newList;
        saveBooks();
        showAllBooks();
        updateStats();
        console.log('Book deleted!');
    }
}

// -------- 5. SEARCH --------

document.getElementById('search-input').addEventListener('input', function() {
    console.log('Searching:', this.value);
    showAllBooks();
});

document.getElementById('clear-search').addEventListener('click', function() {
    document.getElementById('search-input').value = '';
    showAllBooks();
});

// -------- 6. STATS --------

function updateStats() {
    console.log('Updating stats...');
    
    // Total books
    document.getElementById('total-books').textContent = books.length;
    
    // Total pages
    let totalPages = 0;
    for (let i = 0; i < books.length; i++) {
        totalPages += books[i].pages;
    }
    document.getElementById('total-pages').textContent = totalPages;
    document.getElementById('pages-read').textContent = totalPages;
    
    // Top tag
    let tagCount = {};
    for (let i = 0; i < books.length; i++) {
        let tags = books[i].tags || [];
        for (let j = 0; j < tags.length; j++) {
            let tag = tags[j];
            tagCount[tag] = (tagCount[tag] || 0) + 1;
        }
    }
    let topTag = '—';
    let max = 0;
    for (let tag in tagCount) {
        if (tagCount[tag] > max) {
            max = tagCount[tag];
            topTag = tag;
        }
    }
    document.getElementById('top-tag').textContent = topTag;
    
    // This week
    let now = new Date();
    let weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    let recent = 0;
    for (let i = 0; i < books.length; i++) {
        let bookDate = new Date(books[i].dateAdded);
        if (bookDate >= weekAgo) recent++;
    }
    document.getElementById('recent-books').textContent = recent;
    
    // Progress bar
    let cap = 1000;
    let percent = Math.min(100, (totalPages / cap) * 100);
    document.getElementById('progress-fill').style.width = percent + '%';
    
    console.log('Stats updated! Total books:', books.length);
}

// -------- 7. EXPORT DATA --------

document.getElementById('export-btn').addEventListener('click', function() {
    console.log('Exporting data...');
    
    let data = JSON.stringify(books, null, 2);
    let blob = new Blob([data], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'books-backup.json';
    a.click();
    
    console.log('Data exported!');
});

// -------- 8. START APP --------

console.log('🚀 App starting...');
showAllBooks();
updateStats();
console.log('✅ App is ready!');