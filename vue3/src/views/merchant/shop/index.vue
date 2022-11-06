<template>
  <BasicTable @register="registerTable">
    <template #action="{ record }">
      <a-dropdown>
        <a class="ant-dropdown-link">更多 <Icon icon="ant-design:down-outlined" /> </a>
        <template #overlay>
          <a-menu class="antd-more">
            <a-menu-item v-if="hasPermission('SHOP_MAMA_OPERATION_UPDATE')">
              <a @click="handleStatus(record, '1')">设置运营方式</a>
            </a-menu-item>
            <a-menu-item
              v-if="
                record.mamaOwned &&
                !record.mamaOperated &&
                hasPermission('SHOP_MAMA_OPERATION_UPDATE')
              "
            >
              <a @click="handleStatus(record, '2')">取消自营店铺</a>
            </a-menu-item>
            <a-menu-item
              v-if="
                !record.mamaOwned &&
                record.mamaOperated &&
                hasPermission('SHOP_MAMA_OPERATION_UPDATE')
              "
            >
              <a @click="handleStatus(record, '3')">取消代运营店铺</a>
            </a-menu-item>
            <a-menu-item v-if="record.testOnly && hasPermission('SHOP_MAMA_UPDATE_TEST')">
              <a @click="handleStatus(record, '4')">取消测试店铺</a>
            </a-menu-item>
            <a-menu-item v-if="!record.testOnly && hasPermission('SHOP_MAMA_UPDATE_TEST')">
              <a @click="handleStatus(record, '5')">设为测试店铺</a>
            </a-menu-item>
            <a-menu-item v-if="hasPermission('SHOP_STATUS_UPDATE')">
              <a @click="handleStatus(record, '6')">店铺状态变更</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
    <template #shopName="{ record }">
      <span class="test-remark" v-if="record.testOnly">测</span>
      <span class="link" @click="goShopDetail(record)">{{ record.name }}</span>
    </template>
  </BasicTable>
  <a-modal v-model:visible="modalVisible" :title="title" @ok="handleOk" @cancel="handCancel">
    <div class="modalContent" v-if="seletctKey === '1'">
      <a-form
        :model="wayForm"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
      >
        <a-form-item
          label="店铺运营方式"
          name="mamaOwned"
          :rules="[{ required: true, message: '请选择' }]"
        >
          <a-radio-group v-model:value="wayForm.mamaOwned">
            <a-radio :value="true">自营店铺</a-radio>
            <a-radio :value="false">代运营店铺</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          v-if="!wayForm.mamaOwned"
          label="店铺代运营收取费率"
          name="mamaOperatedCommissionRate"
          :rules="[{ required: true, message: '请输入' }]"
        >
          <a-input
            v-model:value="wayForm.mamaOperatedCommissionRate"
            style="width: 200px; margin-right: 12px"
          />
          <span style="margin-right: 12px">%</span>
          <a-tooltip color="#FFF">
            <template #title>
              <div style="color: #000">
                平台收取商家的总服务费率 = 商品费率 + 店铺代运营收取费率
              </div>
            </template>
            <Icon size="18" color="#D1D1D1" icon="ant-design:question-circle-filled"> </Icon>
          </a-tooltip>
        </a-form-item>
      </a-form>
    </div>
    <div class="modalContent" v-if="seletctKey === '2'">
      <div class="first">是否确定取消其自营店铺资格？ </div>
      <div class="second"> 一旦店铺被取消自营资格，店铺代售商品将全部下架。</div>
    </div>
    <div class="modalContent" v-if="seletctKey === '3'">
      <div class="first">是否确定取消其代运营店铺？ </div>
      <div class="second"> 一旦店铺被取消代运营资格，店铺代运营收取费率将变为0</div>
    </div>
    <div class="modalContent" v-if="seletctKey === '4'">
      <div class="first">是否确定取消其测试店铺资格？ </div>
    </div>
    <div class="modalContent" v-if="seletctKey === '5'">
      <div class="first">
        店铺设置为测试店铺后，仅限消费者为测试员身份的用户才可查看本店铺商品。
      </div>
      <div class="first"> 是否设置为测试店铺？</div>
    </div>
    <div class="modalContent" v-if="seletctKey === '6'">
      <a-form
        :model="wayForm"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
      >
        <a-form-item
          label="店铺状态变更"
          name="statusCode"
          :rules="[{ required: true, message: '请选择' }]"
        >
          <a-radio-group v-model:value="wayForm.statusCode">
            <!-- // 待营业、营业中、店铺异常 -->
            <a-radio
              value="SHOP_STATUS_PAUSE"
              v-if="
                selectRecord?.statusCode === 'SHOP_STATUS_CLOSED' ||
                selectRecord?.statusCode === 'SHOP_STATUS_OPEN'
              "
              >暂停营业</a-radio
            >
            <!-- 营业中 、 已关闭 -->
            <a-radio
              value="SHOP_STATUS_CLOSED"
              v-if="
                selectRecord?.statusCode === 'SHOP_STATUS_WAIT_OPEN' ||
                selectRecord?.statusCode === 'SHOP_STATUS_OPEN' ||
                selectRecord?.statusCode === 'SHOP_STATUS_PAUSE'
              "
              >关闭店铺</a-radio
            >
            <!-- 店铺异常、已关闭 -->
            <a-radio
              value="SHOP_STATUS_OPEN"
              v-if="
                selectRecord?.statusCode === 'SHOP_STATUS_PAUSE' ||
                selectRecord?.statusCode === 'SHOP_STATUS_CLOSED'
              "
              >重启店铺</a-radio
            >
          </a-radio-group>
        </a-form-item>

        <a-form-item
          label="变更原因说明"
          name="statusUpdateRemark"
          :rules="[{ required: true, message: '请输入' }]"
        >
          <a-textarea v-model:value="wayForm.statusUpdateRemark" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script lang="ts" name="shop" setup>
  import { message } from 'ant-design-vue';
  import { ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getBasicColumns, getFormConfig } from './shop.data';
  import { shopList, updateShopInfo } from './shop.api';
  // import { useRouter } from 'vue-router';
  import Icon from '/@/components/Icon';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import Big from 'big.js';
  const { hasPermission } = usePermission();
  const go = useGo();
  // const router = useRouter();
  let modalVisible = ref(false);
  let title = ref('');
  let selectRecord = ref({});
  let seletctKey = ref('');
  let wayForm = ref({
    mamaOwned: true,
    mamaOperated: false,
    mamaOperatedCommissionRate: '',
    statusCode: '',
    statusUpdateRemark: '',
  });
  const [registerTable, { reload }] = useTable({
    // title: '开启搜索区域',
    api: shopList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
    },
    // 请求之前对参数做处理
    beforeFetch(params) {
      params.offset = params.offset - 1;
      params.mamaOwned = params.operationList === 'mamaOwned' ? true : null;
      params.mamaOperated = params.operationList === 'mamaOperated' ? true : null;
    },
    fetchSetting: {
      // 传给后台的当前页字段
      pageField: 'offset',
      // 传给后台的每页显示多少条的字段
      sizeField: 'limit',
      // 接口返回表格数据的字段
      listField: 'shops',
      // 接口返回表格总数的字段
      totalField: 'totalCount',
    },
    rowKey: 'id',
  });
  const goShopDetail = (record) => {
    if (!hasPermission('SHOP_DETAIL_GET')) {
      return;
    }
    go('/merchant/basic/shopDetail/' + record.id);
  };
  const handleStatus = (record, key) => {
    switch (key) {
      case '1':
        title.value = '设置运营方式';
        wayForm.value.mamaOwned = record.mamaOwned;
        wayForm.value.mamaOperated = record.mamaOperated;
        record.mamaOwned || record.mamaOperated ? '' : (wayForm.value.mamaOwned = true);
        wayForm.value.mamaOperatedCommissionRate = !checkValueOfEmpty(
          record.mamaOperatedCommissionRate,
        )
          ? Number(new Big(record.mamaOperatedCommissionRate).times(100)).toString()
          : '';
        console.log(wayForm.value, record.mamaOperatedCommissionRate);
        break;
      case '2':
        title.value = '自营店铺设置';
        break;
      case '3':
        title.value = '自营店铺设置';
        break;
      case '4':
        title.value = '测试店铺设置';
        break;
      case '5':
        title.value = '测试店铺设置';
        break;
      case '6':
        title.value = '店铺状态变更';
        break;
      default:
        return;
    }
    selectRecord.value = record;
    seletctKey.value = key;
    modalVisible.value = true;
  };
  // 空值测试
  function checkValueOfEmpty(value) {
    if (value !== '' && value !== undefined && value !== null) {
      return false;
    }
    return true;
  }
  const handCancel = () => {
    wayForm.value.mamaOwned = false;
    wayForm.value.mamaOperated = false;
    wayForm.value.mamaOperatedCommissionRate = '';
    wayForm.value.statusCode = '';
    wayForm.value.statusUpdateRemark = '';
    modalVisible.value = false;
  };
  const handleOk = () => {
    let params = {};
    if (seletctKey.value === '1') {
      if (!wayForm.value.mamaOwned && !wayForm.value.mamaOperatedCommissionRate) {
        message.error('请输入店铺代运营收取费率！');
        return;
      }
      console.log(
        Number(wayForm.value.mamaOperatedCommissionRate),
        Number(wayForm.value.mamaOperatedCommissionRate) <= 0,
        Number(wayForm.value.mamaOperatedCommissionRate) <= 15,
      );
      if (
        (Number(wayForm.value.mamaOperatedCommissionRate) < 0 ||
          Number(wayForm.value.mamaOperatedCommissionRate) > 15) &&
        !wayForm.value.mamaOwned
      ) {
        message.error('费率范围0~15%');
        return;
      }
      params = {
        id: selectRecord.value?.id,
        mamaOwned: wayForm.value.mamaOwned,
        mamaOperated: wayForm.value.mamaOwned ? false : true,
        mamaOperatedCommissionRate: Number(wayForm.value.mamaOperatedCommissionRate) / 100,
      };
    } else if (seletctKey.value === '2') {
      //取消自营
      params = {
        id: selectRecord.value?.id,
        mamaOwned: false,
        mamaOperated: false,
      };
    } else if (seletctKey.value === '3') {
      //取消代运营
      params = {
        id: selectRecord.value?.id,
        mamaOwned: false,
        mamaOperated: false,
        mamaOperatedCommissionRate: '',
      };
    } else if (seletctKey.value === '4') {
      // 取消测试
      params = {
        id: selectRecord.value?.id,
        testOnly: false,
      };
    } else if (seletctKey.value === '5') {
      // 设为测试
      params = {
        id: selectRecord.value?.id,
        testOnly: true,
      };
    } else {
      if (!wayForm.value.statusCode) {
        message.error('请选择状态变更');
        return;
      }
      if (!wayForm.value.statusUpdateRemark) {
        message.error('请输入变更原因说明！');
        return;
      }

      params = {
        id: selectRecord.value?.id,
        statusCode: wayForm.value.statusCode,
        statusUpdateRemark: wayForm.value.statusUpdateRemark,
      };
    }
    updateShopInfo(params.id, params).then(() => {
      message.success('修改成功');
      wayForm.value.mamaOwned = false;
      wayForm.value.mamaOperated = false;
      wayForm.value.mamaOperatedCommissionRate = '';
      wayForm.value.statusCode = '';
      wayForm.value.statusUpdateRemark = '';
      modalVisible.value = false;
      reload();
    });
  };
</script>
<style scoped lang="less">
  .link {
    cursor: pointer;
    &:hover {
      color: #007bff;
    }
  }
  .modalContent {
    min-height: 100px;
    padding: 30px;
    color: #838681;
    .first {
      margin-bottom: 10px;
    }
  }
  .ant-dropdown-link {
    cursor: pointer;
  }
  .test-remark {
    display: inline-block;
    padding: 2px 4px;
    line-height: 16px;
    font-size: 12px;
    color: #fff;
    background: #ff4700 !important;
    border-radius: 2px;
    margin-right: 5px;
  }
</style>
