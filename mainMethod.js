const {Builder, By, Key, until} = require('selenium-webdriver')
const domCompare = require ('dom-compare')
const xmldom = require('xmldom')
const domparser = new (xmldom.DOMParser)();
const fs = require('fs');
const moment = require('moment');


const extractChanges = require('./extractChanges.js');

let status = [ {id: 0, message: "Wait..."}, {id: 1, message: "Tracking has been started!"},{id: 2, message: "Time is up, you can download the change file!", fileName: ""}, {id: 3, message:"Could not open the page!"}, {id:4, message: "Can not get source code of page!"}, {id:5, message: "Tracking has been stopped, you can download the change file!", fileName:""}]

let currentTracking = {
  browser: null,
  url: null,
  width: 0,
  height: 0,
  trackingTime: 0,
  interval: null,
  currentStatus: status[0],
  startDateTime: null,
  endDateTime: null,
  array: [],
  driver: null,
  timeout: null
}


function returnBrowser (browser) {
  switch(browser) {
    case 'Chrome':
      return 'chrome';
    case 'Internet Explorer':
      return 'ie';
    case 'Microsoft Edge':
      return 'MicrosoftEdge';
    case 'Mozilla Firefox':
      return 'firefox';
  }
}

function clearCurrentTracking () {
  currentTracking.browser = null;
  currentTracking.url = null;
  currentTracking.width = 0,
  currentTracking.height = 0,
  currentTracking.trackingTime = 0,
  currentTracking.interval = null,
  currentTracking.currentStatus = status[0],
  currentTracking.startDateTime = null,
  currentTracking.endDateTime = null,
  currentTracking.array = [],
  currentTracking.driver = null,
  currentTracking.timeout = null
}

async function trackChanges (url, browser, end, width, height) {
  clearCurrentTracking();
  let expected = null
  let actual = null
  let period = 10000  //treba oko 10000 ms jer ne stigne zatvoriti prethodno otvorenu stranicu

  currentTracking.browser = browser;
  currentTracking.endDateTime = moment(end).format("DD.MM.YYYY HH:mm:ss")   

  currentTracking.width = parseInt(width)
  currentTracking.height = parseInt(height)
  let date = new Date();
  try {
    currentTracking.driver = new Builder().forBrowser(returnBrowser(currentTracking.browser)).build();
    await currentTracking.driver.manage().window().setRect({width:currentTracking.width, height:currentTracking.height});
    await currentTracking.driver.get(url);
    currentTracking.url = url;
    date = new Date();
    currentTracking.startDate = moment().format("DD.MM.YYYY HH:mm:ss")    
    currentTracking.trackingTime = new Date(end) - date
    currentTracking.currentStatus = status[1]    
  } catch (err) {
    currentTracking.currentStatus = status[3]
    await currentTracking.driver.quit()
    return;
   };

   currentTracking.timeout = setTimeout(async () => {
      clearInterval(currentTracking.interval);
      writeChangesInFile();
      currentTracking.currentStatus = status[2]
      await currentTracking.driver.quit();
      return;
    }, currentTracking.trackingTime);

    currentTracking.interval = setInterval(async function() {
      try {
        currentTracking.driver.getPageSource().then(function(source) {
          if (expected == null) 
            expected = domparser.parseFromString(source, "text/html");
          else {
            actual = domparser.parseFromString(source, "text/html");;
            let result = domCompare.compare(expected, actual);
            let diff = result.getDifferences()
            extractChanges.getChanges(diff, currentTracking.array, date)
            expected = actual;
          }
        });
      } catch (err) {
        currentTracking.currentStatus = status[4]
        await currentTracking.driver.quit()
        return;        
      }
    }, period);
  }
   
  
  async function stopTracking () {
    clearInterval(currentTracking.interval);
    clearTimeout(currentTracking.timeout);
    currentTracking.endDateTime = moment().format("DD.MM.YYYY HH:mm:ss")
    await currentTracking.driver.quit();
    currentTracking.currentStatus = status[5]
    writeChangesInFile();
    return JSON.stringify(currentTracking.currentStatus);
  }

  async function checkStatus () {                        
    return JSON.stringify(currentTracking.currentStatus);
  }

  function writeChangesInFile () {
    let dateAndTimeString = currentTracking.startDate.replace(/\./g, "")
    dateAndTimeString = dateAndTimeString.replace(/\:/g, "")
    dateAndTimeString = dateAndTimeString.replace(/ /g, "")
    let browser = currentTracking.browser.replace(/ /g, "")
    let fileName = browser + dateAndTimeString + ".txt"
    currentTracking.currentStatus.fileName = fileName;

    let data = {
      browser: currentTracking.browser,
      url: currentTracking.url,
      resolution: currentTracking.width+"x"+currentTracking.height,
      startDateTime: currentTracking.startDate,
      endDateTime: currentTracking.endDateTime
    }
    
    let dataToWrite = '{"data": ';
    dataToWrite = dataToWrite+JSON.stringify(data)
    dataToWrite = dataToWrite+',\n"changes":[\n'
    for (i = 0; i <currentTracking.array.length; i++) {
      dataToWrite=dataToWrite+JSON.stringify(currentTracking.array[i]);
      if (i!=currentTracking.array.length-1) {
        dataToWrite=dataToWrite+",\n";
      }
    }
    dataToWrite=dataToWrite+']}';
    fs.writeFile("./public/allFiles/"+fileName, dataToWrite, function (err) {
      if (err) console.log(err);
    });
  }

  

  module.exports.trackChanges = trackChanges;
  module.exports.stopTracking = stopTracking;
  module.exports.checkStatus = checkStatus;