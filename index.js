const myLibrary = [];
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const form = document.querySelector('.form');
const add = document.querySelector('.add');
const body = document.querySelector('body');
const edit = document.querySelector('.edit');
const submit = document.querySelector('.submit');

add.addEventListener('click', () => {
    modal.childNodes[1][4].classList.remove('hidden');
    modal.childNodes[1][5].classList.add('hidden');
    openModal();
});

function Book(title, author, numPages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.read = read;
    this.search = myLibrary.length + 1;
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

function openModal() {
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');

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

    spanClose.onclick = function () {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    }

    form.addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
    event.preventDefault();

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
        const indexArr = myLibrary.findIndex(( book ) => book.title === title);

        editBook(indexArr);

        edit.classList.remove('hidden');
        submit.classList.add('hidden');
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    }
}

function addBookCard() {
    const lastBook = myLibrary[myLibrary.length - 1];
    const library = document.querySelector('.library');

    const card = document.createElement('div');
    card.className = `book-card ${myLibrary.length}`;
    library.appendChild(card);

    const cardHeader = document.createElement('h3');
    cardHeader.innerHTML = lastBook.title;
    card.appendChild(cardHeader);

    const cardAuthor = document.createElement('p');
    cardAuthor.innerHTML = '<strong>Author: </strong>' + lastBook.author;
    card.appendChild(cardAuthor);

    const cardPages = document.createElement('p');
    cardPages.innerHTML = '<strong>Pages: </strong>' + lastBook.numPages;
    card.appendChild(cardPages);

    const status = document.createElement('p');
    status.innerHTML = '<strong>Read: </strong>';
    card.appendChild(status);

    const checkbox = document.createElement('input');
    checkbox.classList.add('check');
    checkbox.type = 'checkbox';
    checkbox.disabled = true;
    status.appendChild(checkbox);

    checkbox.checked = lastBook.read;

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

    deleteButton.addEventListener('click', () => {
        removeBookFromLibrary(parent);
        parent.remove();
    });
}

function createEditButton(container, parent) {
    const editButton = document.createElement('button');

    editButton.classList.add('edit-btn');
    editButton.textContent = 'Edit'

    container.appendChild(editButton);

    editButton.addEventListener('click', () => {
        openModal();
        const titleInput = parent.childNodes[0].innerHTML;
        const authorInput = parent.childNodes[1].lastChild.data;
        const pagesInput = parent.childNodes[2].lastChild.data;

        modal.childNodes[1][4].classList.add('hidden');
        modal.childNodes[1][5].classList.remove('hidden');

        modal.children[0][0].value = titleInput;
        modal.children[0][1].value = authorInput;
        modal.children[0][2].value = pagesInput;
    });
};

function editBook(indexArr) {
    const titleInput = document.querySelector('#title');
    const authorInput = document.querySelector('#author');
    const pagesInput = document.querySelector('#numPages');
    const cardBook = document.getElementsByClassName('book-card');
    const checkbox = document.querySelector('.check');

    const idx = parseInt(cardBook[indexArr].className.split(' ')[1]);
    const book = myLibrary.find(({ search }) => search === idx);

    titleInput.addEventListener('input', () => {
        titleInput.textContent = titleInput.value;
    });

    authorInput.addEventListener('input', () => {
        authorInput.textContent = authorInput.value;
    });

    pagesInput.addEventListener('input', () => {
        pagesInput.textContent = pagesInput.value;
    });

    if (checkbox.checked !== book.read) {
        book.read = checkbox.checked;
        cardBook[idx - 1].children[3].childNodes[1].checked = checkbox.checked;
    }

    if (titleInput !== book.title) {
        book.title = titleInput.value;
        cardBook[idx - 1].children[0].innerHTML = titleInput.value;
    }

    if (authorInput !== book.author) {
        book.author = authorInput.value;
        cardBook[idx - 1].children[1].lastChild.data = authorInput.value;
    }

    if (pagesInput !== book.pages) {
        book.numPages = parseInt(pagesInput.value);
        cardBook[idx - 1].children[2].lastChild.data = parseInt(pagesInput.value);
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
