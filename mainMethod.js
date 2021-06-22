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
  startDate: null,
  endDate: null,
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
  currentTracking.startDate = null,
  currentTracking.endDate = null,
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
  currentTracking.endDate = moment(end).format("DD.MM.YYYY HH:mm:ss")   

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
            console.log(diff)
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
    await currentTracking.driver.quit();
    currentTracking.currentStatus = status[5]
    writeChangesInFile();
    return JSON.stringify(currentTracking.currentStatus);

  }

  async function checkStatus () {                        
    return JSON.stringify(currentTracking.currentStatus);
  }

  function writeChangesInFile () {
    let dateStringWithTime = currentTracking.startDate.replace(/\./g, "")
    dateStringWithTime = dateStringWithTime.replace(/\:/g, "")
    dateStringWithTime = dateStringWithTime.replace(/ /g, "")
    let browser = currentTracking.browser.replace(/ /g, "")
    let fileName = browser + dateStringWithTime
    currentTracking.currentStatus.fileName = fileName + ".txt";
    let settings = {
      browser: currentTracking.browser,
      url: currentTracking.url,
      resolution: currentTracking.width+"x"+currentTracking.height,
      startDateTime: currentTracking.startDate,
      endDateTime: currentTracking.endDate
    }
    
    let data = '{\n"podesavanja": ';
    data = data+JSON.stringify(settings)
    data = data+',\n"promjene": ['
    for (i = 0; i <currentTracking.array.length; i++) {
      data=data+JSON.stringify(currentTracking.array[i]);
      if (i!=currentTracking.array.length-1) {
        data=data+",\n";
      }
    }
    data=data+']}';
    fs.writeFile("./public/allFiles/"+fileName+".txt", data, function (err) {
      if (err) console.log(err);
    });
  }

  

  module.exports.trackChanges = trackChanges;
  module.exports.stopTracking = stopTracking;
  module.exports.checkStatus = checkStatus;