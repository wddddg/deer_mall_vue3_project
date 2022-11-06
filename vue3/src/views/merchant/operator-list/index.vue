<template>
  <BasicTable @register="registerTable">
    <template #headerTop>
      <a-tabs @change="tabChange" :activeKey="activeKey">
        <a-tab-pane tab="全部" key="all" forceRender />
        <a-tab-pane tab="待提交" key="ORG_REVIEW_STATUS_WAIT_SUBMIT" />
        <a-tab-pane tab="待审核" key="ORG_REVIEW_STATUS_WAIT_REVIEW" />
        <a-tab-pane tab="审核通过" key="ORG_REVIEW_STATUS_APPROVED" />
        <a-tab-pane tab="审核驳回" key="ORG_REVIEW_STATUS_REJECTED" />
      </a-tabs>
    </template>
    <template #organizationCompanyName="{ record }">
      <div :class=" hasPermission('ORGANIZATION_GET')? 'link' : 'no-drop'" @click="hasPermission('ORGANIZATION_GET')? goOrganizationDetail(record) : ''" >{{
        record.organizationCompanyName ? record.organizationCompanyName : '-'
      }}</div>
    </template>
    <template #reviewStatus="{ record }">
      <a-tag :color="getStatusClass(record.reviewStatus?.code)">{{
        record.reviewStatus?.name
      }}</a-tag>
    </template>
    <template #action="{ record }">
      <a-dropdown>
        <a class="ant-dropdown-link">更多 <Icon icon="ant-design:down-outlined" /> </a>
        <template #overlay>
          <a-menu class="antd-more">
            <a-menu-item
              v-if="
                record.reviewStatusCode &&
                record.reviewStatusCode === 'ORG_REVIEW_STATUS_WAIT_REVIEW' &&
                hasPermission('ORGANIZATION_REVIEW')
              "
            >
              <a @click="review(record)">审核</a>
            </a-menu-item>
            <a-menu-item v-if="hasPermission('ORGANIZATION_REVIEW_RECORD_GET')">
              <a @click="openHistory(record)">操作记录</a>
            </a-menu-item>
            <a-menu-item v-if="hasPermission('ORGANIZATION_SHOP_GET')">
              <a @click="openStore(record)">关联店铺</a>
            </a-menu-item>
            <a-menu-item
              v-if="
                record.reviewStatusCode === 'ORG_REVIEW_STATUS_APPROVED' &&
                record.statusCode !== 'ORG_STATUS_NOT_VALID' &&
                hasPermission('ORGANIZATION_ENABLED')
              "
            >
              <a @click="openPause(record)">暂停经营</a>
            </a-menu-item>
            <a-menu-item
              v-if="
                record.statusCode === 'ORG_STATUS_NOT_VALID' &&
                hasPermission('ORGANIZATION_ENABLED')
              "
            >
              <a @click="openRestart(record)">重启经营</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </BasicTable>
  <Modal @register="historyModalRegister" />
  <StoreModal @register="storeModalRegister" />
  <BasicModal
    centered
    :destroyOnClose="true"
    :maskClosable="false"
    :useWrapper="false"
    @register="registerPauseModal"
    title="暂停经营"
    @ok="handlePause(pause.id, 'ORG_STATUS_NOT_VALID')"
  >
    <div style="font-size: 14px; margin: 12px 0">暂停经营原因说明：</div>
    <a-textarea style="height: 80px" v-model:value="pause.pauseText" />
  </BasicModal>
  <BasicModal
    centered
    :destroyOnClose="true"
    :maskClosable="false"
    :useWrapper="false"
    @register="registerRestartModal"
    title="主体重启经营"
    @ok="handleRestart(pause.id, 'ORG_STATUS_NORMAL')"
    :bodyStyle="{ height: '100px' }"
  >
    <div style="font-size: 16px">确认后，该经营主体下所有店铺将会重新启用， </div>
    <div style="font-size: 16px">你确定重启吗？</div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { getBasicColumns, getFormConfig } from './operatorList.data';
  import { getStoreColumns } from './component/modal.data';
  import { operatorList, operationInfo, updateOperationInfo } from './operatorList.api';
  import { historyList, storeList } from './component/modal.api';

  import Modal from './component/Modal.vue';
  import StoreModal from './component/StoreModal.vue';
  import Icon from '/@/components/Icon';
  import { message } from 'ant-design-vue';
  import { getStatusClass } from '../merchant-apply/merchantApply.data';
  import { useRoute, useRouter } from 'vue-router';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { dateUtil } from '/@/utils/dateUtil';
  const { hasPermission } = usePermission();
  const go = useGo();
  const route = useRoute();
  const router = useRouter();

  let activeKey = ref('all');
  let pause = ref({
    pauseText: '',
    id: '',
  });
  onMounted(() => {
    if (route?.query?.origin) {
      activeKey.value = 'ORG_REVIEW_STATUS_WAIT_REVIEW';
    }
  });
  // 审核操作
  const review = (record) => {
    router.push({
      path: '/merchant/basic/operatorDetail/' + record.id,
      query: { type: 'review' },
    });
  };

  // 重启经营操作
  const [registerRestartModal, { openModal: openRestartModal, closeModal: closeRestartModal }] =
    useModal();
  const openRestart = (record) => {
    pause.value.id = record.id;
    openRestartModal(true);
  };
  const handleRestart = (id, statusCode) => {
    let params = {
      statusCode,
      id,
    };
    updateOperationInfo(pause.value.id, params).then(() => {
      message.success('修改成功');
      pause.value.pauseText = '';
      pause.value.id = '';
      closeRestartModal();
      reload();
    });
  };
  // 暂停经营操作
  const [registerPauseModal, { openModal: openPauseModal, closeModal: closePauseModal }] =
    useModal();
  const openPause = (record) => {
    pause.value.id = record.id;
    openPauseModal(true);
    reload();
  };
  const handlePause = (id, statusCode) => {
    if (pause.value.pauseText === '' || pause.value.pauseText === null) {
      message.error('请填写原因说明！');
      return;
    }
    let params = {
      statusCode,
      id,
      statusUpdateRemark: pause.value.pauseText,
    };
    updateOperationInfo(pause.value.id, params).then(() => {
      message.success('修改成功');
      pause.value.pauseText = '';
      pause.value.id = '';
      closePauseModal();
      reload();
    });
  };
  // 历史记录操作
  const getHistoyColumns = ref([
    {
      title: '操作时间',
      align: 'left',
      dataIndex: 'reviewUpdatedDate',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '状态',
      dataIndex: 'reviewStatus',
      customRender: ({ record }) => {
        return record.reviewStatus.name;
      },
    },
  ]);
  const [historyModalRegister, { openModal, setModalProps }] = useModal();
  const [storeModalRegister, { openModal: openStoreModal, setModalProps: setStoreModalProps }] =
    useModal();
  // 打开历史操作记录弹窗
  const openHistory = (record) => {
    let data = { columns: getHistoyColumns, api: historyList + '/' + record.id };
    openModal(true, data);
    setModalProps({ title: '历史操作记录' });
  };
  // 打开关联店铺记录弹窗
  const openStore = (record) => {
    let data = { columns: getStoreColumns, api: storeList + '/' + record.id, record };
    openStoreModal(true, data);
    setStoreModalProps({ title: '关联店铺信息' });
  };
  // table
  const [registerTable, { reload }] = useTable({
    // title: '开启搜索区域',
    api: operatorList,
    // searchInfo: reviewStatus,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
    },
    // 请求之前对参数做处理
    beforeFetch(params) {
      params.offset = params.offset > 0 ? params.offset - 1 : params.offset;
      params?.dateRange
        ? (params.statusExpireStartDate = dateUtil(params.dateRange[0]).format(
            'YYYY-MM-DD 00:00:00',
          ))
        : '';
      params?.dateRange
        ? (params.statusExpireEndDate = dateUtil(params.dateRange[1]).format('YYYY-MM-DD 23:59:59'))
        : '';

      params.reviewStatusCode = activeKey.value === 'all' ? '' : activeKey.value;
    },
    fetchSetting: {
      // 传给后台的当前页字段
      pageField: 'offset',
      // 传给后台的每页显示多少条的字段
      sizeField: 'limit',
      // 接口返回表格数据的字段
      listField: 'organizations',
      // 接口返回表格总数的字段
      totalField: 'totalCount',
    },
    rowKey: 'id',
  });

  const goOrganizationDetail = (record) => {
    if (!hasPermission('ORGANIZATION_GET')) {
      return;
    }
    go('/merchant/basic/operatorDetail/' + record.id);
  };
  // tab切换时重新加载数据
  const tabChange = (key) => {
    activeKey.value = key;
    reload({
      page: 1,
    });
  };
</script>
<style lang="less" scoped>
  :deep(.ant-table-title) {
    padding: 0 !important;
  }
  :deep(.ant-tabs > .ant-tabs-nav) {
    margin: 0 !important;
  }
  :deep(.vben-basic-table-header__toolbar) {
    display: none !important;
  }
  .link {
    cursor: pointer;
    &:hover {
      color: #007bff;
    }
  }
  /* // 待提交 - 绿色 */
  .project-submit-item {
    background-color: #93c46b;
  }
  /* // 待审核 - 蓝色 */
  .project-review-item {
    background-color: #3582fb;
  }
  /* // 驳回 - 红色 */
  .project-rejected-item {
    background-color: #f85e5e;
  }
  /* //  通过 - 灰色 */
  .project-approved-item {
    background-color: #a7a7a7;
  }
  .no-drop{
    &:hover{
      cursor: no-drop;
    }
  }
</style>
