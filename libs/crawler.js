const pt = require('puppeteer')

module.exports = async (options) => {
  try {
    /* Turn off headless mode - sometimes it's useful to see what the browser is displaying. Instead of launching in headless mode, launch a full version of the browser using headless: false:
     */
    // const browser = await pt.launch({ headless: false })
    const browser = await pt.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      handleSIGINT: false
      // ignoreDefaultArgs: ['--disable-extensions'],
      // executablePath: '/root/.chromium-browser-snapshots/linux-722234/chrome-linux/chrome'
    })
    const url = options.url
    const pg = await browser.newPage()

    await pg.goto(url, {
      timeout: 0, //无穷大，时间过小会影响爬取，时间长如果报错，会由子进程抛出error
      waitUntil: 'networkidle2' // 500ms只能没有发起连接，表示完成
    })
    /** 前端路由多页面情况
     * await pg.waitForSelector('.check-btn');
     * await pg.click('.check-btn')
     * await pg.waitFor(2000);
     * const res = await pg.evaluate(options.callback)
     * await pg.waitFor(2000);
     * for(var i=0;i<res.length; i++){
     *    await result.push(res[i])
     * }
     */
    const result = await pg.evaluate(options.callback) //获取浏览器那边执行options.callback后的result

    await browser.close()

    process.send(result) //send mes to main process

    setTimeout(() => {
      process.exit(0)
    }, 1000)
  } catch (error) {
    console.log('crawler ->>error:', error)
  }
}
