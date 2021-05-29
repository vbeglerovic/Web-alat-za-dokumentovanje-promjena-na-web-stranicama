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

app.post('/documentChanges', (req, res) => {
  let {url, browser, endDate, startDate} = req.body;
  mainMethod.trackChanges(url, browser, endDate, startDate).then(function(result) {
    res.send(result)})
});

app.get('/stopTracking', (req, res) => {
  mainMethod.stopTracking().then(
    res.send("Praćenje zaustavljeno!"))
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})