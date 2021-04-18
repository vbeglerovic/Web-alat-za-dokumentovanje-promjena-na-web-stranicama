const {Builder, By, Key, until} = require('selenium-webdriver')

setInterval( async function() {
    let driver = await new Builder().forBrowser('firefox').build();
    try {
        postoji = await driver.get('http://localhost:8000/index.html')
        driver.getPageSource().then(function(source) {
            console.log(source);
          });
        await driver.quit();
      } catch (err) {
        console.log("Could not open the page!");
        await driver.quit();
      }
  }, 6000);