const express = require("express");

const postRouter = require("../posts/postRouter")
const server = express();

server.use(express.json())

server.get('/', (req, res) => {
    res.send(`
      <h2>Lambda Hubs API</h>
      <p>Welcome to the Lambda Hubs API</p>
    `);
  });

server.use("/api/posts", postRouter)

module.exports = server;