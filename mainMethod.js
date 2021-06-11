const {Builder, By, Key, until} = require('selenium-webdriver')
const domCompare = require ('dom-compare')
const xmldom = require('xmldom')
const domparser = new (xmldom.DOMParser)();
const fs = require('fs');


const stringMethod = require('./stringMethod.js');

let status = [ {id: 0, message: "Sačekajte!"}, {id: 1, message: "Praćenje je počelo!"},{id: 2, message: "Vrijeme je isteklo, možete preuzeti datoteku sa promjenama!"}, {id: 3, message:"Stranica se ne može otvoriti!"}, {id:4, message: "Ne može se dobiti izvorni kod stranice!"}, {id:5, message: "Praćenje je zaustavljeno, možete preuzeti datoteku sa promjenama!"}]

let sessions = []; 
let array = [];
var interval = 0;
let currentStatus = status[0];




function returnBrowser (browser) {
  switch(browser) {
    case 'Chrome':
      return 'chrome';
    case 'Internet Explorer':
      return 'ie';
    case 'Microsoft Edge':
      return 'edge';
    case 'Mozilla Firefox':
      return 'firefox';
  }
}


async function trackChanges (url, browser, end, width, height) {
  let expected = null
  let actual = null
  let trackingTime = new Date(end) - new Date()
  let period = 10000  //treba oko 10000 ms jer ne stigne zatvoriti prethodno otvorenu stranicu
  let startDate = new Date();
  

  browser = returnBrowser (browser);

  var driver;
  let x = parseInt(width);
  let y = parseInt(height)
  try {
    driver = new Builder().forBrowser(browser).build();
    await driver.manage().window().setRect({width:x, height:y});
    await driver.get(url);
    trackingTime = new Date(end) - new Date()
    currentStatus = status[1]
    startDate = new Date();
    
} catch (err) {
  currentStatus = status[3]
    await driver.quit();
    return;
   };

   setTimeout(async () => {
    clearInterval(interval);
    writeChangesInFile("dat1.txt",array);
    currentStatus = status[2]
    await driver.quit();
    return;
  }, trackingTime);


  interval = setInterval(async function() {
    try {
        driver.getPageSource().then(function(source) {
            if (expected == null) 
                expected = domparser.parseFromString(source, "text/html");
            else {
                actual = domparser.parseFromString(source, "text/html");
                compare(array, expected, actual, startDate);
                expected = actual;
            }
        });
    } catch (err) {
        currentStatus = status[4]
        await driver.quit();
        return;        
    }
  }, period);
}


  
function compare (array, expected, actual, startDate) {
    let result = domCompare.compare(expected, actual); 
    let diff = result.getDifferences(); // array of diff-objects
    let brojac = array.length;
    for (i = 0; i < diff.length; i++) {
      let parameters = stringMethod.getParameters(diff[i].message)
      let tip = "promijenjen sadržaj elementa"
      if (diff[i].message.includes('Extra element')) {
        tip = "dodan novi element " + parameters[0];
        parameters[0] = "/";
        parameters[1] = "/";
      }
      let newChange = {
        id: brojac+i,
        element: diff[i].node,
        tip: tip,
        sadrzaj_prije: parameters['0'],
        sadrzaj_poslije: parameters['1'],
        datum: new Date(),
        vrijeme: (new Date() - new Date(startDate))/1000
      }
      array.push(newChange);
    }
  }

  
  
  async function stopTracking () {
    clearInterval(interval);
    currentStatus = status[5]
    writeChangesInFile("./public/allFiles/dat6.txt", array);
    return JSON.stringify(currentStatus);

  }

  async function checkStatus () {
    return JSON.stringify(currentStatus);
  }

  function writeChangesInFile (name, array) {
    let data ="[";
    console.log(array.length);
    for (i = 0; i <array.length; i++) {
      data=data+JSON.stringify(array[i]);
      if (i!=array.length-1) {
        data=data+",\n";
      }
    }
    data=data+"]";
    fs.writeFile(name, data, function (err) {
      if (err) console.log(err);
    });
  }

  

  module.exports.trackChanges = trackChanges;
  module.exports.stopTracking = stopTracking;
  module.exports.checkStatus = checkStatus;