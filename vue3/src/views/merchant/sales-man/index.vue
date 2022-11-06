<template>
  <BasicTable @register="registerTable">
    <template #headerTop>
      <!-- <a-alert type="info" show-icon>
        <template #message>
          <template v-if="checkedKeys.length > 0">
            <span>已选中{{ checkedKeys.length }}条记录(可跨页)</span>
            <a-button type="link" @click="checkedKeys = []" size="small">清空</a-button>
          </template>
          <template v-else>
            <span>未选中任何项目</span>
          </template>
        </template>
      </a-alert> -->
    </template>

    <template #firstAction>
      <Icon icon="ion:language" />
    </template>
    <template #nickName="{ record }">
      <span class="link" @click="handleView(record)">{{ record.nickName }}</span>
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
  </BasicTable>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getBasicColumns, searchFormSchema } from './salesMan.data';
  import { Alert } from 'ant-design-vue';

  import { list } from './salesMan.api';
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
        showIndexColumn: false,
        beforeFetch: (params) => {
          if (params.offset) {
            params.offset = params.offset - 1;
          }
          params.sale = true;
        },
        fetchSetting: {
          // 传给后台的当前页字段
          pageField: 'offset',
          // 传给后台的每页显示多少条的字段
          sizeField: 'limit',
          // 接口返回表格数据的字段
          listField: 'buyers',
          // 接口返回表格总数的字段
          totalField: 'totalCount',
        },
        rowKey: 'id',
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
          go('/merchant/salesMan/salesManDetail/' + record.id);
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
