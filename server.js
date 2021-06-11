const express = require('express')
const fs = require('fs');
const dirTree = require("directory-tree");
const app = express()
const port = 8000
const mainMethod = require('./mainMethod.js');

app.use(express.static('public'))
app.use(express.urlencoded());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/documentChanges', async (req, res) => {
  let {url, browser, endDate, width, height} = req.body;
  mainMethod.trackChanges(url, browser, endDate, width, height);
  res.send("Sačekajte...");
});

app.get('/stopTracking', (req, res) => {
  mainMethod.stopTracking().then(function (result) {
    res.send(result)})
  })

  app.get('/checkStatus', (req, res) => {
    mainMethod.checkStatus().then(function (result) {
      res.send(result)})
    });

    app.get('/allFiles', (req, res) => {
      let path = 'allFiles/';
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      const tree = dirTree(path);
      res.status(200);
      res.send(tree);
    });
  
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})