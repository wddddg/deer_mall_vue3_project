<template>
  <BasicTable @register="registerTable">
    <!--插槽:列表中的操作菜单-->
    <template #bodyCell="{ column, record, text }">
      <!-- 自定义【昵称】列 -->
      <template v-if="column.key == 'mobile'">
        <div class="link" @click="goDetail(record)">
          <span>{{ text }}</span>
        </div>
      </template>
      <!-- 自定义【昵称】列 -->
      <template v-if="column.key == 'nickName'">
        <div class="link" @click="goDetail(record)">
          <span class="test-remark" v-if="record.testOnly">测</span>
          <span>{{ text }}</span>
        </div>
      </template>
      <!-- 操作列 -->
      <template v-if="column.key === 'action'">
        <a-dropdown>
          <a class="ant-dropdown-link">更多 <Icon icon="ant-design:down-outlined" /> </a>
          <template #overlay>
            <a-menu class="antd-more" v-if="hasPermission('BUYER_UPDATE_TEST')">
              <a-menu-item>
                <a @click="handleAction(record)">
                  {{ record.testOnly ? '取消测试员' : '设为测试员' }}
                </a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </BasicTable>

  <!-- 新增、编辑 -->
  <CompanyModal @register="registerEditModal" @success="handleSuccess" />
</template>

<script setup lang="ts">
  import { BasicTable, useTable } from '/@/components/Table';
  import { useGo } from '/@/hooks/web/usePage';
  import { useModal } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import Icon from '/@/components/Icon';
  import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
  import { getBasicColumns, getFormConfig } from './list.data';
  import { getBuyerList } from './list.api';
  import CompanyModal from './components/ConsumerModal.vue';

  const permissionCodeList = {
    BUYER_DETAIL_GET: 'BUYER_DETAIL_GET',
  };

  const { hasPermission } = usePermission();
  const go = useGo();
  const [registerTable, { reload }] = useTable({
    api: getBuyerList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    fetchSetting: getFetchSetting('buyers'),
    // 请求之前对参数做处理
    beforeFetch: getBeforeFetch,
    rowKey: 'id',
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
    },
  });

  const goDetail = (record) => {
    if (hasPermission(permissionCodeList.BUYER_DETAIL_GET)) {
      go(`/consumer/basic/consumerDetail/${record.id}`);
    }
  };

  // 取消测试人员 、测试人员设置
  const handleAction = (record) => {
    // 打开设置框
    openModal(true, {
      title: record.testOnly ? '取消测试人员' : '测试人员设置',
      ...record,
    });
  };

  // -----------------弹窗相关功能-----------------
  const [registerEditModal, { openModal }] = useModal();

  /**
   * 成功回调
   */
  function handleSuccess() {
    reload();
  }
</script>

<style lang="less" scoped>
  .link {
    cursor: pointer;
    &:hover {
      color: #007bff;
    }
  }

  .test-remark {
    display: inline-block;
    padding: 2px 4px;
    line-height: 16px;
    font-size: 12px;
    color: #fff;
    background: #ff4700 !important;
    border-radius: 2px;
    margin-right: 5px;
  }
</style>
