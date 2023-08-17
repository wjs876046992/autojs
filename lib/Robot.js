/**
 * 安卓5机器人
 */
function LollipopRobot(max_retry_times) {
    this.max_retry_times = max_retry_times || 10;

    this.click = function (x, y) {
        return (shell("input tap " + x + " " + y, true).code === 0);
    };

    this.swipe = function (x1, y1, x2, y2, duration) {
        duration = duration || 1000;
        return (shell("input swipe " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + duration, true).code === 0);
    };

    this.clickMultiMeantime = function (points) {};
}

Array.prototype.chunk = function (size) {
    let list = [];
    while (this.length > 0) {
        list.push(this.splice(0, size));
    }
    return list;
};

/**
 * 安卓7+机器人
 */
function GeneralRobot(max_retry_times) {
    this.max_retry_times = max_retry_times || 10;

    this.click = function (x, y) {
        return click(x, y);
    };

    this.swipe = function (x1, y1, x2, y2, duration) {
        duration = duration || 50;
        return swipe(x1, y1, x2, y2, duration);
    };

    this.clickMultiMeantime = function (points) {
        let list = [];
        let duration = 1;
        let max_point = 10; // 最多触摸点数
        points.forEach(function (point) {
            list.push([0, duration, point]);
        });

        // 同时点击多个点
        let chunks = list.chunk(max_point); // 太多点则分成多段
        chunks.forEach(function (chunk) {
            gestures.apply(null, chunk);
        });
    };
}

/**
 * 机器人工厂
 * @param {int} max_retry_times 最大尝试次数
 */
function Robot(max_retry_times) {
    this.robot = (device.sdkInt < 24) ? new LollipopRobot(max_retry_times) : new GeneralRobot(max_retry_times);

    this.click = function (x, y) {
        return this.robot.click(x, y);
    };

    this.clickCenter = function (b) {
        let rect = b.bounds();
        return this.robot.click(rect.centerX(), rect.centerY());
    };

    this.swipe = function (x1, y1, x2, y2, duration) {
        this.robot.swipe(x1, y1, x2, y2, duration);
    };

    this.back = function () {
        back();
    };

    this.kill = function (appName) {
        var name = getPackageName(appName);//通过app名称获取包名
        if (!name) {//如果无法获取到包名，判断是否填写的就是包名
            if (getAppName(appName)) {
                name = appName;//如果填写的就是包名，将包名赋值给变量
            } else {
                return false;
            }
        }
        console.log(name)
        shell("am force-stop " + name, true);
    };

    /**
     * 关闭当前app
     */
    this.close = function () {
        recents();
        sleep(1500);
        // 1、先将屏幕向左滑动半个屏幕[0.5w, 0.5h], [0w, 0.5h]
        let x1 = device.width >> 1;
        let y1 = device.height >> 1;
        gesture(300, [x1, y1], [0, y1]);
        sleep(200);

        // 2、将屏幕从下往上滑动[0.5w, 0.5h], [0.5w, 0h]
        gesture(300, [x1, y1], [x1, 0]);
        sleep(200);
    };
    this.killApp = function (appName) {
        var name = getPackageName(appName);//通过app名称获取包名
        if (!name) {//如果无法获取到包名，判断是否填写的就是包名
            if (getAppName(appName)) {
                name = appName;//如果填写的就是包名，将包名赋值给变量
            } else {
                return false;
            }
        }

        app.openAppSetting(name);//通过包名打开应用的详情页(设置页)
        text(app.getAppName(name)).waitFor();//通过包名获取已安装的应用名称，判断是否已经跳转至该app的应用设置界面
        sleep(500);//稍微休息一下，不然看不到运行过程，自己用时可以删除这行
        let is_sure = textMatches("结束运行").findOne();//在app的应用设置界面找寻包含“强”，“停”，“结”，“行”的控件
        //特别注意，应用设置界面可能存在并非关闭该app的控件，但是包含上述字样的控件，如果某个控件包含名称“行”字
        //textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/)改为textMatches(/(.*强.*|.*停.*|.*结.*)/)
        //或者结束应用的控件名为“结束运行”直接将textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/)改为text("结束运行")


        if (is_sure.enabled()) {//判断控件是否已启用（想要关闭的app是否运行）
            is_sure.parent().click();//结束应用的控件如果无法点击，需要在布局中找寻它的父控件，如果还无法点击，再上一级控件，本案例就是控件无法点击
            textMatches(/(.*确.*|.*定.*)/).findOne().click();//需找包含“确”，“定”的控件
            log(app.getAppName(name) + "应用已被关闭");
            sleep(1000);
            back();
        } else {
            log(app.getAppName(name) + "应用不能被正常关闭或不在后台运行");
            back();
        }
    }

    this.clickMulti = function (points) {
        points.forEach(function (point) {
            this.robot.click(point[0], point[1]);
        }.bind(this));
    };

    this.clickMultiCenter = function (collection) {
        let points = [];
        collection.forEach(function(o) {
            let rect = o.bounds();
            points.push([rect.centerX(), rect.centerY()]);
        });
        this.clickMulti(points);
    };
    
    this.clickMultiMeantime = function (points) {
        return this.robot.clickMultiMeantime(points);
    };
}

module.exports = Robot;