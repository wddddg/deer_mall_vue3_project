<template>
  <BasicTable @register="registerTable">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'mobile'">
        <div class="link" @click="openShow(record)">{{ record.mobile }}</div>
      </template>
      <template v-if="column.key === 'action'">
        <a-dropdown>
          <a class="ant-dropdown-link">更多 <Icon icon="ant-design:down-outlined" /> </a>
          <template #overlay>
            <a-menu class="antd-more">
              <a-menu-item v-if="hasPermission('ACCOUNT_UPDATE')">
                <a @click="openEdit(record)">编辑</a>
              </a-menu-item>
              <a-menu-item v-if="hasPermission('ACCOUNT_DELETE')">
                <a @click="openDelete(record)">删除</a>
              </a-menu-item>
              <a-menu-item v-if="hasPermission('ACCOUNT_PASSWORD_UPDATE')">
                <a @click="openPwd(record)">修改密码</a>
              </a-menu-item>
              <a-menu-item v-if="hasPermission('ACCOUNT_UPDATE')">
                <a @click="openService(record)">客服设置</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
    <template #toolbar>
      <a-button type="primary" @click="openAdd" v-if="hasPermission('ACCOUNT_CREATE')"
        >新增账号</a-button
      >
    </template>
    <template #firstAction>
      <Icon icon="ion:language" />
    </template>
  </BasicTable>
  <!-- 删除弹窗 -->
  <BasicModal
    centered
    :destroyOnClose="true"
    :maskClosable="false"
    :useWrapper="false"
    @register="registerDeleteModal"
    title="账号删除"
    @ok="handleDelete(selectId, 'ORG_STATUS_NORMAL')"
    @cancel="closeDeleteFunc"
    :bodyStyle="{ height: '100px', paddingLeft: '32px' }"
  >
    <div style="font-size: 16px">是否删除选中账号？ </div>
    <div style="font-size: 16px"
      >账号：<span style="color: #ff5050">{{ selectMobile }}</span></div
    >
  </BasicModal>
  <!-- 编辑弹窗 -->
  <BasicModal
    centered
    :destroyOnClose="true"
    :maskClosable="false"
    :useWrapper="false"
    @register="registerEditModal"
    title="编辑账号"
    @ok="handleEdit"
  >
    <BasicForm @register="registerEditFrom" :showActionButtonGroup="false" />
  </BasicModal>
  <!-- 查看弹窗 -->
  <BasicModal
    centered
    :destroyOnClose="true"
    :maskClosable="false"
    :useWrapper="false"
    :showOkBtn="false"
    @register="registerShowModal"
    title="账号信息"
  >
    <BasicForm @register="registerShowFrom" :showActionButtonGroup="false" />
  </BasicModal>
  <!-- 新增弹窗 -->
  <BasicModal
    centered
    :destroyOnClose="true"
    :maskClosable="false"
    :useWrapper="false"
    @register="registerAddModal"
    title="新增账号"
    @ok="handleAdd"
  >
    <BasicForm @register="registerAddFrom" :showActionButtonGroup="false" />
  </BasicModal>
  <!-- 修改密码弹窗 -->
  <BasicModal
    centered
    :destroyOnClose="true"
    :maskClosable="false"
    :useWrapper="false"
    @register="registerPwdModal"
    title="修改账号密码"
    @ok="handlePwd"
  >
    <BasicForm @register="registerPwdFrom" :showActionButtonGroup="false" />
  </BasicModal>
  <!-- 客服设置弹窗 -->
  <BasicModal
    centered
    :destroyOnClose="true"
    :maskClosable="false"
    :useWrapper="false"
    @register="registerSerivceModal"
    title="客服设置"
    @ok="handleService"
    :bodyStyle="{ height: '100px' }"
  >
    <BasicForm @register="registerSerivceFrom" :showActionButtonGroup="false" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import {
    getBasicColumns,
    searchFormSchema,
    editFormSchema,
    pwdFormSchema,
    serviceFormSchema,
  } from './account.data';
  import Icon from '/@/components/Icon';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { AccountList, deleteAccount, update, create } from './account.api';
  import { message } from 'ant-design-vue';
  // import { cloneDeep } from 'lodash-es';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  const [registerTable, { reload }] = useTable({
    api: AccountList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: {
      labelWidth: 100,
      showAdvancedButton: false,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
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
      listField: 'mamas',
      // 接口返回表格总数的字段
      totalField: 'totalCount',
    },
    rowKey: 'id',
  });

  // 重启经营操作
  let selectId = ref();
  let selectMobile = ref();
  // 删除操作
  const [registerDeleteModal, { openModal: openDeleteModal, closeModal: closeDeleteModal }] =
    useModal();
  const openDelete = (record) => {
    selectId.value = record.id;
    selectMobile.value = record.mobile;
    console.log(selectId.value, selectMobile.value);
    openDeleteModal(true);
  };
  const handleDelete = (id, statusCode) => {
    let params = {
      statusCode,
      id,
    };
    deleteAccount(id, params).then(() => {
      message.success('删除成功！');
      closeDeleteModal();
      reload();
    });
  };
  const closeDeleteFunc = () => {
    selectId.value = '';
    selectMobile.value = '';
  };
  // 编辑操作 registerEditModal
  const [registerEditFrom, { setFieldsValue, getFieldsValue, validate: validateEdit }] = useForm({
    labelWidth: 120,
    schemas: editFormSchema,
    actionColOptions: {
      span: 24,
    },
  });
  const [registerEditModal, { openModal: openEditModal, closeModal: closeEditModal }] = useModal();
  const openEdit = async (record) => {
    await openEditModal(true);
    let { id, mobile, name, roles } = record;
    await setFieldsValue({
      id: id,
      mobile: mobile,
      name: name,
      roleId: roles[0].id,
    });
  };
  const handleEdit = async () => {
    let form = getFieldsValue();
    const values = await validateEdit();
    if (values) {
      if (!form.roleId) {
        message.error('请选择账号角色');
        return;
      }
      let { id, name, mobile, roleId } = form;
      let params = {
        id,
        name,
        mobile,
        roles: [{ id: roleId }],
      };
      await update(id, params)
        .then(() => {
          message.success('编辑成功！');
          closeEditModal();
          reload();
        })
        .catch((error) => {
          message.error(error.response.data.message);
        });
    }
  };
  // 查看操作 registerEditModal
  const [registerShowFrom, { setFieldsValue: setShowValue }] = useForm({
    labelWidth: 120,
    schemas: editFormSchema,
    actionColOptions: {
      span: 24,
    },
    disabled: true,
  });
  const [registerShowModal, { openModal: openShowModal, closeModal: closeShowModal }] = useModal();
  const openShow = async (record) => {
    if (!hasPermission('ACCOUNT_GET')) {
      return;
    }
    await openShowModal(true);
    let { id, mobile, name, roles } = record;
    await setShowValue({
      id: id,
      mobile: mobile,
      name: name,
      roleId: roles[0].id,
    });
  };
  // 新增操作
  const [
    registerAddFrom,
    { setFieldsValue: setAddValue, getFieldsValue: getAddValue, validate: validateAdd },
  ] = useForm({
    labelWidth: 120,
    schemas: editFormSchema,
    actionColOptions: {
      span: 24,
    },
  });
  const [registerAddModal, { openModal: openAddModal, closeModal: closeAddModal }] = useModal();
  const openAdd = async () => {
    await openAddModal(true);
  };
  const handleAdd = async () => {
    let form = getAddValue();
    const values = await validateAdd();
    if (values) {
      if (!form.roleId) {
        message.error('请选择账号角色');
        return;
      }
      let { id, name, mobile, roleId } = form;
      let params = {
        id,
        name,
        mobile,
        roles: [{ id: roleId }],
      };
      await create(params)
        .then(() => {
          message.success('编辑成功！');
          closeAddModal();
          reload();
        })
        .catch((error) => {
          message.error(error.response.data.message);
        });
    }
  };
  // 修改密码操作 registerPwdModal
  const [registerPwdFrom, { setFieldsValue: setPwdValue, getFieldsValue: getPwdsValue }] = useForm({
    labelWidth: 120,
    schemas: pwdFormSchema,
    actionColOptions: {
      span: 24,
    },
  });
  const [registerPwdModal, { openModal: openPwdModal, closeModal: closePwdModal }] = useModal();
  const openPwd = async (record) => {
    await openPwdModal(true);
    let { id, mobile } = record;
    await setPwdValue({
      id: id,
      mobile: mobile,
    });
  };
  // 空值测试
  const checkValueOfEmpty = (value) => {
    if (value !== '' && value !== undefined && value !== null) {
      return false;
    }
    return true;
  };
  const handlePwd = async () => {
    let form = getPwdsValue();
    let { id, password, passwordOk } = form;
    if (checkValueOfEmpty(password)) {
      message.error('请输入新密码！');
      return;
    }
    let reg = new RegExp(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![(0-9a-zA-Z)]+$).{8,16}$/);
    if (!reg.test(password)) {
      message.error('新密码不符合规范，密码必须由大小写字母、数字和特殊字符组成，长度8-16位！');
      return;
    }
    if (checkValueOfEmpty(passwordOk)) {
      message.error('请确认新密码！');
      return;
    }
    if (password !== passwordOk) {
      message.error('新密码与确认新密码不一致！');
      return;
    }
    let params = {
      id,
      password,
    };
    await update(id, params);
    message.success('编辑成功！');
    closePwdModal();
    reload();
  };

  // 客服设置
  const [
    registerSerivceFrom,
    { setFieldsValue: setServiceValue, getFieldsValue: getServiceValue },
  ] = useForm({
    labelWidth: 120,
    schemas: serviceFormSchema,
    actionColOptions: {
      span: 24,
    },
  });
  const [registerSerivceModal, { openModal: openServiceModal, closeModal: closeServiceModal }] =
    useModal();
  const openService = async (record) => {
    await openServiceModal(true);
    let { id, nickName } = record;
    await setServiceValue({
      id: id,
      nickName: nickName,
    });
  };
  const handleService = async () => {
    let form = getServiceValue();
    let { id, nickName } = form;
    if (checkValueOfEmpty(nickName)) {
      message.error('请输入客服名称！');
      return;
    }
    let params = {
      id,
      nickName,
    };
    await update(id, params)
      .then(() => {
        message.success('修改成功！');
        closeServiceModal();
        reload();
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
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
