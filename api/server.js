const express = require("express");

const postRouter = require("../posts/postRouter")
const server = express();

server.use(express.json())

server.get('/', (req, res) => {
  res.send({api: " server is up and running"})
})

server.use("/api/posts", postRouter)

module.exports = server;