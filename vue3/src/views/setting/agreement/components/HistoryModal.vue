<template>
  <div class="px-10">
    <BasicModal
      centered
      :maskClosable="false"
      @register="registerModal"
      v-bind="$attrs"
      title="历史记录"
      :showOkBtn="false"
      :showCancelBtn="false"
      :width="800"
    >
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }" v-if="hasPermission('CONFIG_AGREEMENT_GET')">
          <template v-if="column.key === 'action'">
            <a @click="openChak(record)">查看</a>
          </template>
        </template>
      </BasicTable>
    </BasicModal>
  </div>
  <DefaultModal @register="defaultModalRegister" />
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getFetchSetting } from '/@/utils/table';
  import DefaultModal from './DefaultModal.vue';
  import { getModelBasicColumns } from '../agreement.data';
  import { getStatusTypesList } from '../agreement.api';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const code = ref('');
  const [registerModal, { setModalProps }] = useModalInner((data) => {
    code.value = data.code;
    setModalProps({ confirmLoading: false });
  });
  const [defaultModalRegister, { openModal: openDefaultModal }] = useModal();
  // 注册表格
  const [registerTable, { reload, getForm }] = useTable({
    api: getStatusTypesList,
    columns: getModelBasicColumns(),
    useSearchForm: false,
    showTableSetting: false,
    tableSetting: { fullScreen: false, redo: false, size: false, setting: false },
    showIndexColumn: false,
    fetchSetting: getFetchSetting('usageAgreements'),
    beforeFetch: (params) => {
      params.code = code.value;
    },
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
    },
    rowKey: 'tradeId',
  });

  const openChak = (record) => {
    openDefaultModal(true, {
      record,
      isEdit: false,
    });
  };

  watch(code, () => {
    reload({
      page: 1,
    });
  });
</script>
<style scoped></style>
