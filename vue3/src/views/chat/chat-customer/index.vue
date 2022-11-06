<template>
  <div class="page-container">
    <a-spin size="large" delay="500" tip="loading..." :spinning="false">
      <div class="flex_between-top chat-container">
        <!-- 左边 - 列表-->
        <div class="flex_start_top chat-relationship-container" style="flex: 1.2">
          <div style="width: 100%; height: 100%">
            <!-- tab -->
            <div class="tab-container">
              <div class="tab-content-container">
                <div
                  v-for="item in tabList"
                  :key="item.code"
                  class="tab-item"
                  :class="{ _active: selectedTabCode === item.code }"
                  @click="switchTab(item.code)"
                >
                  <span>{{ item.name }}</span>
                  <!-- 显示红点 -->
                  <span
                    class="circle-red"
                    v-if="item.notReadTotalCount && item.notReadTotalCount !== '0'"
                  ></span>
                </div>
              </div>
            </div>
            <div class="tab-bottom flex_between">
              <span>仅查自己</span>
              <a-checkbox v-model:checked="justCheckMe" @change="changeCheckBox" />
            </div>
            <div class="chat-list-content scrollbar-item-y">
              <div
                style="color: #b8b8b8; text-align: center; line-height: 56px"
                v-if="chatList && chatList.length === 0"
              >
                暂无相关内容
              </div>

              <div
                v-for="(listItem, chatTypeIndex) in chatList"
                :key="chatTypeIndex"
                class="list-item-container flex_start"
                :class="{
                  _selected:
                    selectedUserId === listItem.userId + listItem.mamaId ||
                    selectedUserId === listItem.userId + listItem.mamaId + listItem.shopId,
                }"
                @click="selectChatType(listItem)"
              >
                <div class="avatar-content">
                  <img
                    :src="
                      listItem?.shopLogoUrl
                        ? listItem?.shopLogoUrl
                        : listItem?.userAvatarUrl
                        ? listItem?.userAvatarUrl
                        : ''
                    "
                    alt=""
                  />
                </div>
                <div style="width: 100%">
                  <div class="flex_between" style="width: 100%">
                    <div class="_value" style="flex: 2">
                      {{ listItem.shopName ? listItem.shopName : listItem.userNickName }}
                    </div>
                    <div class="_date flex_end">{{ listItem.messageDate }}</div>
                  </div>
                  <div class="flex_between" style="width: 100%">
                    <div
                      style="flex: 2"
                      class="_value _msg-value"
                      :class="{ _red: listItem.messageTypeCode === 'PULL_OUT' }"
                    >
                      <span v-if="listItem.messageTypeCode === 'QUOTE'">回复</span>
                      <template v-if="listItem.showType === 'array' && listItem?.message?.join">
                        {{ listItem.message.join() }}
                      </template>
                      <temlplate v-else>
                        {{ listItem.message }}
                      </temlplate>
                    </div>
                    <!-- 显示红点 -->
                    <div class="flex_end" v-if="listItem.notReadTotalCount !== '0'">
                      <div class="circle-red"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 中间 - 聊天窗口-->
        <div class="chat-detail-container" style="flex: 4">
          <!-- 标题 -->
          <div class="chat-detail-title flex_between" style="cursor: pointer">
            <div @click="goDetail()">{{ titleName }}</div>
            <div
              style="color: rgba(0, 0, 0, 0.65)"
              v-if="chatDetailData && chatDetailData.length !== 0"
            >
              现在接待客服：{{ selectedChatListData?.mamaNickName || '-' }}
            </div>
          </div>

          <!-- 聊天记录 -->
          <div
            class="chat-detail-content scrollbar-item-y"
            :class="{ 'show-height': !isReception }"
            @scroll="loadNextPageData()"
            ref="chatItemContainerElement"
          >
            <template v-for="chatItem in chatDetailData" :key="chatItem.sendDate">
              <div class="chat-item-date" v-if="chatItem.isShowTime">{{ chatItem?.sendDate }}</div>
              <!-- 对方撤回一条消息 -->
              <div
                class="_pullout-msg"
                v-if="
                  chatItem.messageTypeCode === 'PULL_OUT' ||
                  chatItem.messageTypeCode === 'QUOTE_PULL_OUT'
                "
              >
                对方撤回一条消息
              </div>
              <!-- 【非】对方撤回一条消息 -->
              <!-- list -->
              <div
                class="chat-item-container"
                :class="{
                  flex_start_top: chatItem.mode == 'start',
                  flex_center_top: chatItem.mode == 'center',
                  flex_end_top: chatItem.mode == 'end',
                }"
                v-else
              >
                <!-- 对方的头像 -->
                <div class="avatar-content" v-if="chatItem.mode === 'start'">
                  <img :src="titleLogoUrl" alt="" />
                </div>

                <!-- 系统消息 -->
                <div
                  class="flex_center"
                  v-if="
                    chatItem.messageTypeCode === 'CHANGE_MAMA' ||
                    chatItem.messageTypeCode === 'CLOSE_SESSION'
                  "
                >
                  <div class="center-box">
                    <template v-if="chatItem.messageTypeCode === 'CHANGE_MAMA'">
                      <template v-if="chatItem?.oldMamaData && chatItem?.newMamaData">
                        <span>由 </span>
                        <span class="font-color-C02235">{{ chatItem.oldMamaData.nickName }}</span>
                        <span> 转接给 </span>
                        <span class="font-color-C02235">
                          {{
                            chatItem.newMamaData.nickName
                              ? chatItem.newMamaData.nickName
                              : chatItem.newMamaData.name
                          }}
                        </span>
                      </template>
                      <template v-else>
                        <template v-if="chatItem.newMamaData">
                          <span>现在接待客服：</span>
                          <span class="font-color-C02235">
                            {{
                              chatItem.newMamaData.nickName
                                ? chatItem.newMamaData.nickName
                                : chatItem.newMamaData.name
                            }}
                          </span>
                        </template>
                      </template>
                    </template>
                    <template v-if="chatItem.messageTypeCode === 'CLOSE_SESSION'">
                      <span>{{ chatItem.message }}</span>
                    </template>
                  </div>
                </div>

                <!-- 【非】系统消息 -->
                <div class="chat-item" v-else>
                  <!-- 名字（暂时不需要显示） -->
                  <div class="chat-item-name _end">
                    <div v-if="chatItem.mode === 'end'">
                      平台客服：{{ chatItem.mamaNickName }}
                    </div>
                  </div>

                  <!-- 文本 -->
                  <template v-if="chatItem.messageTypeCode === 'TXT'">
                    <div
                      class="chat-item-message"
                      :class="{
                        _start: chatItem.mode == 'start',
                        _end: chatItem.mode == 'end',
                      }"
                    >
                      <template v-if="chatItem.showType && chatItem.showType === 'array'">
                        <div class="_text" v-for="(msgItem, idx) in chatItem.message" :key="idx">
                          {{ msgItem }}
                        </div>
                      </template>
                      <template v-else>
                        <div class="_text">{{ chatItem.message }}</div>
                      </template>
                    </div>
                  </template>

                  <!-- 表情符 -->
                  <template v-if="chatItem.messageTypeCode === 'EMOJI_MAMA'">
                    <i
                      class="oma oma-6x"
                      style="margin-top: 26px"
                      :style="{ 'background-image': 'url(' + chatItem.message?.hexcodeUrl + ')' }"
                      :title="chatItem.message?.annotation"
                    ></i>
                  </template>

                  <!-- 图片 -->
                  <template v-if="chatItem.messageTypeCode === 'IMAGE'">
                    <div
                      class="chat-item-message file_image"
                      :class="{
                        _start: chatItem.mode == 'start',
                        _end: chatItem.mode == 'end',
                      }"
                    >
                      <!-- <a-image :src="chatItem.message" /> -->
                      <image-container :image-src="chatItem.message" />
                    </div>
                  </template>

                  <!-- 回复 -->
                  <template v-if="chatItem.messageTypeCode === 'QUOTE'">
                    <div
                      class="chat-item-message"
                      :class="{
                        _start: chatItem.mode == 'start',
                        _end: chatItem.mode == 'end',
                      }"
                    >
                      <div class="chat-item-quote">
                        <div class="_nick_name">{{ chatItem?.message?.quote?.nickName }} </div>
                        <div> {{ chatItem?.message?.quote?.message[0]?.content }}</div>
                      </div>
                      <div>{{ chatItem?.message?.reply }}</div>
                    </div>
                  </template>
                </div>

                <!-- 我的头像 -->
                <div class="avatar-content" v-if="chatItem.mode === 'end'">
                  <img src="../../../assets/images/head_service.jpg" alt="" />
                </div>
              </div>
            </template>
            <!-- <div class="chat-item-top">上次聊到这里</div> -->
          </div>

          <!-- 输入框(发送) -->
          <div class="chat-detail-footer" v-if="isReception">
            <div class="footer-content flex_start">
              <!-- 表情包 -->
              <div class="footer-item flex_center">
                <emoji-container
                  v-if="emojiModule"
                  :showEmojiList="emojiDataList"
                  @menu-event="emojiAciton"
                />
                <i title="表情包" @click="iconEvent('smile')" class="icon-color">
                  <SmileOutlined style="font-size: 18px; color: #666" />
                </i>
              </div>

              <!-- 图片 -->
              <div class="footer-item flex_center _file">
                <input
                  ref="backFileElement"
                  class="file-input"
                  type="file"
                  @change="fileChangeEvent($event)"
                  accept="image/*"
                />
                <i title="图片">
                  <PictureOutlined class="icon-color" />
                </i>
              </div>

              <!-- 转接 -->
              <div class="footer-item flex_center">
                <i title="转接" @click="iconEvent('team')">
                  <TeamOutlined class="icon-color" />
                </i>
              </div>

              <!-- 关闭会话 -->
              <div class="footer-item flex_center close-icon">
                <i title="关闭会话" @click="iconEvent('close')">
                  <PoweroffOutlined class="icon-color" />
                </i>
              </div>
            </div>
            <div>
              <textarea
                placeholder="这里输入文字"
                maxlength="600"
                rows="4"
                v-model="sendMessage"
                :disabled="disabledTXT"
                @keyup="keyUpByEnter($event)"
              ></textarea>
            </div>
            <button
              class="action-btn"
              :class="{ _active: sendMessage }"
              @click="send"
              :disabled="!sendMessage || checkValueOfEmpty(sendSocketMsg.receiverUserId)"
            >
              发送
            </button>
          </div>
        </div>

        <!-- 右边 - 客服列表 -->
        <div class="chat-customership-container" style="flex: 1.2">
          <template v-if="transferList && transferList.length !== 0">
            <div class="chat-content-title">可转接客服列表</div>
            <div
              class="chat-list-content scrollbar-item-y"
              style="height: calc(100vh - 190px + 52px)"
            >
              <template v-for="(transferItem, transferIndex) in transferList" :key="transferIndex">
                <div class="customer-item flex_start" @click="selectTransfer(transferIndex)">
                  <div
                    style="width: 28px; height: 28px"
                    class="avatar-content"
                    :class="{ _green: transferItem?.statusCode === 'ONLINE' }"
                  >
                    <i title="">
                      <UserOutlined class="icon-color" />
                    </i>
                  </div>
                  <div class="_value">{{ transferItem?.mamaNickName }}</div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </a-spin>
  </div>

  <!-- 客服转接 -->
  <a-modal
    v-if="isShowTransferModule || isCloseSession"
    :visible="isShowTransferModule || isCloseSession"
    :title="isShowTransferModule ? '客服转接' : isCloseSession ? '关闭会话' : ''"
    :footer="null"
    :maskClosable="false"
    :destroyOnClose="true"
    :keyboard="false"
    @cancel="hideTransferModuleModal"
  >
    <div class="model-body">
      <div style="padding: 6px 28px 30px">
        <template v-if="isShowTransferModule">
          <div>是否转接给选中账号？</div>
          <div>
            账号：<span class="font-color-FF5050">{{ transferData.mamaNickName }}</span>
          </div>
        </template>
        <template v-else-if="isCloseSession">
          <div>客户问题已解决，是否确定关闭会话？</div>
        </template>
      </div>
    </div>
    <div class="model-footer flex_end" style="padding: 0 12px 12px">
      <div class="btn-item default-btn" @click="hideTransferModuleModal()">取消</div>
      <div class="btn-item ok-btn" @click="confirmTransferModuleModal()">确定</div>
    </div>
  </a-modal>

  <!-- 图片裁剪/图片预览 -->
  <a-modal
    v-model:visible="isSHowCropped"
    title="图片预览"
    :footer="null"
    :maskClosable="false"
    :destroyOnClose="true"
    :keyboard="false"
  >
    <div class="model-image">
      <image-container :image-src="imageChangedEvent.name" />
    </div>
    <div
      class="model-footer flex_end"
      style="padding: 10px 16px; border-top: 1px solid rgba(0, 0, 0, 0.06)"
    >
      <div class="btn-item ok-btn" @click="confirmCropped()">发送</div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  // import { onMounted, onUnmounted, reactive, ref, toRaw, unref } from 'vue';
  import { onMounted, onUnmounted, reactive, ref, toRaw, watch } from 'vue';
  import * as customerService from './chatCustomer.api';
  import { useUserStore } from '/@/store/modules/user';
  import {
    formattingDateByCurrent,
    matchPermissionsCode,
    copyToReactiveObj,
    checkValueOfEmpty,
  } from '/@/utils/table';
  import { OssUtils } from '/@/utils/ossUtils';
  import { message } from 'ant-design-vue';
  import { emojiData } from '/@/assets/emoji/emoji.data.json';
  import { WebSocketService } from '/@/utils/webSocketService';
  // import { useGo } from '/@/hooks/web/usePage';
  import * as _ from 'lodash';
  // import Icon from '/@/components/Icon';
  import EmojiContainer from './components/EmojiContainer.vue';
  import { useRoute } from 'vue-router';
  import ImageContainer from '../components/ImageContainer.vue';
  import {
    SmileOutlined,
    TeamOutlined,
    PoweroffOutlined,
    UserOutlined,
    PictureOutlined,
  } from '@ant-design/icons-vue';

  // const go = useGo();
  const store = useUserStore();
  const ossUtils = new OssUtils();
  const webSocketService = new WebSocketService();
  const route = useRoute()
  
  /************************变量定义************************** */

  // Html DOM 元素 引用
  const chatItemContainerElement = ref<HTMLDivElement | null>(null);
  const backFileElement = ref<HTMLInputElement | null>(null);

  const MESSAGE_TYPE_CODE = {
    TXT: 'TXT',
    EMOJI_MAMA: 'EMOJI_MAMA',
    IMAGE: 'IMAGE',
    CHANGE_MAMA: 'CHANGE_MAMA',
    CLOSE_SESSION: 'CLOSE_SESSION',
  };

  // const { currentRoute } = useRouter();
  // const { query } = unref(currentRoute);
  // console.log(query.type);

  // 加载状态
  const loading = ref(true);
  const user = reactive({
    id: '',
    nickName: '',
    permissions: [] as string[],
  });
  let timer; // 定时器
  // 分栏列表
  const tabList = ref([
    { name: '消费者', code: 'buyer', notReadTotalCount: '0' },
    { name: '商家', code: 'vendor', notReadTotalCount: '0' },
  ]);
  // const selectedTabCode = ref<string>(query.type as string); // 默认
  const selectedTabCode = ref<string>('buyer'); // 默认
  
  onMounted(() =>{
    if(route.query.type){
      switchTab(route.query.type)
    }
    if(route.query.data){
      selectChatType(JSON.parse(route.query.data as ''))
    }
  })

  // 仅查自己
  const justCheckMe = ref(false);
  // 非该客服接待的客户，输入框需禁用
  const isReception = ref(false);

  // 聊天列表
  const searchChatList = reactive({
    userTypeCode: 'buyer', // 用户类型
    name: '', // 客户名称
    mamaId: '', // mamaId,可不传
    startDate: undefined,
    endDate: undefined,
  });
  const chatList = ref([] as any[]);
  const selectedUserId = ref('');
  const selectedChatListData = ref({
    id: '',
    mamaId: '',
    shopId: '',
    userId: '',
    userTypeCode: '',
    notReadTotalCount: '',
    mamaNickName: '',
  });

  // 聊天记录
  const searchChatDetail = reactive({
    limit: 20,
    shopId: '',
    vendorId: '',
    buyerId: '',
    startDate: '',
    endDate: '',
    sendDate: '',
  });

  const chatDetailData = ref([] as any[]);
  const titleLogoUrl = ref('');
  const titleName = ref('');
  // 滚动的高度
  const scrollHeight = ref(0);

  // 发送消息
  const sendMessage = ref(''); // 发送的消息内容
  // 需要发送消息给后端的数据
  const sendSocketMsg = reactive({
    // 店铺Id
    shopId: '',
    // 发送用户类型
    senderUserTypeCode: 'mama',
    // 发送用户Id
    senderUserId: '',
    // 接收用户类型
    receiverUserTypeCode: '',
    // 接收用户Id
    receiverUserId: '',
    // 消息内容
    message: '',
    // 消息类型 (默认为文本处理模式)
    messageTypeCode: MESSAGE_TYPE_CODE.TXT,
    sendDate: '',
  });

  // const receiverReadIds = ref([] as any[]);
  // let receiverReadTimes; // 定时器

  // 转接客服列表
  const transferList = ref([] as any[]);
  const transferData = ref({} as any);
  const isShowTransferModule = ref(false);

  // 关闭会话
  const isCloseSession = ref(false);

  // 转接消息
  const changeMamaMessage = reactive({
    newMamaId: '',
    oldMamaId: '',
    shopId: '',
  });
  // textarea
  const disabledTXT = ref(true);
  // 图片裁剪
  const imageChangedEvent = reactive({
    name: '',
    url: '',
  }); // 当前文件
  // croppedImage = ''; // 剪切输出
  const isSHowCropped = ref(false);

  const emojiModule = ref(false);
  const emojiDataList = ref([] as any[]); // 表情包数据

  const searchMode = ref(false);
  let searchMamaChatCustomerData = {} as any;

  const permissionCodeList = reactive({
    BUYER_DETAIL_GET: false,
    SHOP_DETAIL_GET: false,
  });

  /************************方法定义************************** */

  // 隐藏弹窗
  function hideTransferModuleModal() {
    isShowTransferModule.value = false;
    isCloseSession.value = false;

    console.log('isShowTransferModule => ', isShowTransferModule.value);
    console.log('isCloseSession => ', isCloseSession.value);
  }

  // 转接客服 API
  function updateTransferById() {
    let params = {
      shopId: selectedChatListData.value.shopId,
      userId: selectedChatListData.value.userId,
      mamaId: transferData.value.mamaId,
      userTypeCode: selectedChatListData.value.userTypeCode,
    };
    customerService
      .updateTransferById(params)
      .then(async () => {
        message.success('转接成功');
        loading.value = false;
        isShowTransferModule.value = false;
        searchChatList.userTypeCode = selectedTabCode.value;
        reset();
      })
      .catch((err) => {
        loading.value = false;
        isShowTransferModule.value = false;
        message.error('转接失败，请重试');
        console.log(err);
      });
  }

  // 确认
  function confirmTransferModuleModal() {
    if (loading.value) {
      return;
    }
    loading.value = true;
    // 转接客服
    if (isShowTransferModule.value) {
      updateTransferById();
    }
    // 关闭会话
    else if (isCloseSession.value) {
      // 转接的操作人Id
      sendSocketMsg.message = JSON.stringify({ operatorId: user.id });
      sendSocketMsg.messageTypeCode = MESSAGE_TYPE_CODE.CLOSE_SESSION;
      sendSocketMsg.sendDate = String(new Date().getTime());
      console.log(toRaw(sendSocketMsg));

      // webSocket发送消息给后端
      webSocketService.sendMessage(JSON.stringify(toRaw(sendSocketMsg))).then(() => {
        customerService
          .updateSessionStatus(selectedChatListData.value.id)
          .then(() => {
            message.success('会话已关闭');
            loading.value = false;
            isCloseSession.value = false;
            reset();
          })
          .catch((err) => {
            loading.value = false;
            isCloseSession.value = false;
            message.error('会话关闭失败，请重试');
            console.log(err);
          });
      });
    }
  }

  // 切换Tab
  const switchTab = (code) => {
    selectedTabCode.value = code;
    searchChatList.userTypeCode = selectedTabCode.value;
    reset();
  };

  // 重置
  const reset = () => {
    justCheckMe.value = false;
    isReception.value = false;

    // sendSocketMsg
    sendSocketMsg.shopId = '';
    sendSocketMsg.senderUserTypeCode = 'mama';
    sendSocketMsg.senderUserId = user?.id;
    sendSocketMsg.receiverUserTypeCode = '';
    sendSocketMsg.receiverUserId = '';
    sendSocketMsg.message = '';
    sendSocketMsg.messageTypeCode = MESSAGE_TYPE_CODE.TXT;
    sendSocketMsg.sendDate = '';

    chatList.value = [];
    // // searchChatDetail
    // searchChatDetail.limit = 20;
    // searchChatDetail.shopId = '';
    // searchChatDetail.vendorId = '';
    // searchChatDetail.buyerId = '';
    // searchChatDetail.startDate = undefined;
    // searchChatDetail.endDate = undefined;
    // searchChatDetail.sendDate = null;
    copyToReactiveObj(
      { limit: 20, startDate: undefined, endDate: undefined, sendDate: null },
      searchChatDetail,
    );
    copyToReactiveObj({}, selectedChatListData.value);

    selectedUserId.value = '';

    chatDetailData.value = [];
    titleLogoUrl.value = '';
    titleName.value = '';

    sendMessage.value = '';
    disabledTXT.value = true;
    transferList.value = [];

    emojiModule.value = false;
    getCustomerList();
  };

  // 重置未读数量
  function resetNotReadTotalCount() {
    tabList.value.forEach((element) => {
      if (element.code === selectedChatListData.value.userTypeCode) {
        const tabNum = Number(element.notReadTotalCount);
        const listNum = Number(selectedChatListData.value.notReadTotalCount);
        element.notReadTotalCount = String(tabNum - listNum);
      }
      if (Number(element.notReadTotalCount) <= 0) {
        element.notReadTotalCount = '0';
      }
    });

    // 更新未读数量
    selectedChatListData.value.notReadTotalCount = '0';
  }

  // 更新消息列表的最新一条消息
  // @param data 消息列表
  // @param messageData 最新一条消息数据
  function updateShowChatListMessage(data, messageData) {
    console.log(data);
    data.forEach((element) => {
      if (
        (searchChatList.userTypeCode === 'buyer' &&
          selectedUserId.value === element.userId + element.mamaId) ||
        (searchChatList.userTypeCode === 'vendor' &&
          selectedUserId.value === element.userId + element.mamaId + element.shopId)
      ) {
        // 特殊消息处理
        if (messageData.messageTypeCode === MESSAGE_TYPE_CODE.IMAGE) {
          element.message = '[图片]';
        } else if (messageData.messageTypeCode === MESSAGE_TYPE_CODE.EMOJI_MAMA) {
          element.message = '[表情符号]';
        } else if (messageData.messageTypeCode === MESSAGE_TYPE_CODE.CHANGE_MAMA) {
          element.message = '[系统消息]';
        } else {
          element.message = messageData.message;
        }
      }
    });

    return data;
  }

  // 标记为已读
  function updateReceiverRead() {
    let params = {
      shopId: searchChatDetail.shopId,
      vendorId: searchChatDetail.vendorId,
      buyerId: searchChatDetail.buyerId,
    };
    customerService.updateReceiverRead(params).then(() => {
      console.log('标记为已读');
      resetNotReadTotalCount();
    });
  }

  // 查询未读总数
  async function getChatNotReadTotalCount(userTypeCode) {
    let params = {
      ...toRaw(searchChatList),
      userTypeCode: userTypeCode, // 用户类型
    };
    await customerService.getChatNotReadTotalCount(params).then((res) => {
      console.log('userTypeCode => ', userTypeCode);
      console.log('res => ', res);

      if (userTypeCode === 'buyer') {
        tabList.value[0].notReadTotalCount = res.notReadTotalCount;
      }
      if (userTypeCode === 'vendor') {
        tabList.value[1].notReadTotalCount = res.notReadTotalCount;
      }
    });
  }

  // 根绝信息格式初始化信息结构
  // @param initData 需要处理的信息数组
  // @param action 正在执行的操作，根据操作进行一些特殊处理
  async function initChatMessage(initData: Array<any>, action?: string) {
    if (!initData || (initData && initData.length === 0)) {
      // 空或数组为空,退出处理
      return [];
    }

    for (let index = 0; index < initData.length; index++) {
      const item = initData[index];
      if (item.sendDate) {
        // 未格式化前时间
        item['unformattedDate'] = item.sendDate;
        // 时间戳
        item['unformattedTimestamp'] = new Date(item.sendDate).getTime();
        // 时间格式化
        item.sendDate = formattingDateByCurrent(item.sendDate, 'chat');
      } else {
        console.log('------------无-----------', 'item.sendDate 为空');
      }

      switch (item.messageTypeCode) {
        case 'TXT':
          if (item.message.split('\n')) {
            // 换行符转化
            let contentArray = [] as any;
            for (let content of item.message.split('\n')) {
              contentArray.push(content);
            }
            if (contentArray.length !== 0) {
              item.message = contentArray;
              item.showType = 'array';
            }
          }

          break;

        case 'EMOJI_MAMA':
          item.message = action === 'list' ? '[表情符号]' : JSON.parse(item.message);
          break;

        case 'IMAGE':
          item.message = action === 'list' ? '[图片]' : item.message;
          break;

        // 在线客服转接
        case 'CHANGE_MAMA':
          item.message = JSON.parse(item.message);
          if (item.message.newMamaId) {
            // 获取转接客服姓名
            let newMamaData = await customerService.getMamaNameById(item.message.newMamaId);
            item.newMamaData = { ...newMamaData, id: item.message.newMamaId };
            if (item.message.oldMamaId) {
              let oldMamaData = await customerService.getMamaNameById(item.message.oldMamaId);
              if (newMamaData && oldMamaData) {
                // item.message = `由 ${(oldMamaData.nickName ? oldMamaData.nickName : oldMamaData.name)}`
                //   + `转接给 ${(newMamaData.nickName ? newMamaData.nickName : newMamaData.name)}`;
                item.oldMamaData = { ...oldMamaData, id: item.message.oldMamaId };
              }
              item.message = '[系统消息]';
            }
          } else {
            item.message = '系统提醒：转接信息异常'; // API异常
          }
          break;

        case 'CLOSE_SESSION': // 关闭会话
          item.message = '系统提示：会话已结束';
          break;
      }

      // 消息列表显示
      if (action === 'list') {
        // 商家头像
        item.shopLogoUrl = ossUtils.getSignatureUrl(item.shopLogoUrl);
        // 消费者头像
        item.userAvatarUrl = ossUtils.getSignatureUrl(item.userAvatarUrl);
        // 时间处理
        item.messageDate = formattingDateByCurrent(item.messageDate, 'list');

        if (
          (selectedTabCode.value === 'buyer' &&
            selectedUserId.value === item.userId + item.mamaId) ||
          (selectedTabCode.value === 'vendor' &&
            selectedUserId.value === item.userId + item.mamaId + item.shopId)
        ) {
          item.notReadTotalCount = '0';
        }
      }

      // 聊天记录详情显示
      if (action === 'detail') {
        if (item.shopId === searchChatDetail.shopId || item.buyerId === searchChatDetail.buyerId) {
          item['mode'] = 'start';
        } else {
          item['mode'] = 'end';
        }
        // 转接消息显示/关闭会话
        if (
          item.messageTypeCode === MESSAGE_TYPE_CODE.CHANGE_MAMA ||
          item.messageTypeCode === MESSAGE_TYPE_CODE.CLOSE_SESSION
        ) {
          item['mode'] = 'center';
        }
      }
    }

    return initData;
  }

  // 加载下一页
  function loadNextPageData() {
    if (chatItemContainerElement.value?.scrollTop === 0) {
      setTimeout(() => {
        // let { chatDetailData } = this;
        if (chatDetailData.value.length == 0) {
          return;
        }

        let firstData = chatDetailData.value[0];
        if (
          firstData &&
          firstData.unformattedDate &&
          searchChatDetail.sendDate !== firstData.unformattedDate
        ) {
          searchChatDetail.sendDate = firstData.unformattedDate;
          getChatRecordCustomerDetail('next');
        }
      }, 400);
    }
  }

  // 时间间隔机制
  function chatTimeInterval(current, previous): Boolean {
    let result = false;
    // 间隔五分钟； 5 * 60 * 1000
    if (current - previous < 5 * 60 * 1000) {
      result = false;
    } else {
      result = true;
    }

    return result;
  }

  // 显示发送时间控制,发送间隔超过5分钟
  function formatControlTime(data) {
    for (let index = 0, arrayLength = data.length; index < arrayLength; index++) {
      if (index === 0) {
        // 第一条默认显示
        data[index]['isShowTime'] = true;
        // 下一条
        continue;
      }
      // 转接消息的时间需要显示
      if (data[index].messageTypeCode === MESSAGE_TYPE_CODE.CHANGE_MAMA) {
        data[index]['isShowTime'] = true;
        // 下一条
        continue;
      }
      // const CurrentTime = new Date(data[index].unformattedDate).getTime(); // 当前时间戳
      // const PreviousTime = new Date(data[index - 1].unformattedDate).getTime(); // 上一次发送消息时间戳
      // 当前时间戳
      const CurrentTime = data[index].unformattedTimestamp;
      // 上一次发送消息时间戳
      const PreviousTime = data[index - 1].unformattedTimestamp;
      // 是否超出时间间隔
      data[index]['isShowTime'] = chatTimeInterval(CurrentTime, PreviousTime);
    }

    return data;
  }

  // 滚到最底部
  // @param action 'next' 加载下一页
  // @param speed 页面滚动的速度
  function scrollToBottom(action?: string, speed?: number) {
    speed = speed || 400;
    setTimeout(() => {
      switch (action) {
        case 'next':
          if (chatItemContainerElement.value) {
            const windowHeight = chatItemContainerElement.value.clientHeight;
            const _scrollHeight = chatItemContainerElement.value.scrollHeight;
            const scrollTop = _scrollHeight - scrollHeight.value - windowHeight;
            scrollHeight.value = _scrollHeight;
            if (scrollTop < 0) {
              chatItemContainerElement.value.scrollTop = scrollTop;
            } else {
              chatItemContainerElement.value.scrollTop = scrollTop;
            }
          }
          break;
        default:
          scrollHeight.value = chatItemContainerElement.value?.scrollHeight || 0;
          chatItemContainerElement.value &&
            (chatItemContainerElement.value.scrollTop = scrollHeight.value);
          break;
      }
    }, speed);
  }

  // 查询聊天记录
  // @param action init初始化 next加载下一页
  async function getChatRecordCustomerDetail(action: 'init' | 'next', listData?) {
    // let { searchChatDetail } = this;
    if (action === 'init') {
      // 初始化列表
      chatDetailData.value = [] as any;
      // searchChatDetail.sendDate = ''; // 重置分页时间
      // 重置分页时间
      searchChatDetail.sendDate = '';
      switch (listData.userTypeCode) {
        case 'vendor':
          let reqData = {
            shopId: listData.shopId,
            vendorId: listData.userId,
          };
          let vendorNickName = await customerService.getNicknameByShopIdAndVendorId(reqData);
          // 店铺名称 + 店员名称
          titleName.value = listData.shopName
            ? `${listData.shopName}：${vendorNickName.nickName}`
            : vendorNickName.nickName;
          titleLogoUrl.value = listData.shopLogoUrl ? listData.shopLogoUrl : listData.userAvatarUrl;
          searchChatDetail.shopId = listData.shopId;
          searchChatDetail.vendorId = listData.userId;
          break;
        case 'buyer':
          titleLogoUrl.value = listData.userAvatarUrl;
          titleName.value = listData.userNickName;
          searchChatDetail.buyerId = listData.userId;
          break;
      }
    }
    if (titleLogoUrl.value.indexOf('.oss-cn-shenzhen.') === -1) {
      titleLogoUrl.value = ossUtils.getSignatureUrl(titleLogoUrl.value);
    }

    loading.value = true;
    customerService
      .getChatRecordsDetail(searchChatDetail)
      .then(async (res) => {
        console.log(res);
        if (res && res.chatRecords.length !== 0) {
          // 格式化
          res.chatRecords = await initChatMessage(res.chatRecords, 'detail');
          res.chatRecords = formatControlTime(res.chatRecords); // 时间显示控制
          res.chatRecords = res.chatRecords.reverse(); // 倒序
          // 请求回来的排在前面
          chatDetailData.value = res.chatRecords.concat(chatDetailData.value);
          // 是否启用输入框
          isReception.value = selectedChatListData.value.mamaId == user.id;
          if (isReception.value) {
            // 标记为已读
            updateReceiverRead();
          }
        }
        scrollToBottom(action);

        // 加载表情包
        emojiDataList.value = emojiData;
        // let openmojiColorUrl = 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@13.1.0/color/svg/';
        emojiDataList.value.forEach((emoji) => {
          // emoji['hexcodeUrl'] = openmojiColorUrl + emoji.hexcode + '.svg'; // url拼接，背景图显示
          // url拼接，背景图显示
          emoji['hexcodeUrl'] = '/assets/images/openmoji-image/' + emoji.hexcode + '.png';
          // oss路径
          emoji['hexcodeOssUrl'] = 'pub/openmoji-image/' + emoji.hexcode + '.png';
        });
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
        message.error('数据加载失败！请刷新');
      });
  }

  // 选择聊天窗口对象
  async function selectChatType(listData) {
    console.log(listData);
    // 防抖动
    if (
      (listData.userTypeCode === 'buyer' &&
        selectedUserId.value === listData.userId + listData.mamaId) ||
      (searchChatList.userTypeCode === 'vendor' &&
        selectedUserId.value === listData.userId + listData.mamaId + listData.shopId)
    ) {
      return;
    }

    emojiModule.value = false; // 关闭表情包
    disabledTXT.value = false;

    // 选择聊天对象的data、初始化 form 数据
    // copyToReactiveObj(listData, selectedChatListData.value);
    selectedChatListData.value = listData;

    // 选择聊天对象的 Id
    selectedUserId.value = listData.userId + listData.mamaId;
    if (listData.userTypeCode === 'vendor') {
      selectedUserId.value += listData.shopId;
    }
    // 获取接待客服昵称
    let currentMamaData = await customerService.getMamaNameById(listData.mamaId);
    if (currentMamaData) {
      selectedChatListData.value['mamaNickName'] = currentMamaData.nickName;
    }

    // 接收消息的Id
    sendSocketMsg.shopId = listData.shopId;
    sendSocketMsg.receiverUserId = listData.userId;
    // 接收消息的code
    sendSocketMsg.receiverUserTypeCode = listData.userTypeCode;
    getChatRecordCustomerDetail('init', listData);
  }

  // 查询聊天列表
  const getCustomerList = () => {
    if (justCheckMe.value) {
      searchChatList.mamaId = user?.id?.toString();
    } else {
      searchChatList.mamaId = '';
    }
    console.log('searchChatList => ', toRaw(searchChatList));
    loading.value = true;
    customerService
      .getChatRecordCustomerList(toRaw(searchChatList))
      .then(async (res) => {
        // 更新tab的未读数量
        await getChatNotReadTotalCount('buyer');
        await getChatNotReadTotalCount('vendor');

        // 格式化
        chatList.value = await initChatMessage(res.mamaChats, 'list');

        // 搜索状态
        if (
          searchMode.value &&
          searchMamaChatCustomerData &&
          chatList.value &&
          chatList.value.length !== 0
        ) {
          selectChatType(searchMamaChatCustomerData);
          searchMode.value = false;
          searchMamaChatCustomerData = {} as any;
        }
        loading.value = false;
      })
      .catch((error) => {
        console.log(error);
        loading.value = false;
        message.error('加载列表失败！请刷新');
      });
  };

  // 接收消息
  // @param data 接受消息数据
  async function receiveMessgae(data) {
    console.log('接受新消息', data);
    switch (data.messageTypeCode) {
      case 'SUCCESS':
        // 发送成功的回调
        console.log('发送成功');
        // 时间间隔判断
        const _arrayLength = chatDetailData.value.length;
        if (_arrayLength === 0) {
          data['isShowTime'] = true;
        } else {
          const _currentTime = chatDetailData.value[_arrayLength - 1].unformattedTimestamp;
          data['isShowTime'] = chatTimeInterval(_currentTime, data.unformattedTimestamp);
        }
        break;

      case 'RECEIVER_READ':
        console.log('设置已读');
        break;

      default:
        // 更新聊天记录
        if (
          (data.senderUserTypeCode === 'buyer' &&
            selectedUserId.value === data.senderUserId + data.receiverUserId) ||
          (data.senderUserTypeCode === 'vendor' &&
            selectedUserId.value === data.senderUserId + data.receiverUserId + data.shopId)
        ) {
          // 将消息设置为已读
          if (data && data.id) {
            await updateReceiverReadById(data.id);
          }
          // 转接消息显示/关闭会话
          if (data.messageTypeCode === MESSAGE_TYPE_CODE.CHANGE_MAMA) {
            data['mode'] = 'center';
          } else {
            data['mode'] = 'start';
          }
          // 消息格式化
          let initData = (await initChatMessage([data]))[0];
          chatDetailData.value.push(initData);
          // 滚到最底部
          scrollToBottom();
        }

        if (selectedTabCode.value === searchChatList.userTypeCode) {
          // 更新聊天列表
          getCustomerList();
        }

        console.log('实时更新tab未读数量 =>');
        // 实时更新tab未读数量
        getChatNotReadTotalCount(searchChatList.userTypeCode);
        break;
    }
  }

  // 发送消息
  // @param action  操作：默认为文本处理模式
  function onSendMessage(action) {
    // let { sendSocketMsg } = this;
    const _sendSocketMsg = {
      ...toRaw(sendSocketMsg),
    };
    // 创建消息对象
    const currentTime = new Date(); // 当前时间
    _sendSocketMsg.message = sendMessage.value;
    // 消息类型 (默认为文本处理模式)
    _sendSocketMsg.messageTypeCode = action;
    _sendSocketMsg.sendDate = String(currentTime.getTime());

    // 新发送的消息(视图显示)
    let newMessage = {
      senderUserId: _sendSocketMsg.senderUserId,
      senderUserTypeCode: _sendSocketMsg.senderUserTypeCode,
      message: _sendSocketMsg.message,
      messageTypeCode: _sendSocketMsg.messageTypeCode,
      sendDate: currentTime, // 时间
      unformattedTimestamp: currentTime.getTime(), // 毫秒时间戳
      mode: 'end', // （用于判断自己发送的消息）
      mamaNickName: user.nickName,
    };
    console.log(_sendSocketMsg);
    loading.value = true;

    // webSocket发送消息给后端
    webSocketService.sendMessage(JSON.stringify(_sendSocketMsg)).then((result) => {
      if (result === 'SEND_SUCCESS') {
        // 发送成功，更新视图显示的数据
        if (selectedTabCode.value === _sendSocketMsg.receiverUserTypeCode) {
          // 更新列表
          chatList.value = updateShowChatListMessage(chatList.value, _sendSocketMsg);

          // 滚到最底部
          scrollToBottom();
          if (newMessage.messageTypeCode === MESSAGE_TYPE_CODE.EMOJI_MAMA) {
            newMessage.message = JSON.parse(newMessage.message);
          }
          chatDetailData.value.push(newMessage);
          // 清空sendMessage内容
          sendMessage.value = '';
          loading.value = false;
        }
      } else if (result === 'SEND_FAILED') {
        message.error('网络连接错误');
      } else {
        message.error('发送失败，请重试');
      }
      loading.value = false;
    });
  }

  // 修改一条消息为已读（根据Id）(收到消息回调后)
  // @param id 消息Id
  async function updateReceiverReadById(id) {
    // receiverReadTimes && clearTimeout(receiverReadTimes);
    // receiverReadTimes = setTimeout(() => {
    //   console.log('更新已读标识 => 111111111111111111');

    //   customerService.updateReceiverReadById(id).then(() => {
    //     receiverReadTimes && clearTimeout(receiverReadTimes);
    //     console.log('更新已读标识 => 2222222222222222222222');
    //     resetNotReadTotalCount();
    //     console.log('更新已读标识 => 333333333333333333333');
    //   });
    // }, 600);

    await customerService.updateReceiverReadById(id).then(() => {
      console.log('更新已读标识 => 2222222222222222222222');
      resetNotReadTotalCount();
      console.log('更新已读标识 => 333333333333333333333');
    });
  }

  // 获取转接客服列表
  function getListTransferMama() {
    loading.value = true;
    customerService
      .getListTransferMama()
      .then((res) => {
        console.log(res);

        transferList.value = res.mamas;
        if (transferList.value.length === 0) {
          message.error('没有数据');
        }
        loading.value = false;
      })
      .catch((error) => {
        console.log(error);
        loading.value = false;
        message.error('加载列表失败！请刷新');
      });
  }

  // 开启 websocket连接
  // @param this.sendSocketMsg.senderUserId 用户Id
  function openWebSocket() {
    webSocketService.connect(sendSocketMsg.senderUserId);

    // 接收消息
    webSocketService.messageSubject.subscribe(
      async (data) => {
        receiveMessgae(data);
      },
      () => {
        message.error('接受消息失败！请刷新');
      },
    );
  }

  // 发送表情包
  function emojiAciton(event: any) {
    console.log('emojiAciton.event => ', event);
    emojiModule.value = false;
    const sendEmojiData = {
      emoji: event.emoji, // 表情符号
      hexcode: event.hexcode, // 十六进制代码
      hexcodeUrl: event.hexcodeUrl, // url
      hexcodeOssUrl: event.hexcodeOssUrl, // oss路径
      group: event.group, // 组
      subgroups: event.subgroups,
      annotation: event.annotation, //  注释
      tags: event.tags, // 标签
      unicode: event.unicode,
      order: event.order, // 唯一code
    };
    sendMessage.value = JSON.stringify(sendEmojiData);
    onSendMessage(MESSAGE_TYPE_CODE.EMOJI_MAMA);
  }

  // 选择转接对象
  function selectTransfer(index) {
    transferData.value = transferList.value[index];
    if (transferData.value.mamaId == changeMamaMessage.newMamaId) {
      message.error('不同重复转接给同一个客服');
      return;
    }

    isShowTransferModule.value = true;
  }

  // 仅查自己
  function changeCheckBox() {
    searchChatList.userTypeCode = selectedTabCode.value;
    if (justCheckMe.value) {
      searchChatList.mamaId = `${user.id}`;
    } else {
      searchChatList.mamaId = '';
    }
    isReception.value = false;
    selectedUserId.value = '';
    chatDetailData.value = [];
    titleLogoUrl.value = '';
    titleName.value = '';
    transferList.value = [];

    getCustomerList();
  }

  // 操作
  function iconEvent(action) {
    if (!action) {
      return;
    }

    switch (action) {
      case 'smile': // 表情包
        emojiModule.value = !emojiModule.value;
        break;
      case 'team': // 转接
        if (
          selectedChatListData.value.userTypeCode === 'buyer' &&
          checkValueOfEmpty(searchChatDetail.buyerId)
        ) {
          message.error('请选择聊天对象');
          return;
        }
        if (
          selectedChatListData.value.userTypeCode === 'vendor' &&
          checkValueOfEmpty(searchChatDetail.vendorId)
        ) {
          message.error('请选择聊天对象');
          return;
        }
        getListTransferMama();
        break;
      case 'close': // 关闭会话
        isCloseSession.value = true;
        break;
    }
  }

  // 选中文件时
  async function fileChangeEvent(event: any) {
    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    // this.imageChangedEvent = await getObjectURL(files[0]);
    const objectUrl = await getObjectURL(files[0]);
    copyToReactiveObj(objectUrl, imageChangedEvent);

    console.log('objectUrl=>', objectUrl);
    console.log('imageChangedEvent=>', imageChangedEvent);

    // 重置
    backFileElement.value?.value && (backFileElement.value.value = '');
    isSHowCropped.value = true;
    disabledTXT.value = false;
  }

  // 获取网络图片url
  async function getObjectURL(file) {
    loading.value = true;
    let dateUnixTime = new Date().getTime();
    // console.log('dateUnixTime =>', dateUnixTime);
    // console.log('file =>', file);

    // '.jpeg'
    let name = dateUnixTime + file.type.replace('image/', '.');
    // console.log('name =>', name);

    return new Promise<any>((resolve: any) => {
      ossUtils
        .uploadFile(name, file)
        .then((data) => {
          console.log('data =>', data);

          resolve(data);
          loading.value = false;
        })
        .catch((error) => {
          console.log('error =>', error);

          resolve(file);
          loading.value = false;
        });
    });
  }

  // 确认后 赋值 和初始化
  async function confirmCropped() {
    sendMessage.value = imageChangedEvent.name;
    onSendMessage(MESSAGE_TYPE_CODE.IMAGE);
    isSHowCropped.value = false;
    imageChangedEvent.name = '';
    imageChangedEvent.url = '';
  }

  // 回车发送
  function keyUpByEnter(event) {
    if (event.keyCode !== 13) {
      return false;
    }

    send();
  }

  // 发送消息
  function send() {
    if (checkValueOfEmpty(sendSocketMsg.receiverUserId)) {
      message.error('请选择聊天对象');
      return;
    }
    sendMessage.value = _.trim(sendMessage.value);
    if (checkValueOfEmpty(sendMessage.value)) {
      message.error('发送消息不能为空');
      return;
    }
    console.log(sendSocketMsg.messageTypeCode);

    onSendMessage(MESSAGE_TYPE_CODE.TXT);
  }

  // 跳转到详情
  function goDetail() {
    let url = '';
    if (searchChatDetail.buyerId && permissionCodeList.BUYER_DETAIL_GET) {
      // go(`/consumer/basic/consumerDetail/${searchChatDetail.buyerId}`);
      url = `${window.location.origin}#/consumer/basic/consumerDetail/${searchChatDetail.buyerId}`;
    } else if (searchChatDetail.shopId && permissionCodeList.SHOP_DETAIL_GET) {
      // go(`/merchant/basic/shopDetail/${searchChatDetail.shopId}`);
      url = `${window.location.origin}#/merchant/basic/shopDetail/${searchChatDetail.shopId}`;
    }
    url && window.open(url);
  }

  onMounted(async () => {
    // 初始化 user 数据
    // const _userInfo = store.getUserInfo;
    // Object.keys(user).forEach((item) => {
    //   let key = item as keyof typeof user;
    //   if (_userInfo.hasOwnProperty(key)) {
    //     user[key] = _userInfo[key] as never;
    //   } else {
    //     user[key] = '' as never;
    //   }
    // });
    copyToReactiveObj(store.getUserInfo, user);

    console.log('permissionCodeList =>', toRaw(permissionCodeList));
    console.log('store.getUserInfo =>', store.getUserInfo);

    // permissionCodeList = matchPermissionsCode(permissionCodeList, user.permissions);
    matchPermissionsCode(permissionCodeList, user.permissions);

    // 当前用户Id
    sendSocketMsg.senderUserId = user.id;
    // this.searchChatList.mamaId = this.user.id;

    // TODO 不知道业务逻辑
    // this.route.queryParams.subscribe((res) => {
    //   let urlData = store.get('searchMamaChatCustomerData');
    //   if (urlData && res.selectedTypeCode) {
    //     this.searchMode = true;
    //     this.searchMamaChatCustomerData = urlData;
    //     this.selectedTabCode = res.selectedTypeCode;
    //     this.searchChatList.userTypeCode = res.selectedTypeCode;
    //     store.remove('searchMamaChatCustomerData'); // 清除缓存
    //   }
    // });

    openWebSocket();
    getCustomerList();
  });

  onUnmounted(() => {
    // 销毁定时器
    timer && clearInterval(timer);
    // this.webSocketService.onClose();
  });
