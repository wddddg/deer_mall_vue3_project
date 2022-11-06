<template>
  <a-row class="p-4" :gutter="10">
    <a-col :xl="24" :lg="24" :md="24" :sm="24" style="flex: 1">
      <a-card :bordered="false" style="height: 100%">
        <a-tabs @change="changeTab">
          <!-- 订单配置 -->
          <a-tab-pane tab="订单" key="order">
            <div class="updata-content">
              <div class="content-title">订单配置</div>
            </div>
            <div class="content-br"></div>
            <BasicForm @register="registerOrderForm" class="basic-form-style" />
            <div class="explain">
              <span style="color: #c02235">说明：</span>
              <span style="color: #c4c4c4"
                >以上设置修改后，将对新产生的订单立即生效，已产生的订单将按修改前设置为准。</span
              >
            </div>
            <div class="content-br"></div>
            <div class="save-info" v-if="hasPermission('CONFIG_UPDATE')"
              ><a-button type="primary" @click="saveOrderButton">保存</a-button></div
            >
          </a-tab-pane>
          <!-- SMS通知配置 -->
          <a-tab-pane tab="SMS通知" key="notify">
            <div class="updata-content">
              <div class="content-title">SMS通知配置</div>
            </div>
            <div class="content-br"></div>
            <BasicForm @register="registerSMSForm" class="basic-form-style" />
            <div class="content-br"></div>
            <div class="save-info" v-if="hasPermission('CONFIG_UPDATE')"
              ><a-button type="primary" @click="saveSMSButton">保存</a-button></div
            >
          </a-tab-pane>
          <!-- 费用配置 -->
          <a-tab-pane tab="费用" key="cost">
            <div class="updata-content">
              <div class="content-title">费用配置</div>
            </div>
            <div class="content-br"></div>
            <BasicForm @register="registerCostForm" class="basic-form-style">
              <template #imgUrl="{ record }">
                <div style="display: flex">
                  <a-upload
                    name="avatar"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    :before-upload="beforeUpload"
                    @change="handleImgChange"
                  >
                    <div>
                      <plus-outlined />
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload>
                  <a-image class="preview" :width="102" :height="102" :src="src" />
                </div>
              </template>
            </BasicForm>
            <div class="content-br"></div>
            <div class="save-info" v-if="hasPermission('CONFIG_UPDATE')"
              ><a-button type="primary" @click="saveCostButton">保存</a-button></div
            >
            <a-modal v-model:visible="visible" title="更改图片" @ok="saveCostImg">
              <p style="margin: 10px"> 是否确定更改分佣推广图片？ </p>
            </a-modal>
          </a-tab-pane>
          <!-- 营销配置 -->
          <a-tab-pane tab="营销" key="marketing">
            <div class="updata-content">
              <div class="content-title">营销配置</div>
            </div>
            <div class="content-br"></div>
            <BasicForm @register="registerMarketingForm" class="basic-form-style" />
            <div class="content-br"></div>
            <div class="save-info" v-if="hasPermission('CONFIG_UPDATE')"
              ><a-button type="primary">保存</a-button></div
            >
          </a-tab-pane>
          <!-- 积分配置 -->
          <a-tab-pane tab="积分" key="accumulate">
            <div class="updata-content">
              <div class="content-title">积分配置</div>
            </div>
            <div class="content-br"></div>
            <BasicForm @register="registerAccumulateForm" class="basic-form-style" />
            <div class="content-br"></div>
            <div class="save-info" v-if="hasPermission('CONFIG_UPDATE')"
              ><a-button type="primary">保存</a-button></div
            >
          </a-tab-pane>
          <!-- 系统配置 -->
          <a-tab-pane tab="系统" key="system">
            <div class="updata-content">
              <div class="content-title">系统配置</div>
            </div>
            <div class="content-br"></div>
            <BasicForm @register="registerSystemForm" class="basic-form-style" />
            <div class="content-br"></div>
            <div class="save-info" v-if="hasPermission('CONFIG_UPDATE')"
              ><a-button type="primary" @click="saveSystemButton">保存</a-button></div
            >
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { BasicForm, useForm } from '/@/components/Form';
import {
  orderSchemas,
  SMSSchemas,
  CostSchemas,
  MarketingSchemas,
  AccumulateSchemas,
  SystemSchemas,
} from './base.data';
import { onMounted, ref } from 'vue';
import {
  orderTabInfo,
  saveOrderInfo,
  saveSMSInfo,
  SMSTabInfo,
  systemTabInfo,
  saveSystemInfo,
} from './base.api';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { OssUtils } from '/@/utils/ossUtils';
import { usePermission } from '/@/hooks/web/usePermission';
const ossUtils = new OssUtils();
const src = ref('');
const srcName = ref('');
const visible = ref(false);
const { hasPermission } = usePermission();
// 订单Form
const [registerOrderForm, { validate: orderValidate, setFieldsValue: orderFieldsValue }] = useForm({
  schemas: orderSchemas,
  labelWidth: 180,
  autoSubmitOnEnter: false,
  showActionButtonGroup: false,
});
// 订单Form
const [registerSMSForm, { validate: SMSValidate, setFieldsValue: SMSFieldsValue }] = useForm({
  schemas: SMSSchemas,
  labelWidth: 200,
  autoSubmitOnEnter: false,
  showActionButtonGroup: false,
});

