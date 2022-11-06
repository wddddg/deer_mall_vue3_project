<template>
  <BasicTable @register="registerTable">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a-dropdown>
          <a class="ant-dropdown-link">更多 <Icon icon="ant-design:down-outlined" /> </a>
          <template #overlay>
            <a-menu class="antd-more">
              <a-menu-item v-if="hasPermission('ROLE_PERMISSION_GET')">
                <a @click="toDetail('show', record.id)">查看</a>
              </a-menu-item>
              <a-menu-item v-if="hasPermission('ROLE_UPDATE') && record.name !== '超级管理员'">
                <a @click="toDetail('edit', record.id)">编辑</a>
              </a-menu-item>
              <a-menu-item v-if="hasPermission('ROLE_DELETE') && record.name !== '超级管理员'">
                <a @click="openDelete(record)">删除</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
    <template #toolbar>
      <a-button type="primary" @click="toDetail('add', '1')" v-if="hasPermission('ROLE_CREATE')"
        >新增角色</a-button
      >
    </template>
  </BasicTable>
  <!-- 删除弹窗 -->
  <BasicModal
    centered
    :destroyOnClose="true"
    :maskClosable="false"
    :useWrapper="false"
    @register="registerDeleteModal"
    title="角色删除"
    @ok="handleDelete(selectId)"
    @cancel="closeDeleteFunc"
    :bodyStyle="{ height: '100px', paddingLeft: '32px' }"
  >
    <div style="font-size: 16px">是否删除选中角色？ </div>
    <div style="font-size: 16px">
      角色类型名称：<span style="color: #ff5050">{{ selectName }}</span></div
    >
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getBasicColumns, searchFormSchema } from './role.data';
  import Icon from '/@/components/Icon';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { roleListInTable, roleDelete } from './role.api';
  import { message } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const go = useGo();
  const router = useRouter();

  const [registerTable, { reload }] = useTable({
    api: roleListInTable,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      showAdvancedButton: false,
      autoSubmitOnEnter: true,
    },
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    // showIndexColumn: true,
    indexColumnProps: {
      width: 200,
    },
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
    // 请求之前对参数做处理
    beforeFetch(params) {
      params.offset = params.offset - 1;
    },
    fetchSetting: {
      // 传给后台的当前页字段
      pageField: 'offset',
      // 传给后台的每页显示多少条的字段
      sizeField: 'limit',
      // 接口返回表格数据的字段
      listField: 'roles',
      // 接口返回表格总数的字段
      totalField: 'totalCount',
    },
    rowKey: 'id',
  });
  // 删除操作
  let selectId = ref();
  let selectName = ref();
  const [registerDeleteModal, { openModal: openDeleteModal, closeModal: closeDeleteModal }] =
    useModal();
  const openDelete = (record) => {
    selectId.value = record.id;
    selectName.value = record.name;
    console.log(selectId.value, selectName.value);
    openDeleteModal(true);
  };
  const handleDelete = (id) => {
    roleDelete(id)
      .then(() => {
        message.success('删除成功！');
        closeDeleteModal();
        reload();
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  };
  const closeDeleteFunc = () => {
    selectId.value = '';
    selectName.value = '';
  };
  // 去详情操作
  const toDetail = (type, id) => {
    console.log(type, id);
    go('/management/account/rolePermission/' + type + '/' + id);
  };
</script>
<style lang="less" scoped>
  .link {
    cursor: pointer;
    &:hover {
      color: #007bff;
    }
  }
</style>
