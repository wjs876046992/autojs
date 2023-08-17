let Robot = require("./lib/Robot.js");
let robot = new Robot();

auto.waitFor();
console.show();
console.clear();

app.launchApp('i茅台');
text("首页").waitFor();
console.log('首页已打开');

id("vp_main").findOne().children().forEach(child => {
    var target = child.findOne(id("ivLeft"));
    target.click();
});

id('home_title').waitFor();

const btnText = id('bt_goods').findOne().content();
if (btnText == "预约申购") {
    console.log('准备申购')
    id('bt_goods').findOne().click();

    text('选择门店').waitFor();
    id('btReserve').findOne().click();

    text('确定申购').waitFor();
    id("reserve").findOne().click();
} else {
    toastLog(btnText);
}
sleep(2000);
robot.close()
console.hide();