// 费用Form
const [registerCostForm, { validate: CostValidate, setFieldsValue: CostFieldsValue }] = useForm({
  schemas: CostSchemas,
  labelWidth: 200,
  autoSubmitOnEnter: false,
  showActionButtonGroup: false,
});
// 营销Form
const [
  registerMarketingForm,
  { validate: marketingValidate, setFieldsValue: marketingFieldsValue },
] = useForm({
  schemas: MarketingSchemas,
  labelWidth: 200,
  autoSubmitOnEnter: false,
  showActionButtonGroup: false,
});
// 积分Form
const [
  registerAccumulateForm,
  { validate: accumulateValidate, setFieldsValue: accumulateFieldsValue },
] = useForm({
  schemas: AccumulateSchemas,
  labelWidth: 200,
  autoSubmitOnEnter: false,
  showActionButtonGroup: false,
});
// 系统Form
const [registerSystemForm, { validate: systemValidate, setFieldsValue: systemFieldsValue }] =
  useForm({
    schemas: SystemSchemas,
    labelWidth: 290,
    autoSubmitOnEnter: false,
    showActionButtonGroup: false,
  });
// 改变Tab时的回调
const changeTab = async (value) => {
  console.log(value);
  if (value === 'order') {
    orderTabInfo().then((res) => {
      orderFieldsValue({
        ...res,
      });
    });
  } else if (value === 'notify') {
    SMSTabInfo().then((res) => {
      SMSFieldsValue({
        ...res,
      });
    });
  } else if (value === 'cost') {
    orderTabInfo().then((res) => {
      CostFieldsValue({
        ...res,
      });
      src.value = ossUtils.getSignatureUrl(res.mamaSaleCommissionRateFileUrl);
    });
    systemTabInfo().then((res) => {
      CostFieldsValue({
        ...res,
      });
    });
  } else if (value === 'system') {
    systemTabInfo().then((res) => {
      systemFieldsValue({
        ...res,
      });
    });
  }
};
// 订单保存按钮事件
const saveOrderButton = async () => {
  let values = await orderValidate();
  saveOrderInfo(values)
    .then((res) => {
      if (!res?.message) {
        message.success('保存成功');
      } else {
        message.error(res?.message);
      }
    })
    .catch((error) => {
      message.error(error?.response?.data?.message);
    });
};
// SMS保存按钮事件
const saveSMSButton = async () => {
  let values = await SMSValidate();

  saveSMSInfo(values)
    .then((res) => {
      if (!res?.message) {
        message.success('保存成功');
      } else {
        message.error(res?.message);
      }
    })
    .catch((error) => {
      message.error(error?.response?.data?.message);
    });
};
// 费用保存按钮事件
const saveCostButton = async () => {
  let values = await CostValidate();
  if (values.mamaSaleCommissionRate < 0.00 || values.mamaSaleCommissionRate > 0.05) {
    message.warning('费率范围0~5%');
    return;
  }
  if (srcName.value != '') {
    visible.value = true;
  } else {
    saveSystemInfo(values);
    saveOrderInfo(values)
      .then((res) => {
        if (!res?.message) {
          message.success('保存成功');
        } else {
          message.error(res?.message);
        }
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
  }
};
const saveCostImg = async () => {
  let values = await CostValidate();
  values.mamaSaleCommissionRateFileUrl = srcName.value;
  saveOrderInfo(values)
    .then((res) => {
      if (!res?.message) {
        message.success('保存成功');
      } else {
        message.error(res?.message);
      }
      visible.value = false;
    })
    .catch((res) => {
      message.error(error?.response?.data?.message);
    });
};
// 系统保存按钮事件
const saveSystemButton = async () => {
  let values = await systemValidate();
  if(values?.organizationCreationLimitForOneVendo <= 0 || values?.shopCreationLimitForOneVendor <= 0 || values?.organizationApprovedLimitForAllVendors <= 0){
    return message.warning('请输入最小为1的数值')
  }
  if(values?.organizationApprovedLimitForAllVendors || values?.shopCreationLimitForOneVendor || values?.organizationCreationLimitForOneVendo){
    if(values?.organizationApprovedLimitForAllVendors?.indexOf('.') > -1 || values?.shopCreationLimitForOneVendor?.indexOf('.') > -1 || values?.organizationCreationLimitForOneVendo?.indexOf('.') > -1){
      return message.warning('请输入正整数')
    }
  }
  
  saveSystemInfo(values)
    .then((res) => {
      if (!res?.message) {
        message.success('保存成功');
      } else {
        message.error(res?.message);
      }
    })
    .catch((error) => {
      message.error(error?.response?.data?.message);
    });
};

// 第一次先加载订单信息
onMounted(async () => {
  await orderTabInfo().then(async (res) => {
    await orderFieldsValue({
      ...res,
    });
  });
});

const beforeUpload = () => {
  return false;
};

const handleImgChange = (value) => {
  let file = value.file;
  let dateUnixTime = new Date().getTime();
  let name = dateUnixTime + file.type.replace('image/', '.'); // '.jpeg'

  ossUtils.uploadFile(name, file).then((res) => {
    src.value = ossUtils.getSignatureUrl(res.name);
    srcName.value = res.name;
  });
};
</script>

<style scoped lang="less">
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-picture-card-wrapper {
  width: auto;
}
.content-br {
  border-bottom: 1px solid #ccc;
  width: 100vw;
}
.explain {
  margin: 0px 50px 20px;
}
.save-info {
  margin: 10px auto;
  width: 32px;
}
.basic-form-style {
  margin-top: 20px;
}
.updata-content {
  padding: 20px 20px 0 20px;
  // background: #f7f8fa;
  border-radius: 2px;

  .content-title {
    font-size: 16px;
    color: #222222;
    line-height: 21px;
    position: relative;
    padding-bottom: 20px;

    &::before {
      content: '';
      position: absolute;
      left: -14px;
      height: 21px;
      width: 4px;
      background-color: #c02235;
    }
  }
}
:deep(.ant-image-img) {
  width: 102px;
  height: 102px;
}
</style>
