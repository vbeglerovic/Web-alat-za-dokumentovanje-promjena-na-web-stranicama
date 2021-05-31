const {Builder, By, Key, until} = require('selenium-webdriver')
const domCompare = require ('dom-compare')
const xmldom = require('xmldom')
const domparser = new (xmldom.DOMParser)();
const DOMParser = require('dom-parser')
const stringMethod = require('./stringMethod.js');


var interval = 0;
let status = "noTracking";



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
  let array = [];
  let startDate = new Date();

  browser = returnBrowser (browser);

  console.log(width+" "+height)
  var driver;
  let x = parseInt(width);
  let y = parseInt(height)
  try {
    driver = new Builder().forBrowser(browser).build();
    await driver.manage().window().setRect({width:x, height:y});
    await driver.get(url);
    status = "Praćenje je počelo!"
    startDate = new Date();
    
} catch (err) {
    status = "Stranica se ne može otvoriti!";
    await driver.quit();
    return;
   };

   setTimeout(async () => {
    clearInterval(interval);
    console.log(array);
    await driver.quit();
    status = "Vrijeme je isteklo, promjene su zabilježene!";
    return;
  }, trackingTime);


  interval = setInterval(async function() {
    try {
        driver.getPageSource().then(function(source) {
            if (expected == null) 
                expected = domparser.parseFromString(source, "text/html");
            else {
                actual = domparser.parseFromString(source, "text/html");
                compare(array, expected, actual);
                expected = actual;
            }
        });
    } catch (err) {
        status = "Ne može se dobiri izvorni kod stranice!";
        await driver.quit();
        return;        
    }
  }, period);
}


  
function compare (array, expected, actual) {
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
        vrijeme: (new Date(startDate) - new Date())/1000
      }
      array.push(newChange);
    }
  }

  
  
  async function stopTracking () {
    clearInterval(interval);
    status = "Praćenje zaustavljeno!"
  }

  async function checkStatus () {
    return status;
  }

  

  module.exports.trackChanges = trackChanges;
  module.exports.stopTracking = stopTracking;
  module.exports.checkStatus = checkStatus;