const books = [];
const RENDER_EVENT = 'render';
const SAVED_EVENT = 'saved';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser does not support local storage');
        return false;
    }
    return true;
}

function saveData () {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem('STORAGE_KEY', parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem('STORAGE_KEY');
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateID() {
    return +new Date();
    }
  
function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete
    };
  }

function addBook() {
    const titleBook = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value;
    const yearsBook =  document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete');

    let status;
    if (isComplete.checked) {
        status = true;
    } else {
        status = false;
    }

    const generatedID = generateID();
    const bookObject = generateBookObject(generatedID, titleBook, authorBook, parseInt(yearsBook), status);
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    console.log(bookObject);
}
    
function makeBook(bookObject) {
    const titleBook = document.createElement('h3');
    titleBook.innerText = bookObject.title;

    const authorBook = document.createElement('p');
    authorBook.innerText = bookObject.author;

    const yearsBook = document.createElement('p');
    yearsBook.innerText = bookObject.year;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(titleBook, authorBook, yearsBook);
    container.setAttribute('id', `book-${bookObject.id}`);
    
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');

    if (bookObject.isComplete) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = 'Belum Selesai Dibaca';
        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus Buku'
        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });

        buttonContainer.append(undoButton, trashButton);

    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = 'Selesai Dibaca'
        checkButton.addEventListener('click', function () {
            checkBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus Buku';
        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });

        buttonContainer.append(checkButton, trashButton);
    }

    container.appendChild(buttonContainer);
    return container;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookList = document.getElementById('incompleteBookshelfList');
    incompleteBookList.innerHTML = '';

    const completeBookList = document.getElementById('completeBookshelfList');
    completeBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);

        if (bookItem.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    }
  });

function checkBookToCompleted(bookID) {
    const bookTarget = findBook(bookID);

    if (bookTarget == null) {
        return;
    }

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(bookID) {
    const bookTarget = findBookIndex(bookID);

    if (bookTarget === -1) {
        return;
    }

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookID) {
    const bookTarget = findBook(bookID);

    if (bookTarget === null) {
        return;
    }

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookID) {
    for (const bookItem of books) {
        if (bookItem.id === bookID) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookID) {
    for (const index in books) {
        if (books[index].id === bookID) {
            return index;
        }
    }
}