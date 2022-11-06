<template>
  <div class="p-4">
    <!-- <GrowCard :loading="loading" class="enter-y" /> -->
    <div class="md:flex enter-y page-todolist-content">
      <div class="md:w-1/4 w-full !md:mt-0">
        <Card size="small" :loading="loading" :border="false" @click="goOperatorList">
          <div class="top-num organization">
            <div class="flex1">
              <div class="icon-box flex_center"><idcard-outlined /> </div>
              <span>待审核经营主体</span>
            </div>
            <div class="number-text">{{ pageOrganizationsTotal }}</div>
          </div>
        </Card>
      </div>
      <div class="md:w-1/4 w-full !md:mt-0">
        <Card size="small" :loading="loading" :border="false" @click="goMerchantApply('1')">
          <div class="top-num wxmerchants">
            <div class="flex1">
              <div class="icon-box flex_center"><edit-outlined /> </div>
              <span>待签约微信商户</span>
            </div>
            <div class="number-text">{{ wxPayApplymentTotalCount }}</div>
          </div>
        </Card>
      </div>
      <div class="md:w-1/4 w-full !md:mt-0">
        <Card size="small" :loading="loading" :border="false" @click="goMerchantApply('2')">
          <div class="top-num need_verify">
            <div class="flex1">
              <div class="icon-box flex_center"><edit-outlined /> </div>
              <span>待验证微信商户</span>
            </div>
            <div class="number-text">{{ pageWxPayApplymentTotal }}</div>
          </div>
        </Card>
      </div>
      <div class="md:w-1/4 w-full !md:mt-0" @click="goToRouter('1')">
        <Card size="small" :loading="loading" :border="false">
          <div class="top-num unread">
            <div class="flex1">
              <div class="icon-box flex_center"><message-outlined /> </div>
              <span>客服未读消息</span>
              <a-tooltip placement="topLeft">
                <template #title>
                  <span>平台客服未接待消费者/商家发出的消息记录数量</span>
                </template>
                <span class="help-box"><question-circle-outlined /></span>
              </a-tooltip>
            </div>
            <div class="number-text" v-if="vendorTotal != 0 || buyerTotal != 0">{{
              Number(vendorTotal) + Number(buyerTotal)
            }}</div>
            <div class="number-text" v-else>0</div>
          </div>
        </Card>
      </div>
      <div class="md:w-1/4 w-full !md:mt-0" @click="goToRouter1">
        <Card size="small" :loading="loading" :border="false">
          <div class="top-num mt0 vendor_noreply">
            <div class="flex1">
              <div class="icon-box flex_center"><message-outlined /> </div>
              <span>商家未复消息</span>
              <a-tooltip placement="topLeft">
                <template #title>
                  <span>消费者发送消息后3分钟内商家仍未回复消息的记录数量</span>
                </template>
                <span class="help-box"><question-circle-outlined /></span>
              </a-tooltip>
            </div>
            <div class="number-text">{{ pageVendorNotReplyTotal }}</div>
          </div>
        </Card>
      </div>
    </div>
    <div class="md:flex enter-y mt20 bcot">
      <div class="w-full">
        <Card :loading="loading">
          <div class="top-tit">
            <div class="title-name">待审核经营主体</div>
            <div class="more" @click="goOperatorList" v-if="hasPermission('ORGANIZATION_GET')"
              >查看全部
              <right-outlined />
            </div>
          </div>
          <div class="tables">
            <a-table
              :dataSource="lineMultiData"
              :columns="columns"
              :loading="loading"
              :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'organizationCompanyName'">
                  <span @click="hasPermission('ORGANIZATION_GET')? review(record) : ''" :class="hasPermission('ORGANIZATION_GET')?' hover' : 'no-drop' ">
                    {{ record.organizationCompanyName }}
                  </span>
                </template>
                <template v-if="column.key === 'type'">
                  <span>
                    {{ record.type.name }}
                  </span>
                </template>
                <template v-if="column.key === 'reviewStatus'">
                  <span>
                    <a-tag color="#3582fb">
                      {{ record.reviewStatus.name }}
                    </a-tag>
                  </span>
                </template>
              </template>
            </a-table>
            <div class="pagination">
              <span>共{{ pageOrganizationsTotal }}条数据</span>
              <a-pagination
                v-if="pageOrganizationsTotal != 0"
                v-model:current="pageOrganizationsNum"
                simple
                :defaultPageSize="5"
                :total="pageOrganizationsTotal"
                @change="handlePageChange"
              />
            </div>
          </div>
        </Card>
      </div>
      <div class="w-full ml20">
        <Card :loading="loading">
          <div class="top-tit">
            <div class="title-name">待签约/验证微信商户</div>
            <div class="tabs felx">
              <div class="tab-tiem" :class="{ _active: activeTab == 1 }" @click="changeTab(1)">
                待签约
              </div>
              <div class="tab-tiem" :class="{ _active: activeTab == 2 }" @click="changeTab(2)">
                待账户验证
              </div>
            </div>
            <div class="more" @click="goMerchantApply(activeTab)" v-if="hasPermission('SHOP_APPLYMENT_GET')"
              >查看全部
              <right-outlined />
            </div>
          </div>
          <div class="tables">
            <a-table
              :dataSource="bossList"
              :columns="bossColumns"
              v-if="activeTab == 1"
              :loading="loading"
              :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'name'">
                  <span @click="hasPermission('ORGANIZATION_GET')?goShopDetail(record):''" :class="hasPermission('ORGANIZATION_GET')?' hover' : 'no-drop' ">
                    {{ record.name }}
                  </span>
                </template>
                <template v-if="column.key === 'wxPayApplymentId'">
                  <span @click="hasPermission('ORGANIZATION_GET')?pdfAction('review', record.wxReviewDocUrl):''" :class="hasPermission('ORGANIZATION_GET')?' hover' : 'no-drop' ">
                    {{ record.wxPayApplymentId }}
                  </span>
                </template>
                <template v-if="column.key === 'organizationType'">
                  <span>
                    {{ record.organizationType.name }}
                  </span>
                </template>
              </template>
            </a-table>
            <div class="pagination" v-if="activeTab == 1">
              <span>共{{ wxPayApplymentTotalCount }}条数据</span>
              <a-pagination
                v-if="wxPayApplymentTotalCount != 0"
                v-model:current="pageWxPayApplymentNum"
                simple
                :defaultPageSize="5"
                :total="wxPayApplymentTotalCount"
                @change="handlePageChange1"
              />
            </div>
            <a-table
              :dataSource="bossWList"
              :columns="bossColumns"
              v-if="activeTab == 2"
              :loading="loading"
              :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'organizationType'">
                  <span>
                    {{ record.organizationType.name }}
                  </span>
                </template>
              </template>
            </a-table>
            <div class="pagination" v-if="activeTab == 2">
              <span>共{{ pageWxPayApplymentTotal }}条数据</span>
              <a-pagination
                v-if="pageWxPayApplymentTotal != 0"
                v-model:current="pageWxPayApplymentNum"
                simple
                :defaultPageSize="5"
                :total="pageWxPayApplymentTotal"
                @change="handlePageChange1"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
    <div class="md:flex enter-y mt20 bcot">
      <div class="w-full">
        <Card :loading="loading">
          <div class="top-tit _border">
            <div class="title-name">平台客服未读消息</div>
            <div class="tabs felx">
              <div class="tab-tiem" :class="{ _active: activeTab1 == 1 }" @click="changeTab1(1)">
                商家
              </div>
              <div class="tab-tiem" :class="{ _active: activeTab1 == 2 }" @click="changeTab1(2)">
                消费者
              </div>
            </div>
          </div>
          <div class="tables shoetanl1">
            <a-table
              class="shoetanl"
              :dataSource="vendorList"
              :columns="vendorColumns"
              :loading="loading"
              :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'message'">
                  <div :class="hasPermission('MAMA_CHAT')? 'inserted' : 'no-drop' " @click="hasPermission('MAMA_CHAT')?goToRouter(activeTab1 == 1 ? '2' : '1', record):''">
                    <a-tag class="cold" color="#e6e6e6">
                      {{ record.shopName || record.userNickName }}
                    </a-tag>
                    {{ record.message }}
                  </div>
                </template>
                <template v-if="column.key === 'messageDate'">
                  <span style="color: #999">{{ record.messageDate }}</span>
                </template>
              </template>
            </a-table>
            <div class="pagination" v-if="activeTab1 == 1">
              <span>共{{ vendorTotal }}条数据</span>
              <a-pagination
                v-if="vendorTotal != 0"
                v-model:current="pageCustomerNum"
                simple
                :defaultPageSize="5"
                :total="vendorTotal"
                @change="handlePageChange1"
              />
            </div>
            <div class="pagination" v-if="activeTab1 == 2">
              <span>共{{ buyerTotal }}条数据</span>
              <a-pagination
                v-if="buyerTotal != 0"
                v-model:current="pageCustomerNum"
                simple
                :defaultPageSize="5"
                :total="buyerTotal"
                @change="handlePageChange1"
              />
            </div>
          </div>
        </Card>
      </div>
      <div class="w-full ml20">
        <Card :loading="loading">
          <div class="top-tit _border">
            <div class="title-name">商家未复消息</div>
          </div>
          <div class="tables shoetanl1">
            <a-table
              class="shoetanl"
              :dataSource="shopList"
              :columns="shopColumns"
              :loading="loading"
              :pagination="paginationProp"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'message'">
                  <div :class="hasPermission('CHAT_GET')? 'inserted' : 'no-drop'" @click="hasPermission('CHAT_GET')?goToMerchantRouter(record):''">
                    <a-tag class="cold" color="rgba(192,34,53,.15)">
                      用户{{ record.buyerNickName }}
                    </a-tag>
                    发送给
                    <a-tag class="cold" color="#e6e6e6">
                      {{ record.shopName }}
                    </a-tag>
                    {{ record.message }}
                  </div>
                </template>
                <template v-if="column.key === 'messageDate'">
                  <span style="color: #999">{{ record.messageDate }}</span>
                </template>
              </template>
            </a-table>
            <div class="pagination pagination1">
              <span>共{{ pageVendorNotReplyTotal }}条数据</span>
              <!-- <a-pagination
                v-if="pageVendorNotReplyTotal != 0"
                v-model:current="pageVendorNotReplyNum"
                simple
                :defaultPageSize="5"
                :total="pageVendorNotReplyTotal"
                @change="handlePageChange2"
              /> -->
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { Card, message } from 'ant-design-vue';
  import {
    RightOutlined,
    QuestionCircleOutlined,
    EditOutlined,
    MessageOutlined,
    IdcardOutlined,
  } from '@ant-design/icons-vue';
  import { OssUtils } from '/@/utils/ossUtils';
  import { getShopList, visitInfo, listByVendorNotReply, getChats } from './api';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { useRouter } from 'vue-router';
  import { useGo } from '/@/hooks/web/usePage';
  import { useUserStore } from '/@/store/modules/user';
  import { usePermission } from '/@/hooks/web/usePermission';
  const userStore = useUserStore();
  const go = useGo();
  const router = useRouter();
  const { hasPermission } = usePermission();

  const loading = ref(true);
  const activeTab = ref(1);
  const activeTab1 = ref(1);

  // 待审核经营主体
  const pageOrganizationsNum = ref(1); // 当前页码
  const pageOrganizationsTotal = ref(0);
  const columns = ref([
    {
      title: '企业名称',
      dataIndex: 'organizationCompanyName',
      key: 'organizationCompanyName',
      ellipsis: true,
    },
    {
      title: '经营主体',
      dataIndex: 'type',
      key: 'type',
      ellipsis: true,
    },
    {
      title: '负责人姓名',
      dataIndex: 'vendorName',
      key: 'vendorName',
      ellipsis: true,
    },
    {
      title: '经营主体状态',
      dataIndex: 'reviewStatus',
      key: 'reviewStatus',
      ellipsis: true,
    },
    {
      title: '认证提交时间',
      dataIndex: 'reviewSubmittedDate',
      key: 'reviewSubmittedDate',
      ellipsis: true,
    },
  ]);
  const lineMultiData = ref([]);
  const handlePageChange = (page: number) => {
    pageOrganizationsNum.value = page;
    getList();
  };
  const goOperatorList = () => {
    if(!hasPermission("ORGANIZATION_GET")){
      return message.error('没有相关权限，请联系管理员')
    }
    router.push({ path: '/merchant/basic/operatorList', query: { origin: 1 } });
  };
  const goMerchantApply = (type) => {
    if(!hasPermission("SHOP_APPLYMENT_GET")){
      return message.error('没有相关权限，请联系管理员')
    }
    router.push({ path: '/merchant/basic/merchantApply', query: { origin: type } });
  };
  // 点击企业名称-审核操作
  const review = (record) => {
    router.push({
      path: '/merchant/basic/operatorDetail/' + record.id,
      query: { type: 'review' },
    });
  };
  // 跳转
  const goToRouter = (type, record) => {
    if(!hasPermission("MAMA_CHAT")){
      return message.error('没有相关权限，请联系管理员')
    }
    router.push({
      path: '/chat/platform/chatCustomer',
      query: { type: type == '1' ? 'buyer' : 'vendor', data: JSON.stringify(record) },
    });
  };
  // 商家未回复跳转
  const goToRouter1 = () => {
    if(!hasPermission("CHAT_GET")){
      return message.error('没有相关权限，请联系管理员')
    }
    let date = new Date();
    let year = date.getFullYear(); //  返回的是年份
    let month = date.getMonth() + 1; //  返回的月份上个月的月份，记得+1才是当月
    let dates = date.getDate(); //  返回的是几号
    router.push({
      path: `/chat/basic/chatRecord/${'record'}`,
      query: {
        startDate: `${year}-${month}-${dates}`,
        endDate: `${year}-${month}-${dates}`,
      },
    });
    // go(`/chat/basic/chatRecord/${'record'}`);
  };

  const goToMerchantRouter = (record) => {
    console.log(record, 222);
    const listData = {
      shopId: record.shopId,
      buyerId: record.buyerId,
      shopName: record.shopName,
      buyerNickName: record.buyerNickName,
      createdDate: record.messageDate,
    };
    userStore.setSearchChatRecordData(listData);
    go(`/chat/basic/chatRecord/${'record'}`);
    // router.push({
    //   path: '/chat/basic/chatRecord',
    //   query: {
    //     // ...record,
    //     shopName: record.shopName,
    //     startDate: record.messageDate,
    //     endDate: record.messageDate,
    //     buyerName: record.buyerNickName,
    //   },
    // });
  };

  // 待签约/验证微信商户
  const pageWxPayApplymentNum = ref(1);
  const wxPayApplymentTotalCount = ref(0); // 待签约
  const pageWxPayApplymentTotal = ref(0); // 验证微信商户
  const bossColumns = ref([
    {
      title: '店铺名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '微信申请编号',
      dataIndex: 'wxPayApplymentId',
      key: 'wxPayApplymentId',
      ellipsis: true,
    },
    {
      title: '用户类型',
      dataIndex: 'organizationType',
      key: 'organizationType',
      ellipsis: true,
    },
    {
      title: '微信商户号',
      dataIndex: 'wxPaySubMchId',
      key: 'wxPaySubMchId',
      ellipsis: true,
    },
    {
      title: '申请时间',
      dataIndex: 'wxPayApplymentSubmittedDate',
      key: 'wxPayApplymentSubmittedDate',
      ellipsis: true,
    },
  ]);
  const bossList = ref([]);
  const bossWList = ref([]);
  const handlePageChange1 = (page: number) => {
    pageWxPayApplymentNum.value = page;
    initLogInfo();
  };
  // 店铺名称点击 - 店铺详情
  const goShopDetail = (record) => {
    router.push({ path: '/merchant/basic/shopDetail/' + record.id });
  };
  // PDF
  const ossUtils = new OssUtils();
  function pdfAction(action, url) {
    ossUtils.pdfAction(action, url);
  }

  // 平台客服未读消息
  const pageCustomerNum = ref(1);
  const buyerTotal = ref(0);
  const vendorTotal = ref(0);
  const vendorList = ref([]);
  const vendorColumns = ref([
    {
      title: '企业名称',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: '经营主体',
      dataIndex: 'messageDate',
      key: 'messageDate',
      width: 190,
      align: 'right',
    },
  ]);

  // 商家未复消息
  const pageVendorNotReplyTotal = ref(0);
  const pageVendorNotReplyNum = ref(1);
  const shopColumns = ref([
    {
      title: '企业名称',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: '经营主体',
      dataIndex: 'messageDate',
      key: 'messageDate',
      width: 190,
      align: 'right',
    },
  ]);

  const shopList = ref([]);

  //tab切换
  function changeTab(key: number) {
    activeTab.value = key;
    pageWxPayApplymentNum.value = 1;
    initLogInfo();
  }

  function changeTab1(key: number) {
    activeTab1.value = key;
    getChatsList();
  }

  const handlePageChange2 = (page: number) => {
    pageVendorNotReplyNum.value = page;
  };

  const paginationProp = ref({
    simple: true,
    pageSize: 5,
    current: pageVendorNotReplyNum.value,
    total: pageVendorNotReplyTotal.value,
    onChange: handlePageChange2,
  });
  watch(pageVendorNotReplyNum, (page) => {
    paginationProp.value.current = page;
  });

  //待签约
  function initLogInfo() {
    // let statusList = [
    //   { code: 'NEED_SIGN', name: '待签约' },
    //   { code: 'ACCOUNT_NEED_VERIFY', name: '待账户验证' },
    // ];

    visitInfo({
      limit: 5,
      offset: pageWxPayApplymentNum.value - 1,
      wxPayApplymentStatusCode: activeTab.value == 1 ? 'NEED_SIGN' : 'ACCOUNT_NEED_VERIFY',
    }).then((res) => {
      res.shops &&
        res.shops.length > 0 &&
        res.shops.map((it) => {
          it.wxPayApplymentSubmittedDate = formatToDateTime(it.wxPayApplymentSubmittedDate);
          return it;
        });
      if (activeTab.value == 1) {
        bossList.value = res.shops;
        wxPayApplymentTotalCount.value = res.totalCount;
      } else {
        bossWList.value = res.shops;
        pageWxPayApplymentTotal.value = res.totalCount;
      }
    });
  }

  // 待审核经营主体
  const getList = () => {
    getShopList({ limit: 5, offset: pageOrganizationsNum.value - 1 }).then((res) => {
      res.organizations &&
        res.organizations.length > 0 &&
        res.organizations.map((it) => {
          it.reviewSubmittedDate = formatToDateTime(it.reviewSubmittedDate);
          return it;
        });
      lineMultiData.value = res.organizations;
      pageOrganizationsTotal.value = res.totalCount;
      loading.value = false;
    });
  };

  //商家未复消息
  function initInfo() {
    listByVendorNotReply({ limit: 5, offset: 0 }).then(async (data) => {
      data &&
        data.length > 0 &&
        data.map((it) => {
          it.messageDate = formatToDateTime(it.messageDate);
          return it;
        });
      shopList.value = await initChatMessage(data);
      pageVendorNotReplyTotal.value = Number(data.length);
    });
  }

  // 平台客服未读消息
  const getChatsList = () => {
    getChats({ userTypeCode: activeTab1.value == 2 ? 'buyer' : 'vendor' }).then(async (res) => {
      res.mamaChats &&
        res.mamaChats.length > 0 &&
        res.mamaChats.map((it) => {
          it.messageDate = formatToDateTime(it.messageDate);
          return it;
        });
      if (activeTab1.value == 2) {
        buyerTotal.value = Number(res.mamaChats.length) || res.notReadTotalCount; //消费者
      } else {
        vendorTotal.value = Number(res.mamaChats.length) || res.notReadTotalCount; //商家
      }
      vendorList.value = await initChatMessage(res.mamaChats);
      // vendorList.value = res.mamaChats;
      console.log(vendorList.value);
    });
  };
  const getChatsList1 = () => {
    getChats({ userTypeCode: 'buyer' }).then((res) => {
      res.mamaChats &&
        res.mamaChats.length > 0 &&
        res.mamaChats.map((it) => {
          it.messageDate = formatToDateTime(it.messageDate);
          return it;
        });
      buyerTotal.value = Number(res.mamaChats.length) || res.notReadTotalCount; //消费者
    });

    visitInfo({
      limit: 5,
      offset: pageWxPayApplymentNum.value - 1,
      wxPayApplymentStatusCode: 'ACCOUNT_NEED_VERIFY',
    }).then((res) => {
      res.shops &&
        res.shops.length > 0 &&
        res.shops.map((it) => {
          it.wxPayApplymentSubmittedDate = formatToDateTime(it.wxPayApplymentSubmittedDate);
          return it;
        });
      bossWList.value = res.shops;
      pageWxPayApplymentTotal.value = res.totalCount;
    });
  };
  /**
   * 根绝信息格式初始化信息结构
   * @param initData 需要处理的信息数组
   * @param action 正在执行的操作，根据操作进行一些特殊处理
   */
  const initChatMessage = (initData) => {
    if (!initData || (initData && initData.length === 0)) {
      return []; // 空或数组为空,退出处理
    }
    initData.forEach(async (item) => {
      switch (item.messageTypeCode) {
        case 'TXT':
          // item.message = JSON.parse(item.message);
          break;
        case 'EMOJI_MAMA':
          item.message = '[表情符号]';
          break;
        case 'IMAGE':
          item.message = '[图片]';
          break;
        // 在线客服转接
        case 'CHANGE_MAMA':
          item.message = '[系统消息]';
          break;
        case 'LINK':
          item.message = '[链接]';
          break;
        case 'TRADE':
          item.message = '[亲，请您核对订单信息]';
          break;
        case 'CLOSE_SESSION': // 关闭会话
          item.message = '系统提示：会话已结束';
          break;
      }
    });
    return initData;
  };
  getList();
  initInfo();
  initLogInfo();
  getChatsList();
  getChatsList1();
