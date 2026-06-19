console.log('Book Vault is ready!');

let books = [];
let saved = localStorage.getItem('myBooks');
if (saved) {
    books = JSON.parse(saved);
}
console.log('Books loaded:', books.length);

function saveBooks() {
    localStorage.setItem('myBooks', JSON.stringify(books));
    console.log('Books saved!');
}

function validateTitle(title) {
    if (!title || title.trim() === '') return 'Title is required';
    if (title.trim().length < 2) return 'Title must be at least 2 characters';
    if (/^\s|\s$/.test(title)) return 'Remove spaces at start or end';
    if (/\s{2,}/.test(title)) return 'Remove double spaces';
    return '';
}

function validateAuthor(author) {
    if (!author || author.trim() === '') return 'Author is required';
    if (!/^[A-Za-z][A-Za-z .'-]*$/.test(author)) {
        return 'Use only letters, spaces, hyphens, periods';
    }
    return '';
}

function validatePages(pages) {
    if (!pages) return 'Pages is required';
    let num = Number(pages);
    if (!/^(0|[1-9]\d*)$/.test(pages)) return 'Must be a whole number';
    if (num < 1) return 'Must be at least 1 page';
    if (num > 99999) return 'Maximum 99,999 pages';
    return '';
}

function validateDate(date) {
    if (!date) return 'Date is required';
    if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date)) {
        return 'Invalid date format (YYYY-MM-DD)';
    }
    return '';
}

function validateTags(tagsString) {
    if (!tagsString || tagsString.trim() === '') return '';
    let tags = tagsString.split(',').map(t => t.trim());
    for (let i = 0; i < tags.length; i++) {
        if (!/^[A-Za-z][A-Za-z -]*$/.test(tags[i])) {
            return 'Invalid tag: "' + tags[i] + '". Use letters, spaces, hyphens';
        }
    }
    return '';
}

function showFieldError(fieldId, message) {
    let errorSpan = document.getElementById(fieldId + '-error');
    let input = document.getElementById(fieldId);
    if (message) {
        input.style.borderColor = '#cc0000';
        errorSpan.textContent = message;
    } else {
        input.style.borderColor = '#e0d5c5';
        errorSpan.textContent = '';
    }
}

function clearAllErrors() {
    let fields = ['title', 'author', 'pages', 'dateAdded', 'tags'];
    for (let i = 0; i < fields.length; i++) {
        showFieldError(fields[i], '');
    }
}

document.getElementById('book-form').addEventListener('submit', function(send) {
    send.preventDefault();
    console.log('Form submitted!');
    
    let title = document.getElementById('title').value;
    let author = document.getElementById('author').value;
    let pages = document.getElementById('pages').value;
    let dateAdded = document.getElementById('dateAdded').value;
    let tags = document.getElementById('tags').value;
    let notes = document.getElementById('notes').value;
    
    clearAllErrors();
    
    let titleError = validateTitle(title);
    let authorError = validateAuthor(author);
    let pagesError = validatePages(pages);
    let dateError = validateDate(dateAdded);
    let tagsError = validateTags(tags);
    
    if (titleError) showFieldError('title', titleError);
    if (authorError) showFieldError('author', authorError);
    if (pagesError) showFieldError('pages', pagesError);
    if (dateError) showFieldError('dateAdded', dateError);
    if (tagsError) showFieldError('tags', tagsError);
    
    if (titleError || authorError || pagesError || dateError || tagsError) {
        document.getElementById('form-status').textContent = 'Please fix the errors above';
        document.getElementById('form-status').style.color = 'red';
        return;
    }
    
    let newBook = {
        id: 'book_' + Date.now(),
        title: title.trim(),
        author: author.trim(),
        pages: Number(pages),
        dateAdded: dateAdded,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        notes: notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    books.push(newBook);
    console.log('New book added:', newBook.title);
    
    saveBooks();
    showAllBooks();
    updateStats();
    
    document.getElementById('book-form').reset();
    document.getElementById('form-status').textContent = 'Great! Book added successfully!';
    document.getElementById('form-status').style.color = 'green';
});

function showAllBooks() {
    console.log('Showing all books...');
    
    let searchTerm = document.getElementById('search-input').value.toLowerCase();
    let tableBody = document.getElementById('table-body');
    let cardContainer = document.getElementById('card-container');
    let noResults = document.getElementById('no-results-message');
    
    tableBody.innerHTML = '';
    cardContainer.innerHTML = '';
    
    let filtered = books;
    if (searchTerm) {
        filtered = books.filter(function(book) {
            return book.title.toLowerCase().includes(searchTerm) ||
                   book.author.toLowerCase().includes(searchTerm) ||
                   (book.tags && book.tags.join(' ').toLowerCase().includes(searchTerm));
        });
    }
    
    filtered.sort(function(a, b) {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    });
    
    console.log('Books to show:', filtered.length);
    
    if (filtered.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    noResults.style.display = 'none';
    
    for (let i = 0; i < filtered.length; i++) {
        let book = filtered[i];
        let tagsText = book.tags ? book.tags.join(', ') : '';
        
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

document.getElementById('search-input').addEventListener('input', function() {
    console.log('Searching:', this.value);
    showAllBooks();
});

document.getElementById('clear-search').addEventListener('click', function() {
    document.getElementById('search-input').value = '';
    showAllBooks();
});

function updateStats() {
    console.log('Updating stats...');
    
    document.getElementById('total-books').textContent = books.length;
    
    let totalPages = 0;
    for (let i = 0; i < books.length; i++) {
        totalPages += books[i].pages;
    }
    document.getElementById('total-pages').textContent = totalPages;
    document.getElementById('pages-read').textContent = totalPages;
    
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
    
    let now = new Date();
    let weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    let recent = 0;
    for (let i = 0; i < books.length; i++) {
        let bookDate = new Date(books[i].dateAdded);
        if (bookDate >= weekAgo) recent++;
    }
    document.getElementById('recent-books').textContent = recent;
    
    let cap = 1000;
    let percent = Math.min(100, (totalPages / cap) * 100);
    document.getElementById('progress-fill').style.width = percent + '%';
    
    console.log('Stats updated! Total books:', books.length);
}

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

console.log('App starting...');
showAllBooks();
updateStats();
console.log('App is ready!');
