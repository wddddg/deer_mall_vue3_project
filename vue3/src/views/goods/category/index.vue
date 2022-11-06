<template>
  <BasicTable @register="registerTable" :expandedRowKeys="expandedRowKeys" @expand="onExpand">
    <!--插槽:table标题-->
    <template #tableTitle>
      <a-button
        type="primary"
        @click="menuAciton({}, 'create')"
        class="mr10"
        v-if="hasPermission(permissionCodeList.PRODUCT_CATEGORY_CREATE)"
      >
        新增分类
      </a-button>
      <a-button
        type="primary"
        @click="menuAciton({}, 'merge')"
        v-if="hasPermission(permissionCodeList.PRODUCT_CATEGORY_UPDATE)"
      >
        合并分类
      </a-button>
    </template>

    <!--插槽:列表表头-->
    <template #headerCell="{ column }">
      <template v-if="column.key == 'name'">
        <div class="header-category">
          <div v-if="isExpanded" @click="handleExpand">
            <Icon icon="ant-design:minus-outlined" style="font-size: 14px; font-weight: bold" />
          </div>
          <div v-if="!isExpanded" @click="handleExpand">
            <Icon icon="ant-design:plus-outlined" style="font-size: 14px; font-weight: bold" />
          </div>
          <span> {{ column.customTitle }} </span>
        </div>
      </template>
      <template v-else>
        <span> {{ column.customTitle }} </span>
      </template>
    </template>

    <!--插槽:列表中的操作菜单-->
    <template #bodyCell="{ column, record }">
      <!-- 自定义【排序】列 -->
      <template v-if="column.key == 'orderId'">
        <span
          v-if="hasPermission(permissionCodeList.PRODUCT_CATEGORY_UPDATE)"
          class="link"
          @click="menuAciton(record, 'sort')"
        >
          <Icon icon="ant-design:ordered-list-outlined" style="color: #007bff; font-size: 22px" />
        </span>
        <span v-else>
          <Icon icon="ant-design:ordered-list-outlined" style="font-size: 22px" />
        </span>
      </template>
      <!-- 操作列 -->
      <template v-if="column.key === 'action'">
        <a-row :gutter="5">
          <a-col :span="6" v-if="hasPermission(permissionCodeList.PRODUCT_CATEGORY_CREATE)">
            <div
              class="btn"
              @click="menuAciton(record, 'create')"
              v-if="!record.productAttachable && record.level < 5"
            >
              添加子分类
            </div>
          </a-col>
          <a-col
            :span="4"
            v-if="hasPermission(permissionCodeList.PRODUCT_CATEGORY_ATTRIBUTE_UPDATE)"
          >
            <div class="btn" @click="menuAciton(record, 'property')"> 属性 </div>
          </a-col>
          <a-col :span="4" v-if="hasPermission(permissionCodeList.PRODUCT_CATEGORY_UPDATE)">
            <div class="btn" @click="menuAciton(record, 'edit')"> 编辑 </div>
          </a-col>
          <a-col :span="4" v-if="hasPermission(permissionCodeList.PRODUCT_CATEGORY_UPDATE)">
            <div
              class="btn"
              @click="menuAciton(record, 'rate')"
              v-if="record.children && record.children.length > 0"
            >
              费率
            </div>
          </a-col>
          <a-col :span="4" v-if="hasPermission(permissionCodeList.PRODUCT_CATEGORY_DELETE)">
            <div class="btn" @click="menuAciton(record, 'delete')"> 删除 </div>
          </a-col>
        </a-row>
      </template>
    </template>
  </BasicTable>

  <!-- 删除 -->
  <DeleteModal @register="registerDeleteModal" @success="handleSuccess" />
  <!-- 设置费率 -->
  <CommissionRateModal @register="registerRateModal" @success="handleSuccess" />
  <!-- 新增、编辑 -->
  <CategoryModal @register="registerEditModal" @success="handleSuccess" />
  <!-- 设置属性 -->
  <PropertyModal @register="registerPropertyModal" />
  <!-- 分类排序 -->
  <SortModal @register="registerSortModal" @success="handleSuccess" />
  <!-- 合并分类 -->
  <MergeModal @register="registerMergeModal" @success="handleSuccess" />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { getBasicColumns, getFormConfig } from './category.data';
  import {
    getFetchSetting,
    getBeforeFetch,
    convertToTreeTable,
    getTreeTableExpandedRowKeys,
  } from '/@/utils/table';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getProductCategoryList } from './category.api';
  import { useModal } from '/@/components/Modal';
  import Icon from '/@/components/Icon';
  import DeleteModal from './components/DeleteModal.vue';
  import CommissionRateModal from './components/CommissionRateModal.vue';
  import CategoryModal from './components/CategoryModal.vue';
  import PropertyModal from './components/PropertyModal.vue';
  import SortModal from './components/SortModal.vue';
  import MergeModal from './components/MergeModal.vue';

  type MenuAcitonType = 'create' | 'edit' | 'delete' | 'rate' | 'property' | 'sort' | 'merge';

  const isExpanded = ref(true);
  const defaultExpandedRowKeys = ref<any[]>([]);
  const expandedRowKeys = ref<any[]>([]);

  // 权限操作
  const permissionCodeList = {
    PRODUCT_CATEGORY_GET: 'PRODUCT_CATEGORY_GET', // 查看搜索
    PRODUCT_CATEGORY_CREATE: 'PRODUCT_CATEGORY_CREATE', // 新增
    PRODUCT_CATEGORY_UPDATE: 'PRODUCT_CATEGORY_UPDATE', // 修改
    PRODUCT_CATEGORY_DELETE: 'PRODUCT_CATEGORY_DELETE', // 删除
    PRODUCT_CATEGORY_ATTRIBUTE_UPDATE: 'PRODUCT_CATEGORY_ATTRIBUTE_UPDATE', // 编辑属性
  };

  const { hasPermission } = usePermission();
  const [registerTable, { reload, getDataSource }] = useTable({
    isTreeTable: false,
    api: getProductCategoryList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    fetchSetting: getFetchSetting('productCategories'),
    beforeFetch: getBeforeFetch,
    afterFetch: (result: any) => {
      result = convertToTreeTable(result, 'productCategories');

      defaultExpandedRowKeys.value = getTreeTableExpandedRowKeys(result);
      expandedRowKeys.value = [...defaultExpandedRowKeys.value];

      return result;
    },
    actionColumn: {
      width: 320,
      title: '操作',
      dataIndex: 'action',
      align: 'left',
    },
    rowKey: 'id',
  });

  const onExpand = (expanded, record) => {
    console.log('rest =>', expanded, record);

    const idx = expandedRowKeys.value.findIndex((item) => item == record.id);
    if (idx > -1) {
      expandedRowKeys.value.splice(idx, 1);
    } else {
      expandedRowKeys.value.push(record.id);
    }
  };

  const handleExpand = () => {
    if (isExpanded.value) {
      expandedRowKeys.value.splice(0);
    } else {
      expandedRowKeys.value = [...defaultExpandedRowKeys.value];
    }

    isExpanded.value = !isExpanded.value;
  };

  function menuAciton(record: any, type: MenuAcitonType) {
    if (type == 'delete') {
      openDeleteModal(true, { ...record });

      return;
    } else if (type == 'create') {
      openEditModal(true, {
        parentId: record.id ?? '',
        list: getDataSource(),
        title: record.id ? '新增子分类' : '新增分类',
      });

      return;
    } else if (type == 'edit') {
      openEditModal(true, {
        ...record,
        list: getDataSource(),
        title: '编辑分类',
      });

      return;
    } else if (type == 'rate') {
      openRateModal(true, { ...record, list: getDataSource() });

      return;
    } else if (type == 'property') {
      // 设置属性
      openPropertyModal(true, { id: record.id });
    } else if (type == 'sort') {
      // 分类排序
      openSortModal(true, { ...record, list: getDataSource() });
    } else if (type == 'merge') {
      // 合并分类
      openMergeModal(true, { ...record, list: getDataSource() });
    }
  }

  // -----------------弹窗相关功能-----------------
  const [registerDeleteModal, { openModal: openDeleteModal }] = useModal();
  const [registerRateModal, { openModal: openRateModal }] = useModal();
  const [registerEditModal, { openModal: openEditModal }] = useModal();
  const [registerPropertyModal, { openModal: openPropertyModal }] = useModal();
  const [registerSortModal, { openModal: openSortModal }] = useModal();
  const [registerMergeModal, { openModal: openMergeModal }] = useModal();

  /**
   * 成功回调
   */
  function handleSuccess() {
    reload();
  }
</script>

<style lang="less" scoped>
  .header-category {
    display: flex;
    align-items: center;

    & > div {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 15px;
      height: 15px;
      border: 1px solid #f0f0f0;
      background-color: #fff;
      margin-right: 6px;
    }
  }

  .link {
    cursor: pointer;
    &:hover {
      color: #007bff;
    }
  }

  .btn {
    cursor: pointer;
    color: #007bff;
  }

  .mr10 {
    margin-right: 10px;
  }
</style>
