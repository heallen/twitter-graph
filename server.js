const express = require('express')
const app = express()
const port = 3001
var cors = require('cors')
const bodyParser = require('body-parser');

const { scrapeTwitter } = require('./scrapeTwitter');

app.use(bodyParser.json());
app.use(cors())
// one endpoint to do all the computation (i.e. build graph, run pagerank)
app.post('/', async (req, res) => {
  // req.body.handleList contains list of handles as strings
  const graph = await scrapeTwitter(req.body.handleList);
  res.send(JSON.stringify({
    graph: graph,
  }));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))