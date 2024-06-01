var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render("books/index")
});

/* GET new book form. */
router.get('/new', (req, res, next) => {
  res.render("books/new-book")
});

/* POST new book form. */
router.post('/new', (req, res, next) => {
  res.redirect("/books")
});

/* Book detail page. */
router.get('/:id', (req, res, next) => {
  res.render("books/update-book")
});


module.exports = router;
