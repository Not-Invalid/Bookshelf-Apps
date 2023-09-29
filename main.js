document.addEventListener("DOMContentLoaded", function () {
  const bookshelfDataKey = "bookshelf_data";
  let books = [];

  function saveBooksToLocalStorage() {
    localStorage.setItem(bookshelfDataKey, JSON.stringify(books));
  }

  function loadBooksFromLocalStorage() {
    const storedBooks = localStorage.getItem(bookshelfDataKey);
    if (storedBooks) {
      books = JSON.parse(storedBooks);
    }
  }

  function generateBookId() {
    return +new Date();
  }

  function addBookToShelf(title, author, year, isComplete) {
    const newBook = {
      id: generateBookId(),
      title,
      author,
      year,
      isComplete,
    };
    books.push(newBook);
    saveBooksToLocalStorage();
    return newBook;
  }

  function findBookIndexById(id) {
    return books.findIndex((book) => book.id === id);
  }

  function moveBookToShelf(id, isComplete) {
    const bookIndex = findBookIndexById(id);
    if (bookIndex !== -1) {
      books[bookIndex].isComplete = isComplete;
      saveBooksToLocalStorage();
    }
  }

  function removeBookFromShelf(id) {
    const bookIndex = findBookIndexById(id);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      saveBooksToLocalStorage();
    }
  }

  function renderBooks() {
    const incompleteBookshelf = document.getElementById("incompleteBookshelfList");
    const completeBookshelf = document.getElementById("completeBookshelfList");

    incompleteBookshelf.innerHTML = "";
    completeBookshelf.innerHTML = "";

    books.forEach((book) => {
      const bookItem = document.createElement("article");
      bookItem.classList.add("book_item");

      const bookTitle = document.createElement("h3");
      bookTitle.innerText = book.title;

      const bookAuthor = document.createElement("p");
      bookAuthor.innerText = `Penulis: ${book.author}`;

      const bookYear = document.createElement("p");
      bookYear.innerText = `Tahun: ${book.year}`;

      const actionContainer = document.createElement("div");
      actionContainer.classList.add("action");

      const actionButton = document.createElement("button");
      actionButton.innerText = book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca";
      actionButton.style.backgroundColor = "cornflowerblue"; 
      actionButton.style.color = "white"; 
      actionButton.addEventListener("click", () => {
        moveBookToShelf(book.id, !book.isComplete);
        renderBooks();
      });


      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Hapus buku";
      deleteButton.style.backgroundColor = "darkred";
      deleteButton.style.color = "white";
      deleteButton.addEventListener("click", () => {
        removeBookFromShelf(book.id);
        renderBooks();
      });

      actionContainer.appendChild(actionButton);
      actionContainer.appendChild(deleteButton);

      bookItem.appendChild(bookTitle);
      bookItem.appendChild(bookAuthor);
      bookItem.appendChild(bookYear);
      bookItem.appendChild(actionContainer);

      if (book.isComplete) {
        completeBookshelf.appendChild(bookItem);
      } else {
        incompleteBookshelf.appendChild(bookItem);
      }
    });
  }

  const inputBookForm = document.getElementById("inputBook");
  inputBookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("bookSubmit").getAttribute("data-status") === "completed";

    if (title && author && year) {
      addBookToShelf(title, author, parseInt(year), isComplete);
      renderBooks();
      inputBookForm.reset();
    }
  });

  document.getElementById("bookSubmit").addEventListener("click", function () {
    this.setAttribute("data-status", "completed");
  });

  document.getElementById("bookUnSubmit").addEventListener("click", function () {
    document.getElementById("bookSubmit").removeAttribute("data-status");
  });

  loadBooksFromLocalStorage();
  renderBooks();
});
