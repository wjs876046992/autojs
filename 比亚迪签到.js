let Robot = require("./lib/Robot.js")
let robot = new Robot()

console.show()
console.clear()

// 等待无障碍
auto.waitFor()

// 打开app
app.launchApp('比亚迪汽车')

// 等待“我的”展示
id("btn_my").waitFor()

// 点击“我的”
id("btn_my").findOne().click()

// 等待“每日签到”展示
text("每日签到").waitFor()

// 点击“每日签到”
text("每日签到").findOne().click()
sleep(2000)

robot.kill('比亚迪汽车')
console.hide()