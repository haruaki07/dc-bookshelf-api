const { addBookHandler, getAllBooksHandler, getBookDetailHandler, updateBookHandler, deleteBookHandler } = require("./handlers")

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: addBookHandler,
  },
  {
    method: "GET",
    path: "/books",
    handler: getAllBooksHandler
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: getBookDetailHandler
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: updateBookHandler
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deleteBookHandler
  }
]

module.exports = routes
