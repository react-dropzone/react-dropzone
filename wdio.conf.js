// https://webdriver.io/docs/cloudservices.html#with-travis-ci
const { TRAVIS_BUILD_NUMBER, TRAVIS_JOB_NUMBER, CI, DEBUG } = process.env
const sauceConnect = !TRAVIS_JOB_NUMBER
// https://wiki.saucelabs.com/display/DOCS/Test+Configuration+Options
const capabilities = require('./browsers').map(capabilities => ({
  ...capabilities,
  ...(sauceConnect ? {} : { 'tunnel-identifier': TRAVIS_JOB_NUMBER }),
  build: `Dropzone - ${TRAVIS_BUILD_NUMBER || 'Local'}`,
  // https://wiki.saucelabs.com/display/DOCS/Test+Configuration+Options#TestConfigurationOptions-Tagging
  tags: ['e2e', 'dropzone']
}))

const config = {
  runner: 'local',
  logLevel: DEBUG ? 'debug' : 'info',
  framework: 'jasmine',
  jasmineNodeOpts: {
    defaultTimeoutInterval: DEBUG ? 24 * 60 * 60 * 1000 : 10000
  },
  reporters: ['spec'],
  specs: ['./e2e/*.spec.js'],
  baseUrl: 'http://localhost:3000',
  services: CI ? ['sauce'] : ['selenium-standalone'],
  maxInstances: DEBUG ? 1 : 2,
  execArgv: DEBUG ? ['--inspect'] : [],
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3
}

if (CI) {
  module.exports.config = {
    ...config,
    capabilities,
    sauceConnect,
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    region: 'us'
  }
} else {
  module.exports.config = {
    ...config,
    capabilities: [
      {
        browserName: 'chrome'
      }
    ],
    seleniumArgs: {
      version: '3.9.1',
      drivers: {
        chrome: {
          version: '2.38',
          arch: process.arch
        }
      }
    }
    // seleniumInstallArgs: {
    //   version: '3.9.1',
    //   baseURL: 'https://selenium-release.storage.googleapis.com',
    //   drivers: {
    //     chrome: {
    //       version: '2.38',
    //       arch: process.arch,
    //       baseURL: 'https://chromedriver.storage.googleapis.com'
    //     }
    //   }
    // }
  }
}
