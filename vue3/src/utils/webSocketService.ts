import { interval, Subject, Subscription } from 'rxjs';
import { useUserStore } from '/@/store/modules/user';

const wsUrl = 'wss://api-test.deer.art/';
const store = useUserStore();

export class WebSocketService {
  messageSubject; // subject对象，用于发送事件
  private id; // 默认请求的用户id
  private webSocket!: WebSocket; // websocket对象
  connectSuccess = false; // websocket 连接成功
  period = 50 * 1000 * 1; // 1分钟检查一次
  serverTimeoutSubscription!: Subscription; // 定时检测连接对象
  reconnectFlag = false; // 重连
  reconnectPeriod = 5 * 1000; // 重连失败,则5秒钟重连一次
  reconnectSubscription!: Subscription; // 重连订阅对象

  constructor() {
    this.messageSubject = new Subject();
    // 进入程序就进行心跳检测,避免出现开始就连接中断,后续不重连
    this.heartCheckStart();
  }

  /**
   * 发送消息
   * @param message 发送消息
   */
  sendMessage(message) {
    return new Promise<string>((resolve) => {
      /**
       * 保持连接状态
       * @param readyState 0 连接尚未建立 1 连接已建立 2 连接正在关闭 3 连接已经关闭或不可用
       */
      if (this.webSocket !== null && this.webSocket.readyState === 1) {
        this.webSocket.send(message);
        resolve('SEND_SUCCESS');
      } else {
        resolve('SEND_FAILED');
      }
    });
  }

  /**
   * 创建新连接
   * @param id 用户id
   */
  connect(id) {
    if (id) {
      this.id = id;
      // 创建websocket对象
      this.createWebSocket();
    }
  }

  /**
   * 创建连接,开始 websocket连接
   */
  createWebSocket() {
    const token = store.getToken;
    const url = `${wsUrl}wss/send/${this.id}?Authorization=Bearer ${token}`;

    // 如果没有建立过连接，才建立连接并且添加时间监听
    this.webSocket = new WebSocket(url);
    // 建立连接成功
    this.webSocket.onopen = () => this.onOpen();
    // 接收到消息
    this.webSocket.onmessage = (e) => this.onMessage(e);
    // 连接关闭
    this.webSocket.onclose = () => this.onClose();
    // 异常
    this.webSocket.onerror = (e) => this.onError(e);
  }

  /**
   * 连接打开
   */
  private onOpen() {
    console.log('websocket 已连接');
    // 设置连接成功
    this.connectSuccess = true;
    // 如果是重连中
    if (this.reconnectFlag) {
      // 1.停止重连
      this.stopReconnect();
      // 2.重新开启心跳
      this.heartCheckStart();
    }
  }

  /**
   * 接受到消息
   * @param event 接受消息事件
   */
  onMessage(event) {
    console.log('接受消息', event);
    if (event.data && event.data === 'success') {
      console.log('连接成功', event.data);
    } else {
      // 将接受到的消息发布出去
      const message = JSON.parse(event.data);
      this.messageSubject.next(message);
    }
  }

  /**
   * 连接关闭
   */
  onClose() {
    console.log('连接关闭');
    this.connectSuccess = false;
    this.webSocket.close();
    this.heartCheckStop();
  }

  /**
   * 连接异常
   */
  private onError(e) {
    // 出现异常时一定会进onClose,所以只在onClose做一次重连动作
    console.log('连接异常', e);
    this.connectSuccess = false;
  }

  /**
   * 开始重新连接
   */
  private reconnect() {
    console.log(this.connectSuccess);
    // 如果已重连,则直接return,避免重复连接
    if (this.connectSuccess) {
      this.stopReconnect();
      console.log('已经连接成功,停止重连');
      return;
    }
    // 如果正在连接中,则直接return,避免产生多个轮训事件
    if (this.reconnectFlag) {
      console.log('正在重连,直接返回');
      return;
    }
    // 开始重连
    this.reconnectFlag = true;
    // 如果没能成功连接,则定时重连
    this.reconnectSubscription = interval(this.reconnectPeriod).subscribe(async (val) => {
      console.log(`重连:${val}次`);

      const user = store.getUserInfo;
      user && user.userId ? this.connect(user.userId) : this.stopReconnect();
      // 重新连接
      // this.connect(store.get('user').id);
    });
  }

  /**
   * 停止重连（登录失效，停止重连/已经连接成功，停止重连）
   */
  private stopReconnect() {
    // 连接标识置为false
    this.reconnectFlag = false;
    // 取消订阅
    this.reconnectSubscription && this.reconnectSubscription.unsubscribe();
  }

  /**
   * 开始心跳检测
   */
  private heartCheckStart() {
    console.log('开始心跳检测');
    this.serverTimeoutSubscription = interval(this.period).subscribe((val) => {
      /**
       * 保持连接状态,重置下
       * @param readyState 0 连接尚未建立 1 连接已建立 2 连接正在关闭 3 连接已经关闭或不可用
       */
      if (this.webSocket !== null && this.webSocket && this.webSocket.readyState === 1) {
        console.log(val, '连接状态，发送消息保持连接');
        // 60秒之前给后端发送一个心跳
        this.sendMessage('HeartBeat');
      } else {
        console.log('连接已断开,重新连接');
        // 停止心跳
        this.heartCheckStop();
        // 开始重连
        this.reconnect();
      }
    });
  }

  /**
   * 停止心跳检测
   */
  private heartCheckStop() {
    // 取消订阅停止心跳
    if (
      typeof this.serverTimeoutSubscription !== 'undefined' &&
      this.serverTimeoutSubscription != null
    ) {
      this.serverTimeoutSubscription && this.serverTimeoutSubscription.unsubscribe();
    }
  }
}
