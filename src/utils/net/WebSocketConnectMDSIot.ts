/* eslint-disable @typescript-eslint/no-unused-vars */
// 连接状态的枚举
const readyStateMap = {
    0: '正在连接,连接尚未建立',
    1: '连接已建立，可以进行通信',
    2: '连接正在进行关闭',
    3: '连接已经关闭或者连接不能打开'
};
Object.freeze(readyStateMap);

class SocketClient {
    websock: WebSocket; // websock 本体
    rec; // 断线重连后，延迟5秒重新创建 WebSocket 连接  rec 用来存储延迟请求的代码
    isConnect = false; //连接标识 避免重复连接
    // const checkMsg = 'heartbeat'; //心跳发送/返回的信息 服务器和客户端收到的信息内容如果如下 就识别为心跳信息 不要做业务处理
    targetURL: string;

    constructor(url, cb) {
        this.createWebSocket(url, cb)
    }

    //设置关闭连接
    closeWebSocket() {
        console.log('closed', this);
        this.websock.close();
    }

    // 数据发送
    websocketsend(agentData) {
        console.log(JSON.stringify(agentData));
        this.websock.send(JSON.stringify(agentData));
    }

    // 关闭
    websocketclose(e) {
        console.log(e);
        this.isConnect = false; //断开后修改标识
        console.log('connection closed (' + e.code + ')');
    }

    // 创建 websocket 连接
    websocketOpen(e) {
        console.log('连接成功');
    }

    //定义重连函数
    reConnect(cb) {
        console.log('尝试重新连接');
        if (this.isConnect) return; //如果已经连上就不在重连了
        this.rec && clearTimeout(this.rec);
        this.rec = setTimeout(() => {
            // 延迟5秒重连  避免过多次过频繁请求重连
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            this.createWebSocket(this.targetURL, cb);
        }, 5000);
    }

    // 初始化websocket
    private initWebSocket(cb) {
        // ws地址 -->这里是你的请求路径
        // const uName = localStorage.getItem('uName');
        // const ws = 'ws://192.168.1.22:18308/chat?username=' + uName;

        if (typeof WebSocket === 'undefined') {
            alert('您的浏览器不支持 WebSocket');
            return false;
        }

        this.websock = new WebSocket(this.targetURL);
        this.websock.onmessage = cb;
        this.websock.onclose = this.websocketclose;
        this.websock.onopen = this.websocketOpen;

        // 连接发生错误的回调方法
        this.websock.onerror = () => {
            console.log('WebSocket连接发生错误');
            this.isConnect = false; //连接断开修改标识
            this.reConnect(cb); //连接错误 需要重连
        };
    }

    createWebSocket(url, cb) {
        try {
            // websock = new WebSocket(targetURL);
            this.targetURL = url; // websocket地址
            this.initWebSocket(cb); //初始化websocket连接
        } catch (e) {
            console.log('尝试创建连接失败');
            this.reConnect(cb); //如果无法连接上webSocket 那么重新连接！可能会因为服务器重新部署，或者短暂断网等导致无法创建连接
        }
    }
}


// 将方法暴露出去
// export { sendSocket, getSock, createWebSocket, closeWebSocket };
export default SocketClient
