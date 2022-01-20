require('dotenv').config()
const express = require("express");
const {initDb} = require('./util')
const jwt = require('./util/jwt');
const routes = require('./routes')
const cors = require('cors');

const app = express();

const HTTP_PORT = 8000;
app.use(express.json());
app.use(cors());
app.use(jwt());


let db;

app.listen(HTTP_PORT, () => {
  console.log("Server is listening on port " + HTTP_PORT);

  initDb(db).then((db)=>{
      routes(app, db)
  })
});