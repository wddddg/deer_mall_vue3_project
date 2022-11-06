<template>
  <div class="page-container">
    <!-- 头部栏 -->
    <div class="page-header-container">
      <!-- 搜索栏 -->
      <div class="search-container">
        <div class="flex_start_wrap">
          <div class="search-item">
            <a-input type="text" placeholder="店铺名称" v-model:value="searchData.shopName" />
          </div>

          <div class="search-item">
            <a-input type="text" placeholder="客户账号" v-model:value="searchData.buyerName" />
          </div>

          <div class="search-item" style="width: auto">
            <a-range-picker v-model:value="dateRange" :format="dateFormat" />
          </div>

          <div class="flex_start">
            <div class="search-item" style="width: auto" v-if="permissionCodeList.CHAT_RECORD_GET">
              <div class="action-btn red" @click="search()">
                <SearchOutlined />
              </div>
            </div>
            <div class="search-item" style="width: auto" v-if="permissionCodeList.CHAT_RECORD_GET">
              <div class="action-btn" @click="reset()">
                <ReloadOutlined />
              </div>
            </div>
          </div>
          <div style="color: #999; font-size: 14px">
            店铺名称和客户帐号必须填写一个，查询聊天记录间隔不超过30天
          </div>
        </div>
      </div>
    </div>

    <a-spin size="large" delay="500" tip="loading..." :spinning="loading">
      <div class="flex_between-top chat-record-container">
        <!-- 店铺、客户账号列表 -->
        <div class="flex_start_top chat-relationship-container">
          <!-- 店铺列表 -->
          <div class="chat-content-container">
            <div class="chat-content-title">店铺列表</div>
            <div class="chat-content-list scrollbar-item-y">
              <template v-if="searchMode && shopList && shopList.length === 0">
                <div style="color: #b8b8b8; text-align: center; line-height: 56px">
                  暂无相关内容
                </div>
              </template>
              <template v-for="(shopItem, shopIndex) in shopList" :key="shopIndex">
                <div
                  class="content-item"
                  :class="{ selected_shop: selectedShopIndex === shopIndex }"
                  @click="selectShop(shopIndex)"
                >
                  <span class="_value"> {{ shopItem.shopName }}</span>
                </div>
              </template>
            </div>
          </div>

          <!-- 客户账号列表 -->
          <div class="chat-content-container">
            <div class="chat-content-title">客户账号列表</div>
            <div class="chat-content-list scrollbar-item-y">
              <template v-for="(buyerItem, buyerIndex) in buyerList" :key="buyerIndex">
                <div
                  class="content-item"
                  :class="{ selected_buyer: selectedBuyerIndex === buyerIndex }"
                  @click="selectBuyer(buyerIndex)"
                >
                  <span class="_value"> {{ buyerItem.buyerNickName }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 聊天记录详情 -->
        <div class="chat-detail-container">
          <div class="chat-detail-title">聊天记录详情</div>
          <div class="chat-detail-content scrollbar-item-y">
            <template v-if="chatDetailData && chatDetailData.length !== 0">
              <template v-for="chatDetail in chatDetailData" :key="chatDetail.date">
                <div class="chat-item-date">{{ chatDetail?.date }}</div>
                <div
                  class="chat-item-container"
                  v-for="(chatItem, chatDetailIndex) in chatDetail.chatData"
                  :key="chatDetailIndex"
                >
                  <div class="chat-item-name">
                    <span v-if="chatItem.userTypeCode === 'buyer'">
                      {{ chatItem?.buyerNickName }}
                    </span>
                    <span v-if="chatItem.userTypeCode === 'vendor'">
                      {{ chatItem?.shopName }}：{{ chatItem?.vendorNickName }}
                    </span>
                    &nbsp;&nbsp;
                    <span> {{ chatItem?.sendDate }}</span>
                  </div>

                  <!-- 文本/转接消息 -->
                  <template
                    v-if="
                      chatItem.messageTypeCode === 'TXT' ||
                      chatItem.messageTypeCode === 'CHANGE_VENDOR'
                    "
                  >
                    <div
                      class="chat-item-message"
                      :class="{ _red: chatItem.messageTypeCode === 'CHANGE_VENDOR' }"
                    >
                      {{ chatItem?.message }}
                    </div>
                  </template>

                  <!-- 核对订单 -->
                  <template v-if="chatItem.messageTypeCode === 'TRADE'">
                    <div class="chat-item-message">
                      <span>亲，确认下地址哦</span><br />
                      <span>姓名：{{ chatItem?.message?.buyerName }}</span>
                      <br />
                      <span>电话：{{ chatItem?.message?.buyerMobile }}</span>
                      <br />
                      <span>地址：{{ chatItem?.message?.buyerAddress }}</span>
                      <span class="_span">
                        {{ chatItem?.message?.trued ? '(买家已确认)' : '(待确认)' }}
                      </span>
                    </div>
                  </template>

                  <!-- 图片 -->
                  <template v-if="chatItem.messageTypeCode === 'IMAGE'">
                    <div class="chat-item-message file_image">
                      <image-container :imageSrc="chatItem.message" />
                    </div>
                  </template>

                  <!-- 链接：商品/订单商品 -->
                  <template v-if="chatItem.messageTypeCode === 'LINK'">
                    <div
                      class="chat-item-product"
                      :class="[
                        { flex_start: chatItem?.message?.linkType === 'TRADE' },
                        chatItem?.message?.linkType,
                      ]"
                    >
                      <div
                        class="chat-item-img"
                        :style="{
                          width: chatItem?.message?.linkType === 'TRADE' ? '80px' : 'auto',
                        }"
                      >
                        <image-container :imageSrc="chatItem?.message?.productFile?.fileUrl" />
                      </div>

                      <!-- 订单商品 -->
                      <template v-if="chatItem?.message?.linkType === 'TRADE'">
                        <div style="padding-left: 10px">
                          <a-popover :title="''" placement="topLeft" trigger="hover">
                            <div class="text-ellipsis-1">
                              {{ chatItem?.message?.name }}
                            </div>
                            <template #content>
                              <div style="max-width: 400px"> {{ chatItem?.message?.name }}</div>
                            </template>
                          </a-popover>
                          <!-- 订单状态 -->
                          <div style="color: #c02235; padding-top: 6px">
                            {{ chatItem?.message?.status.name }}
                          </div>
                        </div>
                        <div style="font-size: 13px; color: #999; position: absolute; bottom: 4px">
                          订单编号：
                          <span
                            :class="{ 'action-text-hover': permissionCodeList.TRADE_DETAIL_GET }"
                            @click="goDetail(chatItem?.message.tradeId)"
                          >
                            {{ chatItem?.message.tradeId }}
                          </span>
                        </div>
                      </template>
                      <!-- 商品 -->
                      <template v-else>
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
                      </template>
                    </div>
                  </template>

                  <!-- 回复 -->
                  <template v-if="chatItem.messageTypeCode === 'QUOTE'">
                    <div class="chat-item-quote">
                      <div class="_nick_name">{{ chatItem?.message?.quote?.nickName }} </div>
                      <template v-if="chatItem?.message?.quote?.messageTypeCode === 'IMAGE'">
                        <div class="chat-item-message file_image">
                          <image-container :imageSrc="chatItem.message" />
                        </div>
                      </template>
                      <template v-else>
                        <div class="chat-item-message">
                          <span>{{ chatItem?.message?.quote?.message[0][0]?.content }}</span>
                        </div>
                      </template>
                    </div>
                    <div class="chat-item-message">{{ chatItem?.message?.reply }}</div>
                  </template>

                  <!-- 撤回的消息 -->
                  <template v-if="chatItem.messageTypeCode === 'PULL_OUT'">
                    <div class="chat-item-message">
                      {{ chatItem?.message }}
                      <span class="_span">
                        {{
                          chatItem?.userTypeCode === 'vendor'
                            ? '(商家撤回的消息)'
                            : '(消费者撤回的消息)'
                        }}
                      </span>
                    </div>
                  </template>

                  <!-- 撤回消息里包含着回复的消息 -->
                  <template v-if="chatItem.messageTypeCode === 'QUOTE_PULL_OUT'">
                    <div class="chat-item-quote">
                      <div class="_nick_name">{{ chatItem?.message?.quote?.nickName }} </div>
                      <div class="chat-item-message">
                        <span>{{ chatItem?.message?.quote?.message[0][0]?.content }}</span>
                      </div>
                    </div>
                    <div class="chat-item-message">
                      {{ chatItem?.message?.reply }}
                      <span class="_span">
                        {{
                          chatItem?.userTypeCode === 'vendor'
                            ? '(商家撤回的消息)'
                            : '(消费者撤回的消息)'
                        }}
                      </span>
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
  import { onMounted, reactive, ref, toRaw, unref } from 'vue';
  import { message } from 'ant-design-vue';
  import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import * as chatService from './chatRecord.api';
  import * as customerService from '../chat-customer/chatCustomer.api';
  import ImageContainer from '../components/ImageContainer.vue';
  import { checkValueOfEmpty, matchPermissionsCode } from '/@/utils/table';
  import { useUserStore } from '/@/store/modules/user';
  import { useRouter } from 'vue-router';
  import dayjs, { Dayjs } from 'dayjs';

  const store = useUserStore();

  /************************变量定义************************** */

  // 加载状态
  const loading = ref(false);
  // 当前页码
  const pageNum = ref(1);
  // 搜索状态
  const searchMode = ref(false);
  const { currentRoute } = useRouter();
  const { params } = unref(currentRoute);

  const dateFormat = 'YYYY-MM-DD';
  const dateRange = ref<[Dayjs, Dayjs]>([
    dateUtil(new Date().getTime()),
    dateUtil(new Date().getTime()),
  ]);

  const searchData = reactive({
    shopName: '',
    buyerName: '',
    startDate: '',
    endDate: '',
  });

  const shopList = ref([] as any[]);
  const buyerList = ref([] as any[]);
  const chatDetailData = ref([] as any[]);
  const selectedShopIndex = ref(-1);
  const selectedBuyerIndex = ref(-1);

  const permissionCodeList = reactive({
    CHAT_RECORD_GET: false,
    TRADE_DETAIL_GET: false,
  });

  //------------------------------方法-----------------------------

  // 获取列表（查询）
  function getList() {
    let params = {
      // 获取搜索栏参数
      ...checkSearchMode(),
    };
    if (checkValueOfEmpty(searchData.shopName) && checkValueOfEmpty(searchData.buyerName)) {
      message.error('店铺名称和客户账号必须填写一项');
      return;
    }
    if (checkValueOfEmpty(searchData.startDate) && checkValueOfEmpty(searchData.endDate)) {
      message.error('请选择选择操作时间');
      return;
    }
    loading.value = true;
    chatService
      .getChatRecordList(params)
      .then((res) => {
        console.log(res);

        shopList.value = res || [];
        if (shopList.value.length === 0) {
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

  // 查询
  function search() {
    searchMode.value = true;
    pageNum.value = 1;
    shopList.value = [];
    buyerList.value = [];
    chatDetailData.value = [];
    selectedShopIndex.value = -1;
    selectedBuyerIndex.value = -1;
    getList();
  }

  // 重置
  function reset() {
    searchMode.value = false;
    // searchData = { shopName: '', buyerName: '', startDate: undefined, endDate: undefined };
    searchData.shopName = '';
    searchData.buyerName = '';
    searchData.startDate = '';
    searchData.endDate = '';
    dateRange.value.splice(0);

    pageNum.value = 1;
    shopList.value = [];
    buyerList.value = [];
    chatDetailData.value = [];
    selectedShopIndex.value = -1;
    selectedBuyerIndex.value = -1;
  }

  // 检测当前搜索模式,改变查询参数
  function checkSearchMode() {
    console.log('searchMode.value => ', searchMode.value);

    if (searchMode.value) {
      if (dateRange.value && dateRange.value.length == 2) {
        searchData.startDate = dateRange.value[0].format('YYYY-MM-DD 00:00:00');
        searchData.endDate = dateRange.value[1].format('YYYY-MM-DD 23:59:59');
      } else {
        searchData.startDate = '';
        searchData.endDate = '';
      }

      return toRaw(searchData);
    }

    // 不是搜索模式下，参数传空
    return { shopName: '', buyerName: '', startDate: '', endDate: '' };
  }

  function selectShop(index) {
    selectedShopIndex.value = index;
    buyerList.value = shopList.value[index].buyers;
  }

  function selectBuyer(index) {
    selectedBuyerIndex.value = index;
    const shopData = shopList.value[selectedShopIndex.value];
    const buyerData = shopData.buyers[selectedBuyerIndex.value];
    let listData = {
      shopId: shopData.shopId,
      buyerId: buyerData.buyerId,
    };
    getChatRecordDetail(listData);
  }

  function getChatRecordDetail(listData) {
    loading.value = true;
    let params = {
      limit: 10000,
      shopId: listData.shopId,
      buyerId: listData.buyerId,
      startDate: searchData.startDate,
      endDate: searchData.endDate,
      sendDate: null,
    };
    chatService
      .getChatRecordDetail(params)
      .then(async (res) => {
        console.log(res);

        let chatData = [] as any[];
        let nowDate = '';
        if (res.chatRecords && res.chatRecords.length !== 0) {
          // 倒序
          res.chatRecords = res.chatRecords.reverse();

          for (let idx = 0; idx < res.chatRecords.length; idx++) {
            const chatItem = res.chatRecords[idx];
            // 时间格式化
            if (
              chatData.length !== 0 &&
              nowDate === dateUtil(chatItem.sendDate).format('YYYY-MM-DD')
            ) {
              // console.log(chatItem.sendDate);
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

            // 其他类型处理
            switch (chatItem.messageTypeCode) {
              case 'TXT':
                chatItem.message = chatItem.message;
                break;
              case 'IMAGE':
                chatItem.message = chatItem.message;
                break;
              // 在线客服转接
              case 'CHANGE_VENDOR':
                let message = JSON.parse(chatItem.message);
                // 获取转接客服姓名
                if (message.newVendorId) {
                  let newVendorData = await customerService.getNicknameByShopIdAndVendorId({
                    shopId: message.shopId,
                    vendorId: message.newVendorId,
                  });
                  if (message.oldVendorId) {
                    let oldVendorData = await customerService.getNicknameByShopIdAndVendorId({
                      shopId: message.shopId,
                      vendorId: message.oldVendorId,
                    });
                    if (newVendorData && oldVendorData) {
                      chatItem.message = `由 ${oldVendorData.nickName} 转接给 ${newVendorData.nickName}`;
                    }
                  } else {
                    chatItem.message = `系统提醒：客服 ${message.shopName}：${newVendorData.nickName} 将为您服务`;
                  }
                } else {
                  chatItem.message = '系统提醒：转接信息异常'; // API异常
                }
                break;
              default:
                chatItem.message = JSON.parse(chatItem.message);
                break;
            }
          }
        }

        // console.log(chatData);
        chatDetailData.value = chatData;
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
        message.error('数据加载失败！请刷新');
      });
  }

  // 跳转到详情
  function goDetail(id) {
    let url = '';
    if (permissionCodeList.TRADE_DETAIL_GET && id) {
      url = `${window.location.origin}#/order/trades/tradesListDetail/${id}`;
    }

    url && window.open(url);
  }

  onMounted(() => {
    // 初始化权限
    matchPermissionsCode(permissionCodeList, store.getUserInfo.permissions);

    if (params.path == 'record') {
      const urlData = store.getSearchChatRecordData;
      if (urlData && urlData.shopName) {
        let createdDate = dayjs(urlData.createdDate);
        dateRange.value[0] = createdDate;
        dateRange.value[1] = createdDate.add(1, 'days');

        searchMode.value = true;
        searchData.shopName = urlData.shopName;
        searchData.buyerName = urlData.buyerNickName;
        searchData.startDate = dateRange.value[0].format('YYYY-MM-DD 00:00:00');
        searchData.endDate = dateRange.value[1].format('YYYY-MM-DD 23:59:59');

        shopList.value.push({ shopName: urlData.shopName, shopId: urlData.shopId });
        buyerList.value.push({ buyerNickName: urlData.buyerNickName, buyerId: urlData.buyerId });
        selectedShopIndex.value = 0;
        selectedBuyerIndex.value = 0;

        getChatRecordDetail(urlData);

        // 清除缓存
        store.setSearchChatRecordData(null);
      }
    }
  });
</script>

<style lang="less" scoped>
  @import '../style.less';

  .chat-record-container {
    // width: 100%;
    // height: 100%;
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
          // height: calc(100% - 51px);
          // height: calc(100vh - 48px - 20px - 55px - 51px - 20px);
          height: calc(100vh - 194px);

          .content-item {
            line-height: 21px;
            padding: 10px 6px 10px 12px;
            vertical-align: middle;
            border-bottom: 1px solid #f2f2f2;

            &.selected_shop {
              background: #1a97e1;
              color: #fff;
            }

            &.selected_buyer {
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
      // height: 100%;
      // height: calc(100vh - 48px - 20px - 55px - 20px);
      height: calc(100vh - 143px);
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

            ._span {
              font-size: 10px;
              color: #c02235;
            }

            // 图片
            &.file_image {
              width: 130px;
            }

            // 转接消息
            &._red {
              color: #c02235;
            }
          }

          // 商品
          .chat-item-product {
            width: 160px;
            background-color: #f5f5f5;
            padding: 8px;
            border-radius: 4px;
            position: relative;

            &.TRADE {
              width: 330px;
              padding-bottom: 20px;
            }

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

  //  两行文本超出
  .text-ellipsis-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .text-ellipsis-1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
</style>
