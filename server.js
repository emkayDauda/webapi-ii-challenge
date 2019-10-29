const express = require("express");
const router = require('./routers/postRoutes')

const server = express();

server.use(express.json());

server.use('/api/posts', router)

server.get("/", (_req, res) => {
    res.send("Homepage of local API");
  });
  
module.exports = server;