<template>
  <BasicTable @register="registerTable">
    <!--插槽:查询条件重置前-->
    <!-- <template #form-advanceAfter>
      <a-button type="primary" @click="() => {}" style="margin-right: 10px">导出报表</a-button>
    </template> -->
    <template #tableTitle>
      <a-button type="primary" @click="() => {}" preIcon="ant-design:plus-outlined">
        导出报表
      </a-button>
    </template>

    <!--插槽:table标题中的 tab框-->
    <template #headerTop>
      <a-tabs @change="tabChange" :activeKey="activeKey">
        <a-tab-pane tab="全部" key="all" forceRender />
        <a-tab-pane v-for="item in tabList" :tab="item.name" :key="item.code" />
      </a-tabs>
    </template>

    <!--插槽:列表中的操作菜单-->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a-dropdown>
          <a class="ant-dropdown-link">更多 <Icon icon="ant-design:down-outlined" /> </a>
          <template #overlay>
            <a-menu class="antd-more">
              <a-menu-item>
                <a @click="handleAction(record)">详情</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </BasicTable>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getBasicColumns, getFormConfig } from './refundFlow.data';
  import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
  import Icon from '/@/components/Icon';
  import { dateUtil } from '/@/utils/dateUtil';
  import {
    getOrganizationsList,
    getOrganizationReviewStatusTypesTypesList,
  } from './refundFlow.api';

  const activeKey = ref('all');
  const tabList = ref<any[]>([]);

  const go = useGo();
  const [registerTable, { reload }] = useTable({
    api: getOrganizationsList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: false, redo: false, size: false, setting: false },
    showIndexColumn: false,
    fetchSetting: getFetchSetting('organizations'),
    beforeFetch: (params) => {
      getBeforeFetch(params);
      if (params?.createdDate) {
        params.statusExpireStartDate = dateUtil(params.createdDate[0]).format(
          'YYYY-MM-DD 00:00:00',
        );
        params.statusExpireEndDate = dateUtil(params.createdDate[1]).format('YYYY-MM-DD 23:59:59');
      } else {
        params.statusExpireStartDate = undefined;
        params.statusExpireEndDate = undefined;
      }
      delete params.createdDate;
      // tab框对应的条件
      if (activeKey.value !== 'all') {
        params.reviewStatusCode = activeKey.value;
      }
    },
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
    },
    rowKey: 'id',
  });

  // 打开详情页面
  const handleAction = (record) => {
    console.log('handleAction.record =>', record);
    go(`/order/sales/refundFlowDetail/${record.id}`);
  };

  // tab切换时重新加载数据
  const tabChange = (key) => {
    activeKey.value = key;
    reload({
      page: 1,
    });
  };

  onMounted(async () => {
    tabList.value = await getOrganizationReviewStatusTypesTypesList();

    console.log('getOrganizationReviewStatusTypesTypesList =>', tabList.value);
  });
</script>

<style lang="less">
  .project-item {
    padding: 3px 9px;
    border-radius: 2px;
    font-size: 14px;
    line-height: 19px;
    white-space: nowrap;
    user-select: none;
    color: #fff;

    // 待提交 - 绿色
    &.project-submit-item {
      // background-color: rgba($color: #60bc63, $alpha: 0.13);
      background-color: #93c46b;
    }

    // 待审核 - 蓝色
    &.project-review-item {
      // background-color: rgba($color: #60bc63, $alpha: 0.13);
      background-color: #3582fb;
    }

    // 驳回 - 红色
    &.project-rejected-item {
      // background-color: rgba($color: #ff5050, $alpha: 0.1);
      background-color: #f85e5e;
    }

    //  通过 - 灰色
    &.project-approved-item {
      // background-color: rgba($color: #707070, $alpha: 0.1);
      background-color: #a7a7a7;
    }
  }
</style>
