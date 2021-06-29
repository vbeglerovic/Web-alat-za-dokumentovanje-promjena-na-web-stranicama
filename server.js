const express = require('express')
const fs = require('fs');
const dirTree = require("directory-tree");
const app = express()
const port = 8000
const mainMethod = require('./mainMethod.js');
const compare = require('./compare.js');

app.use(express.static('public'))
app.use(express.urlencoded());

app.use(express.json());

app.post('/documentChanges', async (req, res) => {
  let {url, browser, endDate, width, height} = req.body;
  mainMethod.trackChanges(url, browser, endDate, width, height);
  res.send("Wait...");
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
      let path = 'public/allFiles/';
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      const tree = dirTree(path);
      res.send(tree);
    });

    app.post("/compare", (req, res) => {
      let {fileName1, fileName2} = req.body
      let path = 'public/allFiles/';
      let file1 = fs.readFileSync(path + fileName1, {encoding:'utf8'});
      let file2 = fs.readFileSync(path + fileName2, {encoding:'utf8'});
      file1 = JSON.parse(file1)
      file2 = JSON.parse(file2)
    
      let changes = compare.compareArrays(file1.changes, file2.changes)

      let response = {
        data1: file1.data,
        data2: file2.data,
        changes1: changes.changes1,
        changes2: changes.changes2
      }
      console.log(changes.changesArray1)
      JSON.stringify(response)
      res.send(response);
    });
  
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})