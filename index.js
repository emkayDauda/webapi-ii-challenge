const express = require('express')

const database = require('./data/db')

const server = express();

server.use(express.json())

server.get('/', (req, res) => {
    res.send('Homepage of local API')
})

server.listen(4001, () => {
    console.log('\n*** Server Running on http://localhost:4001 ***\n');
  });
  