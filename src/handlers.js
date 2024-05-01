const { nanoid } = require("nanoid")
const books = require("./books")

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400)
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400)
  }

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const idx = books.push({
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    insertedAt,
    updatedAt,
  })

  if (idx === books.length) {
    return h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: { bookId: id },
      })
      .code(201)
  }
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query

  let filteredBooks = books

  if (name || reading || finished) {
    filteredBooks = filteredBooks.filter((b) => {
      const isNameMatched =
        name && b.name.toLowerCase().includes(name.toLowerCase())
      const isReadingMatched = reading && b.reading === (reading == 1)
      const isFinishedMatched = finished && b.finished === (finished == 1)

      return isNameMatched || isReadingMatched || isFinishedMatched
    })
  }

  return h.response({
    status: "success",
    data: {
      books: filteredBooks.map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      })),
    },
  })
}

const getBookDetailHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.find((b) => b.id === bookId)
  if (!book) {
    return h
      .response({
        status: "fail",
        message: "Buku tidak ditemukan",
      })
      .code(404)
  }

  return h.response({
    status: "success",
    data: { book },
  })
}

const updateBookHandler = (request, h) => {
  const { bookId } = request.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload
  const updatedAt = new Date().toISOString()

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400)
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400)
  }

  const idx = books.findIndex((b) => b.id === bookId)
  if (idx === -1) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(404)
  }

  books[idx] = {
    ...books[idx],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  }

  return h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  })
}

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params

  const idx = books.findIndex((b) => b.id === bookId)
  if (idx === -1) {
    return h
      .response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      })
      .code(404)
  }

  books.splice(idx, 1)

  return h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  })
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookDetailHandler,
  updateBookHandler,
  deleteBookHandler,
}
