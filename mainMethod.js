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
    let result = domCompare.compare(expected, actual); 
    let diff = result.getDifferences(); // array of diff-objects
    for (i = 0; i < diff.length; i++) {
      let parameters = stringMethod.getParameters(diff[i].message)
      let tip = "promijenjen sadržaj elementa"
      if (diff[i].message.includes('Extra element')) {
        tip = "dodan novi element " + parameters[0];
        parameters[0] = "/";
        parameters[1] = "/";
      }
      let newChange = {
        id: i+1,
        element: diff[i].node,
        tip: tip,
        sadrzaj_prije: parameters['0'],
        sadrzaj_poslije: parameters['1'],
        datum: new Date()
      }
      array.push(newChange);
    }
  }

  
  
  async function stopTracking () {
    clearInterval(interval);
  }

  

  module.exports.trackChanges = trackChanges;
  module.exports.stopTracking = stopTracking;