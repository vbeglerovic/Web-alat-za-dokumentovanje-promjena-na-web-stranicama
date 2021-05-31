const express = require('express')
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
  mainMethod.stopTracking().then(
    res.send("Praćenje zaustavljeno!"))
  })

  app.get('/checkStatus', (req, res) => {
    mainMethod.checkStatus().then(function (result) {
      res.send(result)})
    });
  
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})