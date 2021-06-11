const {Builder, By, Key, until} = require('selenium-webdriver')
const domCompare = require ('dom-compare')
const xmldom = require('xmldom')
const domparser = new (xmldom.DOMParser)();
const fs = require('fs');

const stringMethod = require('./stringMethod.js');

let status = [ {id: 0, message: "Sačekajte!"}, {id: 1, message: "Praćenje je počelo!"},{id: 2, message: "Vrijeme je isteklo, možete preuzeti datoteku sa promjenama!", fileName: ""}, {id: 3, message:"Stranica se ne može otvoriti!"}, {id:4, message: "Ne može se dobiti izvorni kod stranice!"}, {id:5, message: "Praćenje je zaustavljeno, možete preuzeti datoteku sa promjenama!", fileName:""}]

let currentTracking = {
  browser: null,
  url: null,
  width: 0,
  heigth: 0,
  trackingTime: 0,
  interval: null,
  currentStatus: status[0],
  startDate: null,
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
      return 'edge';
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
  currentTracking.array = [],
  currentTracking.driver = null
}

function appendLeadingZeroes(n){
  if(n <= 9){
    return "0" + n;
  }
  return n
}

async function trackChanges (url, browser, end, width, heigth) {
  clearCurrentTracking();
  let expected = null
  let actual = null
  let period = 10000  //treba oko 10000 ms jer ne stigne zatvoriti prethodno otvorenu stranicu

  currentTracking.browser = returnBrowser(browser);

  currentTracking.width = parseInt(width);
  currentTracking.heigth = parseInt(heigth)

  try {
    currentTracking.driver = new Builder().forBrowser(currentTracking.browser).build();
    await currentTracking.driver.manage().window().setRect({width:currentTracking.width, height:currentTracking.heigth});
    await currentTracking.driver.get(url);
    currentTracking.url = url;
    currentTracking.startDate = new Date();
    currentTracking.trackingTime = new Date(end) - currentTracking.startDate
    currentTracking.currentStatus = status[1]
    
} catch (err) {
  currentTracking.currentStatus = status[3]
    await currentTracking.driver.quit();
    return;
   };

   currentTracking.timeout = setTimeout(async () => {
    clearInterval(currentTracking.interval);
    let datetime = new Date (currentTracking.startDate);
    let dateStringWithTime = appendLeadingZeroes(datetime.getDate()) + appendLeadingZeroes(datetime.getMonth() + 1) + datetime.getFullYear() + appendLeadingZeroes(datetime.getHours()) + appendLeadingZeroes(datetime.getMinutes()) + appendLeadingZeroes(datetime.getSeconds())
    let fileName = currentTracking.browser + dateStringWithTime
    writeChangesInFile(fileName,currentTracking.array);
    currentTracking.currentStatus = status[2]
    currentTracking.currentStatus.fileName = fileName + ".txt";
    await currentTracking.driver.quit();
    return;
  }, currentTracking.trackingTime);


  currentTracking.interval = setInterval(async function() {
    try {
      currentTracking.driver.getPageSource().then(function(source) {
            if (expected == null) 
                expected = domparser.parseFromString(source, "text/html");
            else {
                actual = domparser.parseFromString(source, "text/html");
                compare(currentTracking.array, expected, actual, currentTracking.startDate);
                expected = actual;
            }
        });
    } catch (err) {
      currentTracking.currentStatus = status[4]
        await currentTracking.driver.quit();
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
    clearInterval(currentTracking.interval);
    currentTracking.currentStatus = status[5]
    let datetime = new Date (currentTracking.startDate);
    let dateStringWithTime = appendLeadingZeroes(datetime.getDate()) + appendLeadingZeroes(datetime.getMonth() + 1) + datetime.getFullYear() + appendLeadingZeroes(datetime.getHours()) + appendLeadingZeroes(datetime.getMinutes()) + appendLeadingZeroes(datetime.getSeconds())
    let fileName = currentTracking.browser + dateStringWithTime
    writeChangesInFile(fileName, currentTracking.array);
    clearTimeout(currentTracking.timeout);
    currentTracking.currentStatus.fileName = fileName + ".txt";
    return JSON.stringify(currentTracking.currentStatus);

  }

  async function checkStatus () {                        
    return JSON.stringify(currentTracking.currentStatus);
  }

  function writeChangesInFile (name, array) {
    let data ="[";
    for (i = 0; i <array.length; i++) {
      data=data+JSON.stringify(array[i]);
      if (i!=array.length-1) {
        data=data+",\n";
      }
    }
    data=data+"]";
    fs.writeFile("./public/allFiles/"+name+".txt", data, function (err) {
      if (err) console.log(err);
    });
  }

  

  module.exports.trackChanges = trackChanges;
  module.exports.stopTracking = stopTracking;
  module.exports.checkStatus = checkStatus;