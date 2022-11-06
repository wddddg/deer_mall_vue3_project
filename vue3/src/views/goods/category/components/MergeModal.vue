<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="920"
    :min-height="600"
    :title="'合并分类'"
    :destroy-on-close="true"
    :can-fullscreen="false"
    :ok-text="'下一步'"
    :maskClosable="false"
    @ok="handleNext"
  >
    <div class="flex_between-top">
      <!-- 原分类 -->
      <div class="tree-container">
        <div class="tree-title">
          <span @click="showCategoryTreeNode('origin')">
            <span class="show-icon-container">
              <Icon v-if="originExoanded" icon="ant-design:caret-down-filled" />
              <Icon v-else icon="ant-design:caret-right-filled" />
            </span>
            原分类
          </span>
        </div>
        <div class="scrollbar-item-x" style="padding: 0 15px 10px">
          <a-tree
            checkable
            :multiple="false"
            :tree-data="originCategoryTreeNode"
            :expanded-keys="originExpandedKeys"
            v-model:checkedKeys="origincheckedList"
            @check="checkTree('origin')"
            @expand="onOriginExpand"
          />
        </div>
      </div>

      <!-- 中间图标 -->
      <div class="tree-icon-container">
        <div class="action-btn">
          <Icon icon="ant-design:right-outlined" />
        </div>
      </div>

      <!-- 目标分类 -->
      <div class="tree-container">
        <div class="tree-title">
          <span @click="showCategoryTreeNode('target')">
            <span class="show-icon-container">
              <Icon v-if="targetExoanded" icon="ant-design:caret-down-filled" />
              <Icon v-else icon="ant-design:caret-right-filled" />
            </span>
            目标分类
          </span>
        </div>
        <div class="scrollbar-item-x" style="padding: 0 15px 10px">
          <a-tree
            checkable
            :multiple="false"
            :tree-data="targetCategoryTreeNode"
            :expanded-keys="targetExpandedKeys"
            v-model:checkedKeys="targetcheckedList"
            @check="checkTree('target')"
            @expand="onTargetExpand"
          />
        </div>
      </div>
    </div>
  </BasicModal>

  <!-- 合并确认弹窗 -->
  <MergeOkModal @register="registerOkModal" @success="handleSuccess" />
</template>

<script setup lang="ts">
  import { message } from 'ant-design-vue';
  import { ref } from 'vue';
  import Icon from '/@/components/Icon';
  import { getProductCategoryList } from '../category.api.js';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useModal } from '/@/components/Modal';
  import MergeOkModal from './MergeOkModal.vue';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  const originExoanded = ref(true);
  const originCategoryTreeNode = ref([] as any[]);
  const originExpandedKeys = ref([] as (string | number)[]);
  const origincheckedList = ref([] as any[]); // 被选中的数据
  const targetExoanded = ref(true);
  const targetCategoryTreeNode = ref([] as any[]);
  const targetExpandedKeys = ref([] as (string | number)[]);
  const targetcheckedList = ref([] as any[]);
  const mergeProductCategoryTreeData = ref([] as any[]);

  // 表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('data =>', { ...data });

    // 初始化
    originExoanded.value = true;
    originCategoryTreeNode.value = [];
    originExpandedKeys.value = [];
    origincheckedList.value = [];
    targetExoanded.value = true;
    targetCategoryTreeNode.value = [];
    targetExpandedKeys.value = [];
    targetcheckedList.value = [];
    mergeProductCategoryTreeData.value = [];

    await getProductCategoryList({ name: '' }).then((res) => {
      mergeProductCategoryTreeData.value = res.productCategories;

      let nodes = formattingPermissionList(
        res.productCategories,
        1,
        true,
        originExpandedKeys.value,
      );
      if (originExpandedKeys.value.length > 0) {
        targetExpandedKeys.value.push(...originExpandedKeys.value);
      }
      originCategoryTreeNode.value = nodes;
      targetCategoryTreeNode.value = nodes;
    });

    setModalProps({ confirmLoading: false });
  });

  // 控制对应树展开、收起
  function showCategoryTreeNode(action) {
    if (action === 'origin') {
      originExoanded.value = !originExoanded.value;
      originExpandedKeys.value.splice(0);
      originCategoryTreeNode.value = formattingPermissionList(
        mergeProductCategoryTreeData.value,
        1,
        originExoanded.value,
        originExpandedKeys.value,
      );
    } else if (action === 'target') {
      targetExoanded.value = !targetExoanded.value;
      targetExpandedKeys.value.splice(0);
      targetCategoryTreeNode.value = formattingPermissionList(
        mergeProductCategoryTreeData.value,
        1,
        targetExoanded.value,
        targetExpandedKeys.value,
      );
    }
  }

  const onOriginExpand = (keys: string[]) => {
    originExpandedKeys.value = keys;
  };
  const onTargetExpand = (keys: string[]) => {
    targetExpandedKeys.value = keys;
  };

  const checkTree = (action) => {
    if (action === 'origin') {
      origincheckedList.value.length > 1 && origincheckedList.value.splice(0, 1);
    } else {
      targetcheckedList.value.length > 1 && targetcheckedList.value.splice(0, 1);
    }
  };

  /**
   * 数据结构更改后权限列表初始化
   * @param data 原数据
   * @param level 等级
   * @param isShow 展开控制
   */
  function formattingPermissionList(
    data: any[],
    level: number,
    isShow,
    expandedKeys: (string | number)[],
  ) {
    let nextLevel = level + 1;
    let arr = [] as any[];
    data.forEach((element: any) => {
      let item = {
        key: String(element.id),
        isSelectable: element.productAttachable, // 可以选择
        level: level,
      };
      isShow && expandedKeys.push(item.key);

      // 是否为末端
      if (element.productAttachable) {
        item['disableCheckbox'] = false; // 选择框
        item['selectable'] = false; // 文字选中
        item['disabled'] = false; // 禁用状态
      } else {
        item['disableCheckbox'] = true;
        item['selectable'] = false;
        item['disabled'] = true;
      }
      if (element.productCategories && element.productCategories.length !== 0) {
        item['expanded'] = isShow;
        item['title'] = element.name;
        item['children'] = formattingPermissionList(
          element.productCategories,
          nextLevel,
          isShow,
          expandedKeys,
        );
      } else {
        item['isLeaf'] = true;
        item['title'] = element.name;
      }
      arr.push(item);
    });

    return arr;
  }

  // 表单提交事件
  async function handleNext() {
    try {
      setModalProps({ confirmLoading: true });
      // 下一步
      if (origincheckedList.value && origincheckedList.value.length === 0) {
        message.error('请选择原分类');
        return;
      }
      if (targetcheckedList.value && targetcheckedList.value.length === 0) {
        message.error('请选择目标分类');
        return;
      }
      if (origincheckedList.value.length > 1 || targetcheckedList.value.length > 1) {
        message.error('数据异常，请关闭功能弹窗重试');
        return;
      }
      if (origincheckedList.value[0] === targetcheckedList.value[0]) {
        message.error('无法合并相同的分类，原分类和目标分类不能为同一个分类');
        return;
      }

      // getMergeProductCategoryData(); // 获取分类详情
      openModal(true, {
        origin: origincheckedList.value[0],
        target: targetcheckedList.value[0],
        mergeProductCategoryTreeData: mergeProductCategoryTreeData.value,
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  // -----------------弹窗相关功能-----------------
  const [registerOkModal, { openModal }] = useModal();
  /**
   * 成功回调
   */
  function handleSuccess() {
    //关闭弹窗
    closeModal();

    // 刷新列表
    emit('success');
  }
</script>

<style lang="less" scoped>
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
