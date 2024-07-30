const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;
require('dotenv').config();

const db = require('./queries');
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.send('Hello world!');
})

app.get('/api/env', (req, res) => {
  let envString = '';
  for (const key of Object.keys(process.env)) {
    envString = `${envString}<br />${key} = ${process.env[key]}`;
  }
  res.send('Environment variables: <br />' + envString);
})

app.get('/api/items', db.getItems);
app.post('/api/items', db.addItem);
app.delete('/api/items/:id', db.deleteItem);

const listen = () => {
  app.listen(port, () => {
    console.log(`Test Example app listening on port ${port}`)
  })
}

db.initializeDatabase(listen);
