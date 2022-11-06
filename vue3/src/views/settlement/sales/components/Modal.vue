<template>
  <div class="px-10">
    <BasicModal
      @ok="handleOk"
      @register="registerModal"
      v-bind="$attrs"
      title="导出报表"
      okText="导出"
      @cancel="close"
    >
      <BasicForm @register="registerForm">
        <template #shopName>
          <a-select
            v-model:value="state.value"
            label-in-value
            placeholder="请输入查询的店铺名称关键字"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            :options="state.data"
            showSearch
            @search="fetchUser"
            @focus="fetchUser('')"
            :allowClear="true"
          >
            <template v-if="fetching" #notFoundContent>
              <a-spin size="small" />
            </template>
          </a-select>
        </template>
        <template #timer>
          <a-range-picker :show-time="false" @change="changeTimer" v-if="showTimer" />
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
// import { OssFileService } from '/@/shared/services/oss-file/oss-file.service';
import { OssUtils } from '/@/utils/ossUtils';
import { BasicForm, useForm } from '/@/components/Form/index';
import { formSchema } from '../sales.data';
import { exportXls, getShopList } from '../sales.api';
import { debounce } from 'lodash-es';
import { message } from 'ant-design-vue';

const ossUtils = new OssUtils();
const startTime = ref('')
const endtTime = ref('')
const showTimer = ref(true)
const [registerModal, { setModalProps }] = useModalInner((data) => {
  showTimer.value = true
});
const [registerForm, { validate, updateSchema, resetFields }] = useForm({
  schemas: formSchema,
  showActionButtonGroup: false,
  labelCol: {
    xs: {span: 24},
    sm: {span: 4},
  },
});

const exportModalData = {
  shopIds: [],
  shopName: '',
  statusCode: '', // 未开放
  tradeId: '', // 未开放
  wxTradeId: '', // 未开放
  payStartDate: '',
  payEndDate: '',
  createdStartDate: '',
  createdEndDate: '',
};
const handleOk = async () => {
  let value = await validate();
  if(state?.value?.label){
    value.shopName = state.value.label;
  }
  if(state?.value?.value){
    value.shopIds = [ state.value.value ]
  }
  if(!startTime.value || !endtTime.value) return message.warning('请选择导出时间范围')
  if(value.timer){
    delete value.timer
  }
  if(!value.shopName){
    delete value.shopIds
  }
  if (value.billTime === "created") {
    value.createdStartDate = startTime.value;
    value.createdEndDate = endtTime.value;
  } else {
    value.payStartDate = startTime.value;
    value.payEndDate = endtTime.value;
  }
  exportXls(value).then((res) => {
    res.exportExcelUrl = ossUtils.getSignatureUrl(res.exportExcelUrl);
    // res.exportExcelUrl = OssFileService.getSignatureUrl(res.exportExcelUrl);
    document.createElement('a');
    let elink = document.createElement('a'); // 组装a标签
    elink.download = `${exportModalData.shopName}_export.xlsx`; // 设置下载文件名
    elink.style.display = 'none';
    elink.href = res.exportExcelUrl;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  });
};

const state = reactive({
  data: [],
  value: [],
  fetching: false,
});

const fetchUser = debounce((value) => {
  state.data = [];
  state.fetching = true;
  let params = {
    name: value || '',
    limit: 10,
    offset: 0,
  };
  getShopList(params).then((res) => {
    const data = res.shops.map((user) => ({
      label: user.name,
      value: user.id,
    }));
    state.data = data;
    state.fetching = false;
  });
}, 300);


const changeTimer = (field, value) =>{
  if(!value[0] || !value[1]) {
    startTime.value = ''
    endtTime.value = ''
  }else{
    startTime.value = value[0] + ' 00:00:00'
    endtTime.value = value[1] + ' 23:59:59'
  }
}

const close = async () =>{
  state.value = []
  showTimer.value = false
  await resetFields()
}

</script>
<style scoped lang="less">
</style>
