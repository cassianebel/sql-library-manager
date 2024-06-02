var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const { Op } = require("sequelize");

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  // const books = await Book.findAll();
  // res.render("books/index", { books })

  let url = '/books?';

  // Get page from query string parameters or default to first page
  const page = parseInt(req.query.page) || 1;

  // Set the number of items per page
  const pageSize = 5;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  // Use findAndCountAll to get total count and limited rows
  const result = await Book.findAndCountAll({
    where: {}, // where conditions, or an empty object if there are none
    offset: offset,
    limit: pageSize,
  });

  // Calculate the total pages
  const totalPages = Math.ceil(result.count / pageSize);

  res.render("books/index", {
    books: result.rows,
    totalPages,
    currentPage: page,
    url: url,
  });
}));


/* GET new book form. */
router.get('/new', (req, res, next) => {
  res.render("books/new-book");
});


/* POST new book form. */
router.post('/new', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books")
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/new-book", { book, errors: error.errors })
    } else {
      throw error;
    }
  }
}));


/* Book detail page. */
router.get('/:id/update', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  res.render("books/update-book", { book })
}));


/* POST update book details. */
router.post('/:id/update', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect("/books")
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("books/update-book", { book, errors: error.errors })
    } else {
      throw error;
    }
  }
}));


/* POST delete book. */
router.post('/:id/delete', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect("/books")
}));


/* Search for books. */
router.get('/search', asyncHandler(async (req, res, next) => {
  let search = req.query.query;
  let url = '/books/search?query=' + search + '&';

  // Get page from query string parameters or default to first page
  const page = parseInt(req.query.page) || 1;

  // Set the number of items per page
  const pageSize = 5;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  // Use findAndCountAll to get total count and limited rows
  const result = await Book.findAndCountAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${search}%`
          }
        },
        {
          author: {
            [Op.like]: `%${search}%`
          }
        },
        {
          genre: {
            [Op.like]: `%${search}%`
          }
        },
        {
          year: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    },
    offset: offset,
    limit: pageSize,
  });

  // Calculate the total pages
  const totalPages = Math.ceil(result.count / pageSize);

  res.render("books/index", {
    books: result.rows,
    totalPages,
    currentPage: page,
    url: url,
  });
}));


module.exports = router;
