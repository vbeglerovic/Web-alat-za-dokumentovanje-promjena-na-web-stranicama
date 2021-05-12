const {Builder, By, Key, until} = require('selenium-webdriver')
const domCompare = require ('dom-compare')
const xmldom = require('xmldom')
const domparser = new (xmldom.DOMParser)();
const DOMParser = require('dom-parser')

let expected = null
let actual = null

setInterval( async function() {
    let driver = await new Builder().forBrowser('firefox').build();
    try {
        postoji = await driver.get('http://localhost:8000/index.html')
        driver.getPageSource().then(function(source) {
            //console.log(source);
            if (expected == null) 
                expected = domparser.parseFromString(source, "text/html");
            else {
              actual = domparser.parseFromString(source, "text/html");;
              compare(expected, actual);
            }
        });
        await driver.quit();
      } catch (err) {
        console.log("Could not open the page!");
        await driver.quit();
      }
  //treba oko 10000 ms jer ne stigne zatvoriti prethodno otvorenu stranicu
  }, 10000);


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