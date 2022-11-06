<template>
  <div class="px-10">
    <BasicModal
      centered
      :footer="null"
      :maskClosable="false"
      :destroyOnClose="true"
      @register="registerModal"
      v-bind="$attrs"
      title="Modal Title"
    >
      <BasicTable @register="registerTable">
        <template #action="{ record }">
          <a
            v-if="record.reviewStatusCode === 'ORG_REVIEW_STATUS_WAIT_REVIEW'"
            class="blueColor"
            @click="pdfAction('review', record.reviewDocUrl)"
          >
            预览
          </a>
          <a
            class="blueColor"
            v-if="record.reviewStatusCode === 'ORG_REVIEW_STATUS_REJECTED'"
            @click="showRejectModal(record.remark)"
          >
            驳回原因
          </a>
        </template>
      </BasicTable>
      <BasicModal
        centered
        :showCancelBtn="false"
        :canFullscreen="false"
        :maskClosable="false"
        :destroyOnClose="true"
        @register="registerRejectModal"
        title="驳回原因"
        @ok="colseReject"
        :minHeight="60"
      >
        {{ remark ? remark : '无' }}
      </BasicModal>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { OssUtils } from '/@/utils/ossUtils';
  // import { useMessage } from '/@/hooks/web/useMessage';
  // const { createConfirm } = useMessage();
  // imgs
  const ossUtils = new OssUtils();
  function getFileUrl(fileUrl: String) {
    return ossUtils.getSignatureUrl(fileUrl);
  }
  // PDF
  function pdfAction(action, url) {
    ossUtils.pdfAction(action, url);
  }
  let api = ref();
  let remark = ref();
  const showRejectModal = (remarks) => {
    remark.value = remarks;
    openRejectModal(true);
    // createConfirm({
    //   iconType: 'success',
    //   title: '驳回原因',
    //   content: remark,
    // });
  };
  const colseReject = () => {
    remark.value = '';
    closeRejectModal();
  };
  const historyApi = (params) => defHttp.get({ url: api.value, params });
  const [registerTable, { setColumns }] = useTable({
    api: historyApi,
    // columns: columns.value,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: false,
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
    },
    rowKey: 'id',
  });
  const [registerModal, {}] = useModalInner((data) => {
    console.log(data);
    setColumns(data.columns);
    api.value = data.api;
  });
  const [registerRejectModal, { closeModal: closeRejectModal, openModal: openRejectModal }] =
    useModal();
</script>
<style scoped>
  .blueColor {
    color: #007bff;
  }
</style>
