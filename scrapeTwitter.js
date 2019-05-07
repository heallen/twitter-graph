const { Builder, By, Key } = require('selenium-webdriver');

const config = require('./config');

async function scrapeTwitter(people) {
  const driver = new Builder()
    .forBrowser('chrome')
    .build();
  await driver.get('https://twitter.com/login');

  // login to twitter
  let elem = await driver.findElement(By.css('.js-username-field'))
  await elem.sendKeys(config.username);
  elem = await driver.findElement(By.css('.js-password-field'))
  await elem.sendKeys(config.password);
  await elem.submit();

  // unusual activity
  try {
    elem = await driver.findElement(By.css('.js-username-field'))
    await elem.sendKeys(config.email);
    elem = await driver.findElement(By.css('.js-password-field'))
    await elem.sendKeys(config.password);
    await elem.submit();
  } catch(err) {}

  const graph = await induceSubgraph(driver, people);
  await driver.quit();
  return graph;
}

// Returns a list of users that username is following.
// username: the user
async function getFollowing(driver, username, maxFollowing = 2000) {
  const url = `https://twitter.com/${username}/following`;
  await driver.get(url);
  const body = await driver.findElement(By.css('body'));

  // don't bother with people that either follow too many people or are unimportant
  try {
    let numFollowing = await driver.findElement(By.css('.ProfileNav-item--following .ProfileNav-value')).getText();
    let numFollowers = await driver.findElement(By.css('.ProfileNav-item--followers .ProfileNav-value')).getText();
    if (numFollowing.indexOf('K') >= 0 || numFollowing.indexOf('M') >= 0) {
        return [];
      }
    numFollowers = parseInt(numFollowing.replace(/,/g, ''), 10);
    numFollowing = parseInt(numFollowing.replace(/,/g, ''), 10);
    if (numFollowing > maxFollowing || numFollowing > numFollowers) {
      return [];
    }
  } catch(err) {
    return [];
  }

  let prevYOffset = 0;
  await body.sendKeys(Key.END);
  let currYOffset = await driver.executeScript(
    'return window.pageYOffset;'
  );
  let convergedIterations = 0;
  while (convergedIterations < 4) {
    prevYOffset = currYOffset;
    await body.sendKeys(Key.END);
    await driver.sleep(250);
    currYOffset = await driver.executeScript(
      'return window.pageYOffset;'
    );
    if (prevYOffset === currYOffset) {
      convergedIterations++;
    } else {
      convergedIterations = 0;
    }
  }

  let followees = await driver.findElements(By.css('.ProfileCard .u-linkComplex-target'));
  followees = await Promise.all(followees.map(followee => followee.getText()));
  return followees;
}

async function induceSubgraph(driver, usernames) {
  usernames = usernames.map(user => user.toLowerCase());
  const adjList = {};
  for (const user of usernames) {
    adjList[user] = [];
  }
  for (const user of usernames) {
    let neighbors = await getFollowing(driver, user);
    neighbors = neighbors.map(neighbor => neighbor.toLowerCase());
    for (const neighbor of neighbors) {
      if (neighbor in adjList) {
        adjList[user].push(neighbor);
      }
    }
  }
  return adjList;
}

module.exports = {
  scrapeTwitter,
}