const express = require('express')

const database = require('./data/db')

const server = express();

server.use(express.json())

server.get('/', (_req, res) => {
    res.send('Homepage of local API')
})

server.get('/api/posts', (_req, res) => {
    database.find()
    .then(posts => res.status(200).json(posts))
    .catch( () => res.status(500).json({ error: "The posts information could not be retrieved." }))
})

server.listen(4001, () => {
    console.log('\n*** Server Running on http://localhost:4001 ***\n');
  });
  