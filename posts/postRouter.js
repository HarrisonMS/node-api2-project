const express = require("express");

const router = express.Router();

const Posts = require("./postModel");

router.use(express.json());

module.exports = router;