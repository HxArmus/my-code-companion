const express = require("express");
const { getTopArticles } = require("../controllers/articlesController").default;
const router = express.Router();

router.get("/default", getTopArticles);

module.exports = router;
