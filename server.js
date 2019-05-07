const express = require('express')
const app = express()
const port = 3001
var cors = require('cors')
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors())
// one endpoint to do all the computation (i.e. build graph, run pagerank)
app.post('/', (req, res) => {
  // req.body.handleList contains list of handles as strings
  console.log(req.body.handleList);
  res.send(JSON.stringify({
    'heelo': 'Hello World!'
  }));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))