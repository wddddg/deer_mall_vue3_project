<template>
  <BasicTable @register="registerTable">
    <template #firstAction>
      <Icon icon="ion:language" />
    </template>
    <template #bodyCell="{ column, record }">
      <!-- <template v-if="column.key === 'action'">
        <TableAction
          :actions="[
          {
             label: '详情',
            onClick: handleView.bind(null, record),
          },

          ]"
        />
      </template> -->
    </template>
    <template #buyerNickName="{ record }">
      <span class="link" @click="handleView(record)">{{ record.buyerNickName }}</span>
    </template>
  </BasicTable>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getBasicColumns, searchFormSchema } from './salesRank.data';
  import { Alert } from 'ant-design-vue';

  import { list } from './salesRank.api';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  export default defineComponent({
    components: { BasicTable, AAlert: Alert, TableAction },
    setup() {
      const go = useGo();
      const checkedKeys = ref<Array<string | number>>([]);
      const [registerTable, { getForm }] = useTable({
        title: '',
        api: list,
        columns: getBasicColumns(),
        useSearchForm: true,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        showTableSetting: false,
        tableSetting: { fullScreen: true },
        showIndexColumn: true,
        indexColumnProps: {
          title: '排名',
        },
        beforeFetch: (params) => {
          if (params.offset) {
            params.offset = params.offset - 1;
          }
        },
        fetchSetting: {
          // 传给后台的当前页字段
          pageField: 'offset',
          // 传给后台的每页显示多少条的字段
          sizeField: 'limit',
          // 接口返回表格数据的字段
          listField: 'tradeProfitSharingSales',
          // 接口返回表格总数的字段
          totalField: 'totalCount',
        },
        rowKey: 'buyerId',
        // actionColumn: {
        //   width: 120,
        //   title: '操作',
        //   dataIndex: 'action',
        //   // slots: { customRender: 'action' },
        // },
      });

      function getFormValues() {
        console.log(getForm().getFieldsValue());
      }

      function onSelectChange(selectedRowKeys: (string | number)[]) {
        console.log(selectedRowKeys);
        checkedKeys.value = selectedRowKeys;
      }
      function handleView(record: Recordable) {
        if (hasPermission('SELLER_SALES')) {
          go('/merchant/salesMan/salesManRankDetail/' + record.buyerId);
        }
      }

      return {
        handleView,
        registerTable,
        getFormValues,
        checkedKeys,
        onSelectChange,
      };
    },
  });
</script>
<style scoped lang="less">
  .link {
    cursor: pointer;
    &:hover {
      color: #007bff;
    }
  }
</style>
