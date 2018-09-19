let express = require('express')
let request = require('request')
let querystring = require('querystring')
require('dotenv').config()

let app = express();

app.use(express.static('frontend/build'));

app.get('/', (req, res) => {
  res.sendFile('index');
});

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)