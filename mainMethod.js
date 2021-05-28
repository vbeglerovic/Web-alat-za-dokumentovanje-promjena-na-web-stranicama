const {Builder, By, Key, until} = require('selenium-webdriver')
const domCompare = require ('dom-compare')
const xmldom = require('xmldom')
const domparser = new (xmldom.DOMParser)();
const DOMParser = require('dom-parser')

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
  let trackingTime = new Date(end) - new Date(start);
  console.log(trackingTime)
  let period = 10000

  browser = returnBrowser (browser);
  
  setTimeout(()=> {
    clearInterval(interval);
  }, trackingTime);

  let interval = setInterval( async function() {
    let driver = new Builder().forBrowser(browser).build();
    try {
        postoji = await driver.get(url)
        driver.getPageSource().then(function(source) {
            console.log(source);
            if (expected == null) 
                expected = domparser.parseFromString(source, "text/html");
            else {
                actual = domparser.parseFromString(source, "text/html");
                compare(expected, actual);
                expected = actual;
            }
        });
        await driver.quit();
    } catch (err) {
        await driver.quit();
        console.log('Could not open the page!');
    }
  //treba oko 10000 ms jer ne stigne zatvoriti prethodno otvorenu stranicu
  }, period);
}


  
  function compare (expected, actual) {
      // compare to DOM trees, get a result object
      let result = domCompare.compare(expected, actual);
 
      // get comparison result
      console.log(result.getResult()); // false cause' trees are different
 
      // get all differences
      let diff = result.getDifferences(); // array of diff-objects
 
      // differences, grouped by node XPath
      let groupedDiff = domCompare.GroupingReporter.getDifferences(result); // object, key - node XPATH, value - array of differences (strings)
 
      // string representation
      console.log(domCompare.GroupingReporter.report(result));
  }

  

  module.exports.trackChanges = trackChanges;