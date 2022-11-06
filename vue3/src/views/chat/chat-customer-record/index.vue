<template>
  <!-- 管理列表 -->
  <div class="page-container">
    <!-- 头部栏 -->
    <div class="page-header-container">
      <!-- 搜索栏 -->
      <div class="search-container">
        <div class="flex_start_wrap">
          <div class="search-item">
            <a-select
              v-model:value="searchData.userTypeCode"
              style="width: 100%"
              allowClear
              showSearch
              placeholder="客户类型"
              @change="selectDate"
            >
              <a-select-option v-for="item in userTypeList" :value="item?.code" :key="item?.code">
                {{ item?.name }}
              </a-select-option>
            </a-select>
          </div>

          <div class="search-item">
            <a-input type="text" placeholder="客户名称" v-model:value="searchData.name" />
          </div>

          <div class="search-item" style="width: auto">
            <a-range-picker v-model:value="dateRange" />
          </div>

          <div class="flex_start">
            <div class="search-item" style="width: auto" v-if="permissionCodeList.CHAT_GET">
              <div class="action-btn red" @click="search()">
                <SearchOutlined />
              </div>
            </div>
            <div class="search-item" style="width: auto" v-if="permissionCodeList.CHAT_GET">
              <div class="action-btn" @click="reset()">
                <ReloadOutlined />
              </div>
            </div>
          </div>
          <div style="color: #999; font-size: 14px"> 客户类型必选，查询聊天记录间隔不超过30天 </div>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <a-spin tip="Loading..." :spinning="loading || loadingDetail" size="large" delay="500">
      <div class="flex_between-top chat-record-container">
        <div class="flex_start_top chat-relationship-container">
          <div class="chat-content-container">
            <div class="chat-content-title">客户账号列表</div>
            <div class="chat-content-list scrollbar-item-y">
              <template v-if="searchMode && customerList && customerList.length === 0">
                <div style="color: #b8b8b8; text-align: center; line-height: 56px">
                  暂无相关内容
                </div>
              </template>
              <template v-for="(customerItem, itemIndex) in customerList" :key="itemIndex">
                <div
                  class="content-item"
                  :class="{ selected: selectedIndex === itemIndex }"
                  @click="selectWindow(itemIndex, customerItem)"
                >
                  <span class="_value">
                    {{
                      customerItem.userTypeCode === 'buyer'
                        ? customerItem.userNickName
                        : customerItem.shopName
                    }}
                  </span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="chat-detail-container">
          <div class="chat-detail-title">聊天记录详情</div>
          <div class="chat-detail-content scrollbar-item-y">
            <template v-if="chatDetailData && chatDetailData.length !== 0">
              <template v-for="chatDetail in chatDetailData" :key="chatDetail">
                <div class="chat-item-date">{{ chatDetail?.date }}</div>
                <div
                  class="chat-item-container"
                  v-for="chatItem in chatDetail.chatData"
                  :key="chatItem"
                >
                  <div class="chat-item-name">
                    <span v-if="chatItem.userTypeCode === 'buyer'">
                      {{ chatItem?.buyerNickName }}
                    </span>
                    <span v-if="chatItem.userTypeCode === 'vendor'">
                      {{ shopNickName }}
                    </span>
                    <span v-if="chatItem.userTypeCode === 'mama'">
                      {{ chatItem?.mamaNickName }}
                    </span>
                    <span>&nbsp;&nbsp;{{ chatItem?.sendDate }}</span>
                  </div>

                  <!-- 文本 -->
                  <template v-if="chatItem.messageTypeCode === 'TXT'">
                    <div class="chat-item-message">{{ chatItem?.message }}</div>
                  </template>

                  <!-- 表情符 -->
                  <template v-if="chatItem.messageTypeCode === 'EMOJI_MAMA'">
                    <i
                      class="oma oma-6x"
                      :style="{ 'background-image': 'url(' + chatItem.message?.hexcodeUrl + ')' }"
                      :title="chatItem.message?.annotation"
                    ></i>
                  </template>

                  <!-- 图片 -->
                  <template v-if="chatItem.messageTypeCode === 'IMAGE'">
                    <div class="chat-item-message file_image">
                      <image-container :image-src="chatItem.message" />
                    </div>
                  </template>

                  <!-- 系统消息 -->
                  <template
                    v-if="
                      chatItem.messageTypeCode === 'CHANGE_MAMA' ||
                      chatItem.messageTypeCode === 'CLOSE_SESSION'
                    "
                  >
                    <div class="flex_center">
                      <div class="center-box">
                        <template v-if="chatItem.messageTypeCode === 'CHANGE_MAMA'">
                          <template v-if="chatItem?.oldMamaData && chatItem?.newMamaData">
                            <span>由 </span>
                            <span class="font-color-C02235">
                              {{ chatItem.oldMamaData.nickName }}
                            </span>
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
                  </template>

                  <!-- 商品类型 -->
                  <template v-if="chatItem.messageTypeCode === 'LINK'">
                    <div class="chat-item-product">
                      <div class="chat-item-img">
                        <image-container :imageSrc="chatItem?.message?.productFile?.fileUrl" />
                      </div>
                      <a-popover :title="''" placement="topLeft" trigger="hover">
                        <div class="text-ellipsis-2">
                          <span class="_tag">藏品</span>
                          <span>{{ chatItem?.message?.name }}</span>
                        </div>
                        <template #content>
                          <div style="max-width: 400px"> {{ chatItem?.message?.name }}</div>
                        </template>
                      </a-popover>

                      <div style="color: #666; margin-top: 8px">
                        {{ chatItem?.message?.shopName }}
                      </div>
                    </div>
                  </template>

                  <!-- 回复 -->
                  <template v-if="chatItem.messageTypeCode === 'QUOTE'">
                    <div class="chat-item-quote">
                      <div class="_nick_name">{{ chatItem?.message?.quote?.nickName }} </div>
                      <div class="chat-item-message">
                        {{ chatItem?.message?.quote?.message[0]?.content }}
                      </div>
                    </div>
                    <div class="chat-item-message">{{ chatItem?.message?.reply }}</div>
                  </template>

                  <!-- 撤回的消息 -->
                  <template v-if="chatItem.messageTypeCode === 'PULL_OUT'">
                    <div class="chat-item-message">
                      {{ chatItem?.message }}
                      <span class="_span">(客户撤回的消息)</span>
                    </div>
                  </template>

                  <!-- 撤回消息里包含着回复的消息 -->
                  <template v-if="chatItem.messageTypeCode === 'QUOTE_PULL_OUT'">
                    <div class="chat-item-quote">
                      <div class="_nick_name">{{ chatItem?.message?.quote?.nickName }} </div>
                      <div class="chat-item-message">
                        {{ chatItem?.message?.quote?.message[0]?.content }}
                      </div>
                    </div>
                    <div class="chat-item-message">
                      {{ chatItem?.message?.reply }}
                      <span class="_span">(客户撤回的消息)</span>
                    </div>
                  </template>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
  import { message } from 'ant-design-vue';
  import { onMounted, reactive, ref, toRaw } from 'vue';
  import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import { checkValueOfEmpty, copyToReactiveObj, matchPermissionsCode } from '/@/utils/table';
  import * as customerService from '../chat-customer/chatCustomer.api';
  import ImageContainer from '../components/ImageContainer.vue';
  import { useUserStore } from '/@/store/modules/user';

  const store = useUserStore();

  /************************变量定义************************** */

  const loading = ref(false);
  // 搜索状态
  const searchMode = ref(false);
  // // 搜索结果
  // const searchList = ref([] as any[]);

  const dateRange = ref([] as any[]);

  const searchData = reactive({
    userTypeCode: '', // 用户类型
    name: '', // 客户名称
    startDate: '',
    endDate: '',
  });

  const userTypeList = ref([
    { name: '消费者', code: 'buyer' },
    { name: '商家', code: 'vendor' },
  ]);

  const customerList = ref([] as any[]);
  const selectedIndex = ref(-1);
  const selectedListData = reactive({
    shopId: '',
    userId: '',
    userTypeCode: '',
  });

  const loadingDetail = ref(false);
  const chatDetailData = ref([] as any[]);
  const chatDetailreqData = reactive({
    shopId: '',
    vendorId: '',
  });
  const shopNickName = ref('');

  const permissionCodeList = reactive({
    CHAT_GET: false,
  });

  //------------------------------方法-----------------------------

  // 查询
  function search() {
    searchMode.value = true;
    customerList.value = [];
    selectedIndex.value = -1;
    copyToReactiveObj({}, selectedListData);

    chatDetailData.value = [];
    copyToReactiveObj({}, chatDetailreqData);
    shopNickName.value = '';
    getList();
  }

  // 重置
  function reset() {
    searchMode.value = false;
    copyToReactiveObj({}, searchData);

    customerList.value = [];
    selectedIndex.value = -1;
    copyToReactiveObj({}, selectedListData);
    chatDetailData.value = [];
    copyToReactiveObj({}, chatDetailreqData);
    shopNickName.value = '';
  }

  // 检测当前搜索模式,改变查询参数
  function checkSearchMode() {
    if (searchMode.value) {
      if (dateRange.value.length == 2) {
        searchData.startDate = dateUtil(dateRange.value[0]).format('YYYY-MM-DD 00:00:00');
        searchData.endDate = dateUtil(dateRange.value[1]).format('YYYY-MM-DD 23:59:59');
      } else {
        searchData.startDate = '';
        searchData.endDate = '';
      }

      return toRaw(searchData);
    }

    // 不是搜索模式下，参数传空
    return {
      userTypeCode: '',
      name: '',
      startDate: '',
      endDate: '',
    };
  }

  // 获取列表（查询）
  function getList() {
    console.log(toRaw(searchData));
    let params = {
      // 获取搜索栏参数
      ...checkSearchMode(),
    };
    if (checkValueOfEmpty(searchData.userTypeCode)) {
      message.error('客服类型必选');
      return;
    }
    if (checkValueOfEmpty(searchData.startDate) && checkValueOfEmpty(searchData.endDate)) {
      message.error('请选择选择操作时间');
      return;
    }
    loading.value = true;
    customerService
      .getChatCustomerRecordList(params)
      .then((res) => {
        console.log(res);
        customerList.value = res;
        loading.value = false;
      })
      .catch((error) => {
        console.log(error);
        loading.value = false;
        message.error('加载列表失败！请刷新');
      });
  }

  // 查询聊天记录详情
  function getChatRecordDetail() {
    loadingDetail.value = true;
    let params = {
      limit: 10000,
      shopId: '',
      buyerId: '',
      vendorId: '',
      startDate: searchData.startDate,
      endDate: searchData.endDate,
      sendDate: '',
    };
    switch (selectedListData.userTypeCode) {
      case 'buyer':
        params.buyerId = selectedListData.userId;
        break;
      case 'vendor':
        params.vendorId = selectedListData.userId;
        params.shopId = selectedListData.shopId;
        break;
    }
    customerService
      .getChatRecordsDetail(params)
      .then(async (res) => {
        let chatData = [] as any[];
        let nowDate = '';
        if (res.chatRecords && res.chatRecords.length !== 0) {
          // 倒序
          res.chatRecords = res.chatRecords.reverse();
          for (let index = 0; index < res.chatRecords.length; index++) {
            const chatItem = res.chatRecords[index];
            // 时间格式化
            if (
              chatData.length !== 0 &&
              nowDate === dateUtil(chatItem.sendDate).format('YYYY-MM-DD')
            ) {
              chatItem.sendDate = dateUtil(chatItem.sendDate).format('HH:mm:ss');
              chatData[chatData.length - 1].chatData.push(chatItem);
            } else {
              nowDate = dateUtil(chatItem.sendDate).format('YYYY-MM-DD');
              chatItem.sendDate = dateUtil(chatItem.sendDate).format('HH:mm:ss');
              chatData.push({
                date: nowDate,
                chatData: [chatItem],
              });
            }

            // let { chatDetailreqData } = this;
            if (
              chatItem.userTypeCode === 'vendor' &&
              chatDetailreqData.shopId !== selectedListData.shopId
            ) {
              // 同一个店铺Id，只调一次API拿店员名称
              chatDetailreqData.shopId = selectedListData.shopId;
              chatDetailreqData.vendorId = selectedListData.userId;
              let vendorNickName = await customerService.getNicknameByShopIdAndVendorId(
                toRaw(chatDetailreqData),
              );
              // 店铺名称 + 店员名称
              shopNickName.value = chatItem.shopName
                ? `${chatItem.shopName}：${vendorNickName.nickName}`
                : vendorNickName.nickName;
            }

            switch (chatItem.messageTypeCode) {
              case 'TXT':
                break;
              case 'EMOJI_MAMA':
                chatItem.message = JSON.parse(chatItem.message);
                break;
              case 'IMAGE':
                chatItem.message = chatItem.message;
                break;
              case 'CHANGE_MAMA': // 在线客服转接
                let message = JSON.parse(chatItem.message);
                if (message.newMamaId) {
                  // 获取转接客服姓名
                  let newMamaData = await customerService.getMamaNameById(message.newMamaId);
                  chatItem['newMamaData'] = { ...newMamaData, id: message.newMamaId };
                  if (message.oldMamaId) {
                    let oldMamaData = await customerService.getMamaNameById(message.oldMamaId);
                    if (newMamaData && oldMamaData) {
                      chatItem['oldMamaData'] = { ...oldMamaData, id: message.oldMamaId };
                    }
                    message = '[系统消息]';
                  }
                } else {
                  message = '系统提醒：转接信息异常'; // API异常
                }
                break;
              case 'CLOSE_SESSION': // 关闭会话
                chatItem.message = '系统提示：会话已结束';
                break;
            }
          }
        }

        console.log(chatData);
        chatDetailData.value = chatData;
        loadingDetail.value = false;
      })
      .catch(() => {
        loadingDetail.value = false;
        message.error('数据加载失败！请刷新');
      });
  }

  function selectWindow(index, listData) {
    if (selectedIndex.value === index) {
      return;
    }

    chatDetailData.value = [];
    selectedIndex.value = index;
    // selectedListData = listData;
    copyToReactiveObj(listData, selectedListData);

    chatDetailreqData.shopId = '';
    chatDetailreqData.vendorId = '';
    shopNickName.value = '';

    getChatRecordDetail();
  }

  function selectDate(select) {
    if (select && select.length === 2) {
      console.log(select[0]);
      let diffValue = dateUtil(select[1]).diff(dateUtil(select[0]), 'days');
      if (diffValue >= 30) {
        message.warning('时间选择范围不能超过30天');
        // this.dateRange = [];
      }
    }
  }

  onMounted(() => {
    // 初始化权限
    matchPermissionsCode(permissionCodeList, store.getUserInfo.permissions);

    // dateRange.value[0] = dateUtil().format('YYYY-MM-DD');
    // dateRange.value[1] = dateUtil().format('YYYY-MM-DD');

    searchData.userTypeCode = 'buyer';
    // this.route.queryParams.subscribe((res) => {
    //   if (res.pageNum > 0) {
    //     const pageNum = res.pageNum;
    //     this.pageNum = pageNum;
    //   }
    //   const urlData = store.get('searchMamaChatRecordData');
    //   // 工作台 - 平台客服未读消息
    //   if (urlData && res.status === 'UNREAD') {
    //     console.log(urlData);
    //     this.searchData.userTypeCode = urlData.userTypeCode;
    //     this.dateRange[0] = moment(urlData.messageDate)
    //       .subtract(1, 'days')
    //       .format('YYYY-MM-DD 00:00:00');
    //     this.dateRange[1] = moment(urlData.messageDate).format('YYYY-MM-DD 23:59:59');
    //     this.searchMode = true;
    //     this.searchData = {
    //       name: urlData.shopName ? urlData.shopName : urlData.userNickName,
    //       userTypeCode: urlData.userTypeCode,
    //       startDate: this.dateRange[0],
    //       endDate: this.dateRange[1],
    //     };
    //     const currentData = {
    //       shopName: urlData.shopName,
    //       shopId: urlData.shopId,
    //       userNickName: urlData.userNickName,
    //       userId: urlData.userId,
    //       userTypeCode: urlData.userTypeCode,
    //     };
    //     this.customerList.push(currentData);
    //     this.selectedIndex = 0;
    //     this.selectedListData = currentData;
    //     this.getList();
    //     this.getChatRecordDetail();
    //     store.remove('searchChatRecordData'); // 清除缓存
    //   }
    // });
  });
</script>

<style lang="less" scoped>
  @import '../style.less';

  .chat-record-container {
    // width: 100%;
    // height: 100%;
    // height: calc(100vh - 48px - 20px - 55px - 20px);
    height: calc(100vh - 143px);
    background: none;
    border-radius: 0px;

    .chat-relationship-container {
      width: 300px;
      height: 100%;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      // position: relative;

      .chat-content-container {
        width: 50%;
        height: 100%;
        border-right: 1px solid #f2f2f2;
        flex: 1 1 auto;

        &:last-child {
          border-right: none;
        }

        .chat-content-title {
          height: 51px;
          background-color: #f8f8f8;
          line-height: 51px;
          text-align: center;
        }

        .chat-content-list {
          height: calc(100% - 51px);

          .content-item {
            line-height: 21px;
            padding: 10px 6px 10px 12px;
            vertical-align: middle;
            border-bottom: 1px solid #f2f2f2;

            &.selected {
              background: #ebecf1;
            }

            ._value {
              width: 100%;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
          }
        }
      }
    }

    .chat-detail-container {
      width: calc(100% - 320px);
      height: 100%;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;

      .chat-detail-title {
        height: 51px;
        background-color: #f8f8f8;
        line-height: 51px;
        // text-align: center;
        position: relative;
        padding-left: 30px;

        &::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 16px;
          height: 18px;
          width: 4px;
          background-color: #c02235;
        }
      }

      .chat-detail-content {
        height: calc(100% - 51px);
        padding: 20px;

        .chat-item-date {
          color: #999;
          font-size: 18px;
          margin: 20px 0px 10px;

          &:first-child {
            margin-top: 0;
          }
        }

        .chat-item-container {
          margin-bottom: 10px;

          .chat-item-name {
            color: #0000ff;
            line-height: 24px;
          }

          .chat-item-message {
            color: #333;
            line-height: 21px;
            word-wrap: break-word;
            word-break: break-all;

            ._span {
              font-size: 10px;
              color: #c02235;
            }

            // 图片
            &.file_image {
              width: 130px;
            }
          }

          .center-box {
            display: inline-block;
            padding: 5px 20px;
            color: #000000;
            background: #ebebeb;
            border-radius: 15px;
          }

          // 商品
          .chat-item-product {
            width: 160px;
            background-color: #f5f5f5;
            padding: 8px;
            border-radius: 4px;

            .chat-item-img {
              margin-bottom: 10px;

              img {
                width: 100%;
                height: 100%;
                border-radius: 4px;
                object-fit: scale-down;
              }
            }

            ._tag {
              padding: 0 5px;
              font-size: 10px;
              line-height: 18px;
              margin-right: 5px;
              border-radius: 4px;
              color: white;
              text-align: center;
              background: linear-gradient(180deg, #585858 0%, #373737 100%);
            }

            .text-ellipsis-2 {
              line-height: 18px;
            }
          }

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
        }
      }
    }
  }
</style>
