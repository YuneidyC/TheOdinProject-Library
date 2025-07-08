const myLibrary = [];
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const form = document.querySelector('.form');
const add = document.querySelector('.add');
const body = document.querySelector('body');
const edit = document.querySelector('.edit');
const submit = document.querySelector('.submit');

add.addEventListener('click', (e) => {
    submit.classList.remove('hidden');
    edit.classList.add('hidden');
    openModal();
});

function Book(title, author, numPages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.read = read;
    this.index = myLibrary.length + 1;
}

addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 295, false);

function addBookToLibrary(title, author, numPages, read) {
    const newBook = new Book(title, author, numPages, read);
    myLibrary.push(newBook);
    addBookCard(newBook);
};

function checkIfBookAlreadyExist(title) {
    return myLibrary.find(book => title === book.title);
};

function openModal(id) {
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');

    if (id !== null) {
        modal.dataset.bookId = id;
    }

    modal.children[0][0].value = '';
    modal.children[0][1].value = '';
    modal.children[0][2].value = '';
}

createModal();

function createModal() {
    const spanClose = document.createElement('span');

    modal.appendChild(spanClose);
    spanClose.textContent = "x"
    spanClose.classList.add('close');

    spanClose.onclick = function (e) {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    }

    form.addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = parseInt(document.getElementById('numPages').value);
    const checkbox = document.querySelector('.check').checked;

    if (event.submitter.value === 'Submit') {
        edit.classList.add('hidden');
        submit.classList.remove('hidden');

        if (checkIfBookAlreadyExist(title)) {
            alert('This book already exists');
        } else {
            addBookToLibrary(title, author, pages, checkbox);
            modal.classList.add('hidden');
            overlay.classList.add('hidden');
        }
    }

    if (event.submitter.value === 'Edit') {
        editBook(modal.dataset.bookId, title, author, pages, checkbox);

        edit.classList.remove('hidden');
        submit.classList.add('hidden');
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    }
}

function addBookCard(newBook) {
    const book = myLibrary.find(book => book.id === newBook.id);
    const library = document.querySelector('.library');

    const card = document.createElement('div');
    card.className = `book-card ${myLibrary.length}`;
    library.appendChild(card);

    const cardHeader = document.createElement('h3');
    cardHeader.classList.add('book-card_title');
    cardHeader.innerHTML = book.title;
    card.appendChild(cardHeader);

    const cardAuthor = document.createElement('p');
    cardAuthor.classList.add('book-card_author');
    cardAuthor.innerHTML = '<strong>Author: </strong>' + book.author;
    card.appendChild(cardAuthor);

    const cardPages = document.createElement('p');
    cardPages.classList.add('book-card_pages');
    cardPages.innerHTML = '<strong>Pages: </strong>' + book.numPages;
    card.appendChild(cardPages);

    const status = document.createElement('p');
    status.classList.add('book-card_read');
    status.innerHTML = '<strong>Read: </strong>';
    card.appendChild(status);

    const checkbox = document.createElement('input');
    checkbox.classList.add('check');
    checkbox.type = 'checkbox';
    checkbox.disabled = true;
    status.appendChild(checkbox);

    checkbox.checked = book.read;

    const buttonContainer = document.createElement('div');
    card.appendChild(buttonContainer);
    buttonContainer.classList.add('button-container');

    createDeleteButton(buttonContainer, card);
    createEditButton(buttonContainer, card);
}

function createDeleteButton(container, parent) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'Delete'

    container.appendChild(deleteButton);

    deleteButton.addEventListener('click', (event) => {
        removeBookFromLibrary(parent);
        parent.remove();
        event.preventDefault();
    });
}

function createEditButton(container, parent) {
    const editButton = document.createElement('button');
    editButton.classList.add('edit-btn');
    editButton.textContent = 'Edit'
    editButton.id = parent.classList[1];

    container.appendChild(editButton);

    editButton.addEventListener('click', () => {
        openModal(editButton.id);

        const book = myLibrary.find(x => x.index === parseInt(editButton.id));

        submit.classList.add('hidden');
        edit.classList.remove('hidden');

        modal.children[0][0].value = book.title;
        modal.children[0][1].value = book.author;
        modal.children[0][2].value = book.numPages;
        modal.children[0][3].checked = book.read;
    });
};

function editBook(bookId, titleInput, authorInput, pagesInput, checkbox) {
    const cardBook = document.getElementsByClassName('book-card');

    const idx = parseInt(bookId);
    const book = myLibrary.find(x => x.index === idx);

    if (checkbox !== book.read) {
        book.read = checkbox;
        cardBook[idx - 1].children[3].childNodes[1].checked = book.read;
    }

    if (titleInput !== book.title) {
        book.title = titleInput;
        cardBook[idx - 1].children[0].innerHTML = book.title;
    }

    if (authorInput !== book.author) {
        book.author = authorInput;
        cardBook[idx - 1].children[1].lastChild.data = book.author;
    }

    if (parseInt(pagesInput) !== book.numPages) {
        book.numPages = parseInt(pagesInput);
        cardBook[idx - 1].children[2].lastChild.data = book.numPages;
    }
}

function removeBookFromLibrary(parent) {
    const idx = myLibrary.findIndex(({ index }) => index === parseInt(parent.classList[1]));
    const arrBookCards = document.getElementsByClassName('book-card');
    const editButton = document.getElementsByClassName('edit-btn');

    if (idx !== -1) {
        myLibrary.splice(idx, 1);

        removeClassIdBookCards(idx, arrBookCards);

        for (let i = 0; i < myLibrary.length; i++) {
            let incr = i + 1;
            myLibrary[i].index = incr;
            arrBookCards[i].classList.add(incr);
            editButton[i].id = incr;
        }
    }
}

function removeClassIdBookCards(idx, elements) {
    for (let i = 0; i < elements.length; i++) {
        if (i === idx) {
            elements[idx].remove();
        }

        if (elements[i] !== undefined) {
            let classRemove = elements[i].classList[1];
            elements[i].classList.remove(classRemove);
        }
    }
}
