let Robot = require("./lib/Robot.js");
let robot = new Robot();

app.launchApp('相册')
sleep(1000)

robot.close()

click(device.width >> 1, device.height >> 1)