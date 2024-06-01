var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

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
  const books = await Book.findAll();
  res.render("books/index", { books })
}));

/* GET new book form. */
router.get('/new', (req, res, next) => {
  res.render("books/new-book");
});

/* POST new book form. */
router.post('/', asyncHandler(async (req, res, next) => {
  const book = await Book.create(req.body);
  res.redirect("/books")
}));

/* Book detail page. */
router.get('/update/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  res.render("books/update-book", { book })
}));

/* POST update book details. */
router.post('/:id', (req, res, next) => {
  res.redirect("/books")
});

/* POST delete book. */
router.post('/:id/delete', (req, res, next) => {
  res.redirect("/books")
});


module.exports = router;
