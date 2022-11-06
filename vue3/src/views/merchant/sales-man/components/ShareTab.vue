<template>
  <BasicTable @register="registerTable" :searchInfo="searchInfo" v-if="active == 1">
    <!--插槽:列表中的操作菜单-->
    <template #headerCell="{ column }">
      <template v-if="column.key === 'productName'">
        <div style="cursor: pointer" @click="getList(2)">
          商品名称
          <span style="margin-left: 20px"> <swap-outlined /></span>
        </div>
      </template>
      <template v-if="column.key === 'readQuantity'">
        <span> 阅读量 </span>
      </template>
    </template>
    <template #bodyCell="{ column, record, text }">
      <!-- 自定义【商品名称】列 -->
      <template v-if="column.key == 'productName'">
        <div class="link" @click="goDetail(record, 'product')">
          <span>{{ text }}</span>
        </div>
      </template>
    </template>
  </BasicTable>
  <BasicTable @register="registerTable1" :searchInfo="searchInfo" v-else>
    <!--插槽:列表中的操作菜单-->
    <template #headerCell="{ column }">
      <template v-if="column.key === 'productName'">
        <div style="cursor: pointer" @click="getList(1)">
          店铺名称
          <span style="margin-left: 20px"> <swap-outlined /></span>
        </div>
      </template>
      <template v-if="column.key === 'readQuantity'">
        <span> 阅读量 </span>
      </template>
    </template>
    <template #bodyCell="{ column, record, text }">
      <!-- 自定义【商品名称】列 -->
      <template v-if="column.key == 'productName'">
        <div class="link" @click="goDetail(record, 'product')">
          <span>{{ record.shopName }}</span>
        </div>
      </template>
    </template>
  </BasicTable>
</template>
<script lang="ts">
  import { SwapOutlined } from '@ant-design/icons-vue';
  import { defineComponent, ref, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  // import { getBasicColumns, searchFormSchema } from './salesMan.data';
  import { Alert } from 'ant-design-vue';

  import { shareStats } from '../salesMan.api';
  import { useGo } from '/@/hooks/web/usePage';

  const columns: BasicColumn[] = [
    {
      title: '商品名称',
      dataIndex: 'productName',
      align: 'left',
      width: 200,
    },
    {
      title: '阅读量',
      dataIndex: 'readQuantity',
      align: 'left',
      width: 480,
    },
  ];

  export default defineComponent({
    components: { BasicTable, AAlert: Alert, TableAction, SwapOutlined },
    setup() {
      const go = useGo();
      const checkedKeys = ref<Array<string | number>>([]);
      const active = ref(1);
      const { currentRoute } = useRouter();
      const { params } = unref(currentRoute);
      const { path } = params;
      const searchInfo = ref({
        buyerId: path,
        categoryCode: 'PRODUCT',
        keywords: null,
        result: 'SHARE_STATATS',
      });
      const [registerTable, { getForm, reload }] = useTable({
        title: '',
        api: shareStats,
        columns: columns,
        useSearchForm: true,
        formConfig: {
          labelWidth: 70,
          schemas: [
            {
              field: 'keywords',
              label: '商品名称',
              component: 'Input',
              colProps: { span: 6 },
              placeholder: '请输入商品名称',
            },
          ],
          autoSubmitOnEnter: true,
        },
        showTableSetting: false,
        tableSetting: { fullScreen: true },
        showIndexColumn: false,
        fetchSetting: {
          // 传给后台的当前页字段
          pageField: 'offset',
          // 传给后台的每页显示多少条的字段
          sizeField: 'limit',
          // 接口返回表格数据的字段
          listField: 'shareStats',
          // 接口返回表格总数的字段
          totalField: 'totalCount',
        },
        // 请求之前对参数做处理
        beforeFetch(params) {
          params.offset = params.offset > 1 ? params.offset - 1 : 0;
        },
        rowKey: 'id',
      });
      const [registerTable1, { reload: reload2 }] = useTable({
        title: '',
        api: shareStats,
        columns: columns,
        useSearchForm: true,
        formConfig: {
          labelWidth: 70,
          schemas: [
            {
              field: 'keywords',
              label: '店铺名称',
              component: 'Input',
              colProps: { span: 6 },
              placeholder: '请输入店铺名称',
            },
          ],
          autoSubmitOnEnter: true,
        },
        showTableSetting: false,
        tableSetting: { fullScreen: true },
        showIndexColumn: false,
        fetchSetting: {
          // 传给后台的当前页字段
          pageField: 'offset',
          // 传给后台的每页显示多少条的字段
          sizeField: 'limit',
          // 接口返回表格数据的字段
          listField: 'shareStats',
          // 接口返回表格总数的字段
          totalField: 'totalCount',
        },
        // 请求之前对参数做处理
        beforeFetch(params) {
          params.offset = params.offset > 1 ? params.offset - 1 : 0;
        },
        rowKey: 'id',
      });
      reload();

      function getFormValues() {
        console.log(getForm().getFieldsValue());
      }

      function onSelectChange(selectedRowKeys: (string | number)[]) {
        console.log(selectedRowKeys);
        checkedKeys.value = selectedRowKeys;
      }
      function handleView(record: Recordable) {
        go('/merchant/salesMan/salesManDetail/' + record.id);
      }
      const goDetail = (record, type: 'order' | 'product' | 'shop') => {
        if (type == 'order') {
          go(`/order/trades/tradesListDetail/${record.tradeId}`);
        } else if (type == 'product') {
          go(`/goods/basic/productDetail/${record.productId}`);
        } else if (type == 'shop') {
          go(`/merchant/basic/shopDetail/${record.shopId}`);
        }
      };
      const getList = (value) => {
        active.value = value;
        if (value == 1) {
          searchInfo.value = {
            buyerId: path,
            categoryCode: 'PRODUCT',
            keywords: null,
            result: 'SHARE_STATATS',
          };
          reload();
        } else {
          searchInfo.value = {
            buyerId: path,
            categoryCode: 'SHOP',
            keywords: null,
            result: 'SHARE_STATATS',
          };
          reload2();
        }
      };
      return {
        goDetail,
        searchInfo,
        handleView,
        registerTable,
        getFormValues,
        checkedKeys,
        onSelectChange,
        getList,
        active,
        registerTable1,
      };
    },
  });
</script>

<style lang="less" scoped>
  .link {
    cursor: pointer;
  }
</style>