</script>
<style lang="less" scoped>
  .hover {
    &:hover {
      color: #007bff;
      cursor: pointer;
    }
  }
  .inserted {
    cursor: pointer;
  }
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #999;
    font-size: 14px;
    padding: 20px 30px;
    min-height: 44px;
  }
  .flex1 {
    display: flex;
    align-items: center;
  }
  .flex_center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .page-todolist-content {
    width: 100%;
    background: #fff;
    padding: 13px 10px;
    border-radius: 2px;
  }
  .top-num {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    height: 100px;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.65);
    background: #f3f4f7;
    border-radius: 2px;
    margin-right: 10px;
    padding-left: 25px;
    padding-right: 26px;
    // 鼠标移至样式
    &:hover {
      color: #fff !important;
      cursor: pointer;

      .icon-box {
        color: #fff !important;
      }
    }

    &.organization:hover {
      background: #ff6634 !important;

      .icon-box {
        background: #e54b17 !important;
      }
    }

    &.wxmerchants:hover {
      background: #8833ff !important;

      .icon-box {
        background: #7919ff !important;
      }
    }

    &.need_verify:hover {
      background: #ffa200 !important;

      .icon-box {
        background: #f68d03 !important;
      }
    }

    &.unread:hover {
      background: #33beff !important;

      .icon-box {
        background: #17a5e7 !important;
      }

      .help-box {
        color: #98dfff;
      }
    }

    &.vendor_noreply:hover {
      background: #2acc39 !important;

      .icon-box {
        background: #25b733 !important;
      }

      .help-box {
        color: #94e69c;
      }
    }

    .icon-box {
      width: 40px;
      height: 40px;
      color: #b7bcc6;
      background: #ffffff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.03);
      border-radius: 50%;
      margin-right: 15px;
      flex-shrink: 0;
    }

    .help-box {
      padding-left: 6px;
      color: #d1d1d1;
    }
  }
  .mt0 {
    margin-right: 0;
  }
  .number-text {
    font-size: 46px;
    font-weight: 600;
  }
  :deep(.ant-card-body) {
    padding: 0 !important;
    border-radius: 8px !important;
  }
  :deep(.ant-tag) {
    font-size: 14px;
    padding: 0 6px;
    border-radius: 2px;
  }
  :deep(.ant-table-wrapper) {
    min-height: 330px;
  }

  :deep(.shoetanl1 .ant-table-wrapper) {
    min-height: 275px;
  }
  .bcot :deep(.ant-card) {
    border-radius: 4px !important;
    min-height: 364px;
  }
  :deep(.ant-table) {
    min-height: 240px !important;
  }
  .cold {
    color: #4f4f4f !important;
  }

  .felx {
    display: flex;
    align-items: center;
  }

  .mt20 {
    margin-top: 10px;
  }

  .ml20 {
    margin-left: 10px;
  }

  .top-tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 16px 35px;
    height: 60px;
  }
  ._border {
    border-bottom: 1px solid #f2f2f2;
  }
  .more {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #007bff !important;
  }

  .title-name {
    font-size: 18px;
  }

  .tabs {
    .tab-tiem {
      padding: 6px 15px;
      line-height: 17px;
      color: #000;
      background: rgba(0, 123, 255, 0);
      border: 1px solid #d9d9d9;
      cursor: pointer;

      &:first-child {
        border-radius: 2px 0 0 2px;
      }

      &:last-child {
        border-radius: 0 2px 2px 0;
      }
    }

    &:last-child ._active {
      border-left: 1px solid #007bff;
    }

    ._active {
      color: #007bff;
      border: 1px solid #007bff;
    }
  }

  .table {
    width: 100%;

    .t-tit {
      display: flex;
      align-items: center;
      width: 100%;
      background: #f8f8f8;
      padding: 10px 0;

      > div {
        width: 25%;
        display: flex;
        align-items: center;
        justify-content: center;

        &:nth-child(1) {
          width: 10%;
        }

        &:nth-child(3) {
          width: 40%;
        }
      }
    }

    .bot-item {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f2f2f2;

      // &:nth-child(2n) {
      //   background: #f7f8f8;
      // }

      > div {
        width: 25%;
        display: flex;
        align-items: center;
        justify-content: center;
        // color: #7c8db5;

        &:nth-child(1) {
          width: 10%;
        }

        &:nth-child(3) {
          width: 40%;
          padding-left: 10px;
        }

        &:nth-child(4) {
        }
      }

      .wtip {
        height: 25px;
        line-height: 25px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
      }
    }
  }

  .tables {
    min-height: 340px;
    position: relative;
  }
  .pagination1 {
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .shoetanl :deep(.ant-table-thead) {
    display: none !important;
  }
  .shoetanl :deep(.ant-table-placeholder) {
    display: none !important;
  }
  :deep(.ant-table-pagination) {
    padding-right: 30px;
  }
  .no-drop{
    &:hover{
      cursor: no-drop;
    }
  }
</style>
