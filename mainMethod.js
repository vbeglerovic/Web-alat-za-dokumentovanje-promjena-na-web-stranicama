const {Builder, By, Key, until} = require('selenium-webdriver')
const domCompare = require ('dom-compare')
const xmldom = require('xmldom')
const domparser = new (xmldom.DOMParser)();
const DOMParser = require('dom-parser')
const stringMethod = require('./stringMethod.js');


var interval = 0;
let array = [];

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

async function trackChanges (url, browser, end, start) {
  let expected = null
  let actual = null
  let trackingTime = new Date(end) - new Date(start)
  let period = 10000  //treba oko 10000 ms jer ne stigne zatvoriti prethodno otvorenu stranicu

  browser = returnBrowser (browser);

  var driver;
  try {
      driver = new Builder().forBrowser(browser).build();
      let page = await driver.get(url)
  } catch (err) {
      await driver.quit();
      return 'Could not open the page!';
  }
  setTimeout(async function () {
    clearInterval(interval);
    await driver.quit();
    console.log(array)
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
        console.log('Could not get page source!');
        await driver.quit();        
    }
  }, period);
}


  
function compare (array, expected, actual) {
    // compare to DOM trees, get a result object
    let result = domCompare.compare(expected, actual); 
    // get comparison result
    if (!result.getResult()) {
      // get all differences
      let diff = result.getDifferences(); // array of diff-objects
      console.log(diff)
      for (i = 0; i < diff.length; i++) {
        let parameters = stringMethod.getParameters(diff[i].message)
        console.log(parameters) 
        let newChange = {
          id: i+1,
          element: diff[i].node,
          tip: "promijenjen text",
          sadrzaj_prije: parameters['0'],
          sadrzaj_poslije: parameters['1'],
          datum: new Date()
        }
        array.push(newChange);
      }
    }
  }

  
  
  async function stopTracking () {
    clearInterval(interval);
  }

  

  module.exports.trackChanges = trackChanges;
  module.exports.stopTracking = stopTracking;