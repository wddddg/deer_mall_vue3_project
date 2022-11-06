<template>
  <BasicTable @register="registerTable">
    <!--插槽:查询表单中的-->
    <template #form-productCategor>
      <a-tree-select
        allowClear
        style="width: 100%"
        placeholder="请选择"
        v-model:value="productCategoryId"
        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
        :treeData="treeData"
        @change="onChange"
      />
    </template>

    <!--插槽:表格中的列-->
    <template #productLink="{ record, text }">
      <span
        :class="{ link: hasPermission('PRODUCT_DETAIL_GET') }"
        @click="hasPermission('PRODUCT_DETAIL_GET') ? goDetail(record) : ''"
      >
        {{ text }}
      </span>
    </template>
  </BasicTable>
</template>

<script setup lang="ts">
  import { BasicTable, useTable } from '/@/components/Table';
  import { useGo } from '/@/hooks/web/usePage';
  import { getBasicColumns, getFormConfig } from './list.data';
  import { getFetchSetting, getBeforeFetch, convertToTree } from '/@/utils/table';
  import { getProductList, getProductCategories } from './list.api';
  import { onMounted, ref } from 'vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  const treeData = ref<any[]>([]);
  const productCategoryId = ref(undefined as string | undefined);

  const { hasPermission } = usePermission();
  const go = useGo();
  const [registerTable, { getForm }] = useTable({
    api: getProductList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    fetchSetting: getFetchSetting('products'),
    beforeFetch: (params) => {
      getBeforeFetch(params);

      if (productCategoryId.value) {
        params.productCategoryId = productCategoryId.value || '0';
      }
    },
    rowKey: 'productId',
  });

  const goDetail = (record) => {
    go(`/goods/basic/productDetail/${record.productId}`);
  };

  const onChange = (value, label, extra) => {
    console.log('value =>', value);
    console.log('label =>', label);
    console.log('extra =>', extra);

    productCategoryId.value = value;
  };

  onMounted(async () => {
    treeData.value = await getProductCategories().then((res) => {
      return convertToTree(res.productCategories, 'productCategories', '');
    });

    getForm().setProps({
      resetFunc: async () => {
        productCategoryId.value = undefined;
      },
    });
  });
</script>

<style lang="less" scoped>
  .link {
    cursor: pointer;
    &:hover {
      color: #007bff;
    }
  }

  :deep(.ant-form-item) {
    margin-right: 10px;
  }
</style>
