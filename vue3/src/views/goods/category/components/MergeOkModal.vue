<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="920"
    :min-height="600"
    :title="'合并分类'"
    :destroy-on-close="true"
    :can-fullscreen="false"
    :ok-text="'确认合并属性'"
    :maskClosable="false"
    @ok="handleOk"
  >
    <div class="model-body" style="padding: 25px 25px 30px">
      <div class="flex_between-top">
        <!-- 原分类 -->
        <div class="merge-detail-container scrollbar-item-y">
          <div class="merge-detail-title"> 原分类 </div>
          <div class="merge-detail-content">{{ originDetailData.name || '-' }}</div>

          <div class="merge-detail-title"> 关联属性 </div>
          <div class="merge-detail-content flex_start_wrap">
            <div
              v-for="attribute in originDetailData.productAttributeConfigs"
              :key="attribute.productAttributeConfigId"
            >
              <span>
                {{ attribute.name }} ({{ formatFillZero(attribute.productAttributeConfigId) }})
              </span>
            </div>
          </div>

          <div class="merge-detail-title"> 关联商品数量 </div>
          <div class="merge-detail-content" style="padding: 10px 15px">
            {{ originDetailData.productQuantity || '0' }}
          </div>
        </div>
        <!-- 目标分类 -->
        <div class="merge-detail-container scrollbar-item-y">
          <div class="merge-detail-title"> 目标分类 </div>
          <div class="merge-detail-content">{{ targetDetailData.name || '-' }}</div>

          <div class="merge-detail-title"> 关联属性 </div>
          <div class="merge-detail-content flex_start_wrap">
            <div
              v-for="attribute in targetDetailData.productAttributeConfigs"
              :key="attribute.productAttributeConfigId"
            >
              <span>
                {{ attribute.name }} ({{ formatFillZero(attribute.productAttributeConfigId) }})
              </span>
            </div>
          </div>

          <div class="merge-detail-title"> 关联商品数量 </div>
          <div class="merge-detail-content">{{ targetDetailData.productQuantity || '0' }}</div>
        </div>
        <!-- 合并结果 -->
        <div class="merge-detail-container scrollbar-item-y">
          <div class="merge-detail-title"> 最终分类 </div>
          <div class="merge-detail-content">{{ mergeResultData.mergeName || '-' }}</div>

          <div class="merge-detail-title"> 关联属性 </div>
          <div class="merge-detail-content flex_start_wrap">
            <div
              v-for="attribute in mergeResultData.productAttributeConfigs"
              :key="attribute.productAttributeConfigId"
            >
              <span>
                {{ attribute.name }} ({{ formatFillZero(attribute.productAttributeConfigId) }})
              </span>
            </div>
          </div>

          <div class="merge-detail-title"> 关联商品数量 </div>
          <div class="merge-detail-content" style="padding: 10px 15px">
            {{ mergeResultData.productQuantity || '0' }}
          </div>

          <div class="merge-detail-title"> 移除分类 </div>
          <div class="merge-detail-content">{{ mergeResultData.removeName || '-' }}</div>
        </div>
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { message } from 'ant-design-vue';
  import { reactive, ref } from 'vue';
  import { getProductCategories, productCategoriesMerge } from '../category.api.js';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import * as _ from 'lodash';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  const originDetailData = ref({} as any);
  const targetDetailData = ref({} as any);
  const mergeProductCategoryTreeData = ref([] as any[]);
  const mergeResultData = reactive({
    // 合并结果
    mergeName: '',
    productAttributeConfigs: [] as any[],
    productQuantity: 0,
    removeName: '',
  });

  let sourceId = '';
  let targetId = '';

  // 表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('data =>', { ...data });

    mergeProductCategoryTreeData.value = data.mergeProductCategoryTreeData;
    sourceId = data.origin;
    targetId = data.target;
    await getMergeProductCategoryData(sourceId, targetId);

    setModalProps({ confirmLoading: false });
  });

  // 获取分类详情
  function getMergeProductCategoryData(origin, target) {
    let originData = new Promise((resolve, reject) => {
      getProductCategories(origin)
        .then((res) => resolve(res))
        .catch((error) => reject(error));
    });
    let targetData = new Promise((resolve, reject) => {
      getProductCategories(target)
        .then((res) => resolve(res))
        .catch((error) => reject(error));
    });

    return Promise.all([originData, targetData]).then((resData) => {
      console.log(resData);
      originDetailData.value = resData[0];
      targetDetailData.value = resData[1];

      // 格式化显示类型名称
      originDetailData.value.name = formatParentName(
        matchParentName(mergeProductCategoryTreeData.value, originDetailData.value.parentId),
        originDetailData.value.name,
      );
      targetDetailData.value.name = formatParentName(
        matchParentName(mergeProductCategoryTreeData.value, targetDetailData.value.parentId),
        targetDetailData.value.name,
      );

      // 合并后详情
      mergeResultData.mergeName = targetDetailData.value.name;
      mergeResultData.removeName = originDetailData.value.name;
      mergeResultData.productQuantity =
        Number(originDetailData.value.productQuantity) +
        Number(targetDetailData.value.productQuantity);
      mergeResultData.productAttributeConfigs = _.uniqBy(
        [
          ...targetDetailData.value.productAttributeConfigs,
          ...originDetailData.value.productAttributeConfigs,
        ],
        'productAttributeConfigId',
      );
      // 排重
    });
  }

  // 匹配父级分类名称
  function matchParentName(data, parentId) {
    console.log(parentId);

    let result = [] as any[];
    for (const item of data) {
      if (item.id === parentId) {
        result.push(item.name);
        break;
      } else if (item.productCategories && item.productCategories.length !== 0) {
        result = result.concat(matchParentName(item.productCategories, parentId));
        if (result.length !== 0) {
          result.push(item.name);
          break;
        }
      }
    }

    return result;
  }

  function formatParentName(parentNameArray: any[], name) {
    for (const parentName of parentNameArray) {
      name = parentName + '-' + name;
    }

    return name;
  }

  function formatFillZero(val) {
    return `${val}`.padStart(4, '0');
  }

  // 表单提交事件
  async function handleOk() {
    try {
      setModalProps({ confirmLoading: true });

      // 提交合并
      let reqData = {
        sourceId,
        targetId,
      };
      await productCategoriesMerge(reqData)
        .then((res) => {
          console.log('deleteProductCategoriesById.res =>', res);

          message.success('合并成功');
          //关闭弹窗
          closeModal();
          //刷新列表
          emit('success');
        })
        .catch((error) => {
          message.error(error?.response?.data?.message || '操作失败，请重试');
        });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped>
  .flex_start_wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }

  .merge-detail-title {
    padding-left: 20px;
    line-height: 40px;
    background: #f8f8f8;
    user-select: none;
  }

  .scrollbar-item-y {
    overflow-y: auto;

    // 滾動條
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 4px;
      /*高宽分别对应横竖滚动条的尺寸*/
      height: 10px;
    }

    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background-color: #bababa;
    }

    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px #f1f1f1;
      background: #f1f1f1;
      border-radius: 10px;
    }
  }

  .scrollbar-item-x {
    overflow-x: auto;

    // 滾動條
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 10px;
      /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background-color: #bababa;
    }

    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px #f1f1f1;
      background: #f1f1f1;
      border-radius: 10px;
    }
  }

  .merge-detail-container {
    height: 600px;
    width: 400px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
    min-height: 380px;
    max-height: 500px;
    width: 300px;
    overflow-y: auto !important;
  }

  .merge-detail-content {
    padding: 15px;
    line-height: 20px;
    column-gap: 15px;
    color: #000;
  }

  // 操作按钮
  .action-btn {
    display: inline-block;
    padding: 0 8px;
    // width: 82px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: #000;
    border: 1px solid #d9d9d9;
    background-color: #fff;
    border-radius: 3px;
    cursor: pointer;
    user-select: none !important;

    &.red {
      border: 1px solid #c02235;
      background-color: #c02235;
      color: #fff;

      &:active {
        border: 1px solid #b62133;
        background-color: #b62133;
      }
    }

    // 禁用
    &.gray {
      border: 1px solid #b8b8b8;
      background-color: #b8b8b8;
      color: #fff;
      cursor: default;
    }

    &:active {
      background: #ededed;
      -webkit-transition-duration: 0;
      transition-duration: 0;
      -webkit-box-shadow: 0 0 0 2px #ededed, 0 0 0 4px #ededed;
      box-shadow: 0 0 0 2px #ededed, 0 0 0 4px #ededed;
    }
  }

  .show-icon-container {
    display: inline-block;
    font-size: 12px;
    color: #999999;
    width: 17px;
    padding-right: 5px;
    text-align: start;
    box-sizing: border-box;
    vertical-align: top;
  }

  .flex_between-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .tree-container {
    height: 600px;
    width: 400px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
  }

  .tree-title {
    padding-left: 20px;
    line-height: 40px;
    background: #f8f8f8;
    user-select: none;
  }

  .tree-icon-container {
    width: 80px;
    flex-shrink: 0;
    height: 100%;
    text-align: center;
    margin: auto 0;

    .action-btn {
      width: 30px;
    }
  }

  .scrollbar-item-x {
    overflow-x: auto;
    height: calc(100% - 40px);

    // 滾動條
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 0;
      /*高宽分别对应横竖滚动条的尺寸*/
      height: 0px;
    }

    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background-color: #fff;
    }

    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      // box-shadow: inset 0 0 5px #f1f1f1;
      background: #fff;
      // border-radius: 10px;
    }
  }
</style>