</script>

<style lang="less" scoped>
  @import '../style.less';

  :deep(.ant-spin-container) {
    height: 100%;
  }

  .tab-container {
    background: #f8f8f8;
  }

  .tab-container .tab-content-container .tab-item {
    width: 50%;
    flex: 1 1 auto;
    position: relative;

    .circle-red {
      position: absolute !important;
      top: 8px !important;
      right: 0 !important;
    }
  }

  .tab-bottom {
    padding: 16px 20px;
    color: #333;
    background: #f8f8f8;
    line-height: 19px;
  }

  // 红色圆圈
  .circle-red {
    width: 11px;
    height: 11px;
    background: #c02235;
    border-radius: 50%;
    margin-right: 10px;
  }

  .chat-container {
    height: 100%;
    background: none;

    // 头像
    .avatar-content {
      width: 38px;
      height: 38px;
      flex-shrink: 0;
      margin: 0 10px;
      background: #ececec;
      border-radius: 50%;
      text-align: center;

      i {
        color: #dedede;
        padding-top: 6px;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }

      // 在线状态
      &._green {
        position: relative;

        &::before {
          content: '';
          width: 10px;
          height: 10px;
          background: #4de60d;
          border-radius: 50%;
          position: absolute;
          right: 0;
          bottom: 0;
        }

        &._grey::before {
          background: #999;
        }
      }
    }

    // 左边列表
    .chat-relationship-container,
    .chat-customership-container {
      // width: 300px;
      width: 100%;
      // height: 100%;
      // height: calc(100vh - 48px - 20px - 20px);
      height: calc(100vh - 88px);
      background: #fff;
      overflow: hidden;

      .chat-content-title {
        height: 50px;
        line-height: 50px;
        background: #f8f8f8;
        text-align: center;
        color: #83868e;
      }

      .customer-item {
        padding: 15px 8px 0 8px;
        cursor: pointer;
      }
    }

    // 消费者 商家列表
    .chat-list-content {
      // height: calc(100vh - 48px - 20px - 50px - 52px - 20px);
      height: calc(100vh - 190px);

      .list-item-container {
        line-height: 21px;
        padding: 16px 10px 16px 5px;
        vertical-align: middle;
        cursor: pointer;
        // border-bottom: 1px solid #F2F2F2;

        &._selected {
          background: #f5f7f9;
        }

        ._date {
          max-width: 64px;
          font-size: 12px;
          line-height: 16px;
          color: #999999;
          text-align: right;
        }

        ._circle {
          width: 30px;
          color: #fff;
          background-color: #c02235;
          border-radius: 10px;
          text-align: center;
          font-size: 12px;
          line-height: 16px;
          margin-top: 4px;
        }

        ._red-dot {
          width: 11px;
          height: 11px;
          background: #c02235;
          border-radius: 50%;
          margin-right: 10px;
        }
      }

      ._value {
        width: 100%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }

      ._msg-value {
        color: #888;
        word-wrap: break-word;
        word-break: break-all;

        &._red {
          color: #c02235;
        }

        span {
          font-size: 10px;
          color: #c02235;
        }
      }
    }

    // 聊天窗口
    .chat-detail-container {
      width: 100%;
      height: 100%;
      background: #f5f5f5;
      overflow: hidden;

      border-left: 1px solid #e4e7ed;
      border-right: 1px solid #e4e7ed;

      // 标题
      .chat-detail-title {
        padding: 20px 30px;
        height: 60px;
        background: #fff;

        img {
          width: 60px;
          height: 60px;
          margin-right: 10px;
          object-fit: cover;
          border-radius: 50%;
        }
      }

      // 聊天记录(内容)
      .chat-detail-content {
        padding: 0 20px;
        // height: calc(100vh - 60px - 180px - 48px - 20px - 20px);
        height: calc(100vh - 328px);

        &.show-height {
          // height: calc(100vh - 60px - 48px - 20px - 20px) !important;
          height: calc(100vh - 148px) !important;
        }

        .chat-item-top {
          margin: 0 auto;
          color: #565656;
          text-align: center;
          position: relative;

          &::before,
          &::after {
            content: '';
            width: 100px;
            height: 1px;
            background-color: #e4e7ed;
            position: absolute;
            bottom: 10px;
          }

          &::before {
            left: 29%;
          }

          &::after {
            right: 29%;
          }
        }

        .chat-item-date {
          margin: 0 auto;
          color: #999;
          text-align: center;
          padding-top: 20px;
        }

        .chat-item-container {
          margin-bottom: 10px;
          position: relative;

          &:last-child {
            margin-bottom: 44px;
          }

          // 名字
          .chat-item-name {
            color: #666;
            line-height: 21px;

            &._end {
              position: absolute;
              top: 0;
              right: 60px;
            }
          }

          .center-box {
            display: inline-block;
            padding: 5px 20px;
            color: #000000;
            background: #ebebeb;
            border-radius: 15px;
          }

          // ._red {
          //     color: #C02235;
          //     text-align: center;
          // }

          // 回复
          .chat-item-quote {
            border-bottom: 1px solid #d9d9d9;
            padding: 0 0 10px 5px;
            margin-bottom: 10px;
            position: relative;

            &::after {
              content: '';
              height: 100%;
              width: 3px;
              background-color: #d9d9d9;
              position: absolute;
              left: -10px;
              top: 0;
            }

            ._nick_name {
              color: #a3a3a3;
              font-size: 24rpx;
            }
          }

          .chat-item-message {
            max-width: 500px;
            padding: 6px 10px;
            margin-top: 8px;
            line-height: 20px;
            background-color: #ffffff;
            border-radius: 4px;
            word-wrap: break-word;
            word-break: break-all;

            &._end {
              background-color: #1886fd;
              color: #fff;
              margin-top: 26px;
            }

            // 图片
            &.file_image {
              width: 130px;
              min-height: 100px;
              background: none;
            }
          }
        }

        // 撤回消息
        ._pullout-msg {
          width: 33%;
          margin: 0 auto;
          text-align: center;
          background-color: #f5f5f5;
          border-radius: 8px;
          font-size: 14px;
          margin-top: 10px;
          margin-bottom: 10px;
        }
      }

      // 底部
      .chat-detail-footer {
        height: 180px;
        background-color: #fff;

        .footer-content {
          width: 100%;
          border-bottom: 1px solid #e4e7ed;
          position: relative;
          padding-left: 10px;

          .icon-color {
            font-size: 18px; //大小
            color: #666;
            cursor: pointer;
          }

          .footer-item {
            position: relative;
            width: 36px;
            height: 36px;

            &._file {
              width: 18px;
              height: 36px;
              margin: 0 10px;
            }

            // 文件
            .file-input {
              width: 22px !important;
              height: 22px !important;
              position: absolute;
              top: 0;
              left: 0;
              filter: alpha(opacity=0);
              -moz-opacity: 0;
              opacity: 0;
              cursor: pointer;
              font-size: 0;
            }
          }

          // 关闭会话
          .close-icon {
            position: absolute;
            right: 20px;
            top: 0;

            .icon-color {
              color: #f5222d !important;
            }
          }
        }

        textarea {
          width: 100%;
          height: 92px;
          border: none;
          padding: 6px;
        }

        .action-btn {
          float: right;
          margin-right: 30px;
          width: 88px;
          color: #000;
          background: #fafafa;

          &._active {
            color: #fff;
            background: #c02235 !important;

            &:hover {
              color: #fff !important;
            }
          }
        }
      }
    }
  }

  // button 样式重写
  .ant-btn:focus,
  .ant-btn:hover {
    color: #c02235 !important;
    border-color: #c02235 !important;
  }

  .ant-btn[disabled]:focus,
  .ant-btn[disabled]:hover {
    color: rgba(0, 0, 0, 0.25) !important;
    border-color: #d9d9d9 !important;
  }

  .model-image {
    width: 200px;
    margin: 10px auto;
  }

  .image-container {
    background: none !important;
  }
</style>
