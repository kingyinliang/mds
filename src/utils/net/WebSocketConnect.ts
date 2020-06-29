/* eslint-disable @typescript-eslint/no-unused-vars */
// 连接状态的枚举
const readyStateMap = {
    0: '正在连接,连接尚未建立',
    1: '连接已建立，可以进行通信',
    2: '连接正在进行关闭',
    3: '连接已经关闭或者连接不能打开'
};
Object.freeze(readyStateMap);

let websock: WebSocket; // websock 本体
let rec; // 断线重连后，延迟5秒重新创建 WebSocket 连接  rec 用来存储延迟请求的代码
let isConnect = false; //连接标识 避免重复连接
// const checkMsg = 'heartbeat'; //心跳发送/返回的信息 服务器和客户端收到的信息内容如果如下 就识别为心跳信息 不要做业务处理
let targetURL: string;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line no-unused-vars
let globalCallback;

//设置关闭连接
const closeWebSocket = () => {
    websock.close();
};
//心跳设置
// const heartCheck = {
//     timeout: 20000, //每段时间发送一次心跳包 这里设置为20s
//     timeoutObj: 0, //延时发送消息对象（启动心跳新建这个对象，收到消息后重置对象）

//     start: function() {
//         this.timeoutObj = setTimeout(function() {
//             if (isConnect) websock.send(checkMsg);
//         }, this.timeout);
//     },

//     reset: function() {
//         clearTimeout(this.timeoutObj);
//         this.start();
//     }
// };

// 数据发送
function websocketsend(agentData) {
    console.log(JSON.stringify(agentData));
    websock.send(JSON.stringify(agentData));
}

// 实际调用的方法
function sendSocket(agentData, callback) {
    globalCallback = callback;
    // console.log(globalCallback)
    if (websock.readyState === websock.OPEN) {
        // 若是 ws 开启状态
        websocketsend(agentData);
    } else if (websock.readyState === websock.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(function() {
            sendSocket(agentData, callback);
        }, 1000);
    } else {
        // 若未开启 ，则等待1s后重新调用
        setTimeout(function() {
            sendSocket(agentData, callback);
        }, 1000);
    }
}

function getSock(callback) {
    globalCallback = callback;
}
// 数据接收
function websocketonmessage(e) {
    globalCallback(JSON.parse(e.data));
    // 测心跳
    // if (!result) {
    //     heartCheck.reset();
    // } else if (result.msg === 'open success') {
    //     sessionStorage.setItem('wid', result.wid);
    // } else {
    //     console.log(result);
    //     // globalCallback(result);
    // }
}

// 关闭
function websocketclose(e) {
    console.log(e);
    isConnect = false; //断开后修改标识
    console.log('connection closed (' + e.code + ')');
}

// 创建 websocket 连接
function websocketOpen(e) {
    console.log('连接成功');
}

//定义重连函数
const reConnect = () => {
    console.log('尝试重新连接');
    if (isConnect) return; //如果已经连上就不在重连了
    rec && clearTimeout(rec);
    rec = setTimeout(function() {
        // 延迟5秒重连  避免过多次过频繁请求重连
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        createWebSocket(targetURL);
    }, 5000);
};

// 初始化websocket
function initWebSocket() {
    // ws地址 -->这里是你的请求路径
    // const uName = localStorage.getItem('uName');
    // const ws = 'ws://192.168.1.22:18308/chat?username=' + uName;

    if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持 WebSocket');
        return false;
    }

    websock = new WebSocket(targetURL);
    websock.onmessage = websocketonmessage;
    websock.onclose = websocketclose;
    websock.onopen = websocketOpen;

    // 连接发生错误的回调方法
    websock.onerror = function() {
        console.log('WebSocket连接发生错误');
        isConnect = false; //连接断开修改标识
        reConnect(); //连接错误 需要重连
    };
}

const createWebSocket = url => {
    try {
        // websock = new WebSocket(targetURL);
        targetURL = url; // websocket地址
        initWebSocket(); //初始化websocket连接
    } catch (e) {
        console.log('尝试创建连接失败');
        reConnect(); //如果无法连接上webSocket 那么重新连接！可能会因为服务器重新部署，或者短暂断网等导致无法创建连接
    }
};

// 将方法暴露出去
export { sendSocket, getSock, createWebSocket, closeWebSocket };
