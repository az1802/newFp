const baseURL = 'wss://shilai.zhiyi.cn'
import { sleep } from '@utils'

export default class QrcodeWebsocket {
  constructor(path) {
    this.path = path;
    this.socketTask = null;
    this.heartCheck = null;
    this.isConnect = false;
  }
  _startConnect = async () => {
    console.log("开始连接")
    if (!this.path) {
      return false;
    }
    let url = `${baseURL.websocket}${this.path}`;
    let _t = this;

    return new Promise((resolve, reject) => {
      let connectArgs = {
        url,
        header: {},
        success() {
          _t.isConnect = true;
          console.log("连接成功")
          resolve(true)
        },
        fail(err) {
          resolve(false)
        }
      }
      //#ifdef MP-WEIXIN
      this.socketTask = uni.connectSocket(connectArgs)
      //#endif
      //#ifdef MP-ALIPAY
      my.connectSocket(connectArgs)
      //#endif
    })
  }
  connect = async () => { //连接websocket 尝试三次
    let connectRes;
    for (let i = 0; i < 3; i++) {
      connectRes = await this._startConnect();
      if (connectRes) {
        this.heartCheck = this._createHeartCheck();
        break;
      } else {
        await sleep(1000)
      }
    }
    return connectRes;
  }
  reconnect = async () => {
    await this.close()
    this.connect()
  }
  _startClose = async () => {
    let _t = this;
    return new Promise((resolve, reject) => {
      let closeArgs = {
        success() {
          console.log('连接关闭成功')
          _t.isConnect = false;
          resolve(true)
        },
        fail(err) {
          console.log('连接关闭失败----', err)
          resolve(false)
        }
      }
      //#ifdef MP-WEIXIN
      this.socketTask && this.socketTask.close(closeArgs)
      //#endif
      //#ifdef MP-ALIPAY
      my.closeSocket(closeArgs)
      //#endif
    })
  }
  close = async () => {
    let closeRes = false;
    for (let i = 0; i < 3; i++) {
      closeRes = await this._startClose();
      if (closeRes) {
        break;
      } else {
        await sleep(1000)
      }
    }
    return closeRes;
  }
  _sendMsg = async (data) => {
    if (!this.isConnect) {
      return false;
    }
    return new Promise((resolve, reject) => {
      let sendArgs = {
        data,
        success() {
          // console.log("发送消息ping成功")
          resolve(true)
        },
        fail(err) {
          // console.log("消息发送失败",new Date().getTime(),err)
          resolve(false)
        }
      }
      //#ifdef MP-WEIXIN
      this.socketTask.send(sendArgs)
      //#endif

      //#ifdef MP-ALIPAY
      my.sendSocketMessage(sendArgs)
      //#endif

    })
  }
  sendMessage = async (data) => {
    let sendRes;
    for (let i = 0; i < 3; i++) {
      sendRes = await this._sendMsg(data);
      if (sendRes) {
        break
      } else {
        sleep(1000)
      }
    }
    return sendRes
  }
  onOpen = (cb) => { //绑定
    let openFn = () => {
      console.log("连接打开,开启心跳")
      this.heartCheck && this.heartCheck.reset().start()
      cb();
    }
    //#if MP-WEIXIN
    this.socketTask && this.socketTask.onOpen(openFn)
    //#endif
    //#ifdef MP-ALIPAY
    my.onSocketOpen(openFn)
    //#endif

  }
  onClose = (cb) => {

    let closeCb = (...args) => {
      this.isConnect = false;
      cb(...args)
    }
    //#ifdef MP-WEIXIN
    this.socketTask && this.socketTask.onClose(closeCb)
    //#endif
    //#ifdef MP-ALIPAY
    my.onSocketClose(closeCb)
    //#endif

  }
  onError = (cb) => {

    let errCb = (...args) => {
      this.isConnect = false;
      cb(...args)
    }
    //#ifdef MP-WEIXIN
    this.socketTask && this.socketTask.onError(errCb)
    //#endif
    //#ifdef MP-ALIPAY
    my.onSocketError(errCb)
    //#endif
  }
  onMessage = (cb) => {
    let handleMsg = (data) => {
      //加入心跳模式
      if (data.data == 'pong') {
        this.heartCheck && this.heartCheck.reset().start();
      } else {
        cb(data)
      }
    }
    //#ifdef MP-WEIXIN
    this.socketTask && this.socketTask.onMessage(handleMsg)
    //#endif
    //#ifdef MP-ALIPAY
    my.onSocketMessage(handleMsg)
    //#endif
  }
  _createHeartCheck() {
    let closeTime = 60000, msgTime = 3000, closeTimeout = null, msgTimeout = null, _t = this;

    return {
      reset() {
        clearTimeout(msgTimeout);
        clearTimeout(closeTimeout)
        return this;
      },
      start() {
        msgTimeout = setTimeout(async () => {
          let sendRes = await _t.sendMessage('ping');
          // console.log('%csendRes: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',sendRes);
          if (!sendRes) { //消息发送失败直接关闭
            // console.log("消息发送失败,关闭连接")
            _t.close();
          } else {
            closeTimeout = setTimeout(() => {
              _t.close();
            }, closeTime)
          }
        }, msgTime)
      }
    }
  }

}