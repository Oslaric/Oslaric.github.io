// boostrap 存放基本的脚本,便于开始完成初始化
window.feelwithme = {}
/*
    定义函数用的 
*/
window.waitForElm = function(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    });
}


// export {feelwithme}// 用于完成初始化的操作 , 在 bootstrap 之后

// --------------------------------------------------- fix layout --------------------------------------------------
// 必须添加这 viewport 这个 meta , 这是为了保持 js 的 尺寸计算单位 和 WKWebView 一致
// import { feelwithme } from "./boostrap";
waitForElm('head').then((elm) => {
    var meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1');
    meta.setAttribute('user-scalable', 'no');
    document.getElementsByTagName('head')[0].appendChild(meta);
});

// ------------------------------------------------------------------------------------------------------------------

/*
    用户 font-size 的定义
 */
feelwithme.fontSizes = ["textSize14", "textSize16", "textSize18", "textSize20", "textSize22", "textSize24", "textSize26", "textSize28", "textSize30", "textSize32", "textSize34", "textSize36", "textSize38", "textSize40"]
feelwithme.fontNames = ["open-sans"]

/*
    背景图片的定义
 */
feelwithme.backgroundImages = ["backgroundImageTheme-1", "backgroundImageTheme-2"]


feelwithme.init = {

}
/*
    保存配置信息 , 比如 fontName , fontSize
 */
feelwithme.config = {
    // fontName : "" ,
    // fontSize : 0
}

/*
    定义对外消息格式 ,统一为 {
        code : 0
        action : XXX
        message : XXX
        result : XXX
    }
 */

window.readerMessager = {
    sendAction: function (msg) {
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.action) {
            window.webkit.messageHandlers.action.postMessage(msg);
        }
    }
    , sendLog: function (msg) {
        // debug 的时候开启
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.logger) {
            window.webkit.messageHandlers.logger.postMessage(msg);
        }
    }


    // 定义扩展的 方法
    , sendSuccessMessage: function (action, result) {
        var res = {}
        res.code = 0
        res.msg = ""
        res.action = action
        res.result = result  // 0 || null 会返回 null , 当 result == 0 的时候 ,就会 返回 null ,这样是错误的 
        var msg = JSON.stringify(res)
        this.sendAction(msg)
    }
    , sendFailMessage(action, msg) {
        var res = {}
        res.code = -1
        res.msg = msg || "fail"
        res.action = action
        res.result = null
        var msg = JSON.stringify(res)
        this.sendAction(msg)
    }
}



/*
 * 系统功能实现
 */

window.logger = {
    trace: function (...args) {
        console.log(args)
        readerMessager.sendLog(args.join(" "))
    }
    ,
    debug: function (...args) {
        console.log(args)
        readerMessager.sendLog(args.join(" "))
    }
    , info: function (...args) {
        console.log(args)
        this.trace(args)
    }
    , error: function (...args) {
        console.error(args)
        readerMessager.sendLog(args.join(" "))
    }
}



window.readerInput = {
    delegateImpl: {},
}
readerInput.resetElementClass = function (elm, cls, toRemoves) {
    // toRemoves.forEach(function (clsName) {
    elm.classList.remove(...toRemoves)
    // });
    elm.classList.add(cls);
}

readerInput.setFontName = function (fontName) {
    var cls = fontName
    waitForElm('head').then((elm) => {
        this.resetElementClass(document.documentElement, cls, feelwithme.fontNames)
    })
}
readerInput.setFontSize = function (fontSize) {
    var cls = "textSize" + fontSize
    waitForElm('head').then((elm) => {
        this.resetElementClass(document.documentElement, cls, feelwithme.fontSizes)
    })
}
/*
    初始化需要的信息
 */
readerInput.setInitInfo = function (initInfo) {
    // logger.debug("set feelwithme.init : "  + initInfo)
    feelwithme.init = initInfo
}






// export { logger, readerMessager }