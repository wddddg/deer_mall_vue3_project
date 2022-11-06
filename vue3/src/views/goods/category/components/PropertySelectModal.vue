<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="1000"
    :min-height="560"
    title="选择属性"
    :can-fullscreen="false"
    :destroy-on-close="true"
    @ok="handleOk"
  >
    <div class="flex_start_top">
      <!-- 属性库 -->
      <div class="attribute-list-container">
        <div class="flex_start list-title-container">
          <div class="title">属性库</div>
          <div class="search">
            <a-input
              type="text"
              v-model:value="searchAttributeData.name"
              @change="inputAttributeName()"
              placeholder="搜索属性名称"
            />
          </div>
        </div>
        <div
          class="table-container"
          style="height: auto; padding-right: 4px; background-color: #f7f7f7"
        >
          <table>
            <thead>
              <tr>
                <th style="width: 80px" class="table-first-td">编号</th>
                <th style="width: 120px">属性名称</th>
                <th style="width: 120px">属性类型</th>
                <th>备注</th>
              </tr>
            </thead>
          </table>
        </div>
        <div
          class="table-container scrollbar-item-y"
          style="max-height: 450px"
          @scroll="getAttributeScroll"
        >
          <table>
            <tbody>
              <template v-for="item in attributeDataList" :key="item.id">
                <tr @click="item.isSelect = !item.isSelect" :class="{ _selected: item?.isSelect }">
                  <td style="width: 80px" class="table-first-td">{{ item?.id }}</td>
                  <td style="width: 120px">{{ item?.name }}</td>
                  <td style="width: 120px">{{ item?.type?.name }}</td>
                  <td>{{ item.remark }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="attribute-action-container">
        <div class="action-btn" @click="updateSelectedList('add')">
          <Icon icon="ant-design:right-outlined" />
        </div>
        <div class="action-btn" @click="updateSelectedList('del')">
          <i nz-icon nzType="left" nzTheme="outline"></i>
          <Icon icon="ant-design:left-outlined" />
        </div>
      </div>

      <!-- 已选中 -->
      <div class="attribute-list-container">
        <div class="flex_start list-title-container">
          <div class="title">已选中</div>
        </div>
        <div
          class="table-container"
          style="height: auto; padding-right: 4px; background-color: #f7f7f7"
        >
          <table>
            <thead>
              <tr>
                <th style="width: 80px" class="table-first-td">编号</th>
                <th style="width: 120px">属性名称</th>
                <th style="width: 120px">属性类型</th>
                <th>备注</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="table-container scrollbar-item-y" style="max-height: 450px">
          <table>
            <tbody>
              <template v-for="item in attributeSelectListData" :key="item.id">
                <tr @click="item.isSelect = !item.isSelect" :class="{ _selected: item?.isSelect }">
                  <td style="width: 80px" class="table-first-td">{{ item?.id }}</td>
                  <td style="width: 120px">{{ item?.name }}</td>
                  <td style="width: 120px">{{ item?.type?.name }}</td>
                  <td>{{ item.remark }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import Icon from '/@/components/Icon';
  import { message } from 'ant-design-vue';
  import { getProductAttributeList } from '../category.api';
  import { reactive, ref, toRaw } from 'vue';
  import * as _ from 'lodash';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  let searchAttributeTimes = 0;
  let scrollAttributeTimes = 0;

  // 传递过来的响应式数据列表
  let attributeData = null as any;

  // 属性列表
  const attributeDataList = ref([] as any[]);
  // 属性列表总数
  const attributeDataListTotalCount = ref(0);
  const searchAttributeData = reactive({
    limit: 10, // 每页显示数量
    offset: 0, // 当前页码
    name: '',
  });
  // 被选中的列表
  const attributeSelectListData = ref([] as any[]);

  // 表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: true });
    console.log('data =>', data);

    // 传递过来的响应式数据列表
    attributeData = data.attributeData;

    // 初始化
    attributeDataList.value = []; // 属性列表
    attributeDataListTotalCount.value = 0; // 属性列表总数
    searchAttributeData.limit = 10; // 每页显示数量
    searchAttributeData.offset = 0; // 当前页码
    searchAttributeData.name = '';
    attributeSelectListData.value = []; // 被选中的列表

    await getAttributeList(toRaw(searchAttributeData), true);

    // 重置表单
    setModalProps({ confirmLoading: false });
  });

  // 搜索框加载
  const inputAttributeName = () => {
    searchAttributeTimes && clearTimeout(searchAttributeTimes);
    searchAttributeTimes = window.setTimeout(() => {
      searchAttributeData.offset = 0; // 页码重置
      attributeDataList.value = []; // 清空数据
      getAttributeList();
      clearTimeout(searchAttributeTimes);
    }, 600);
  };

  // 初始化选中属性框结构
  const initAttributeData = (data: any[]) => {
    data.forEach((item) => {
      item['isSelect'] = false;
      // 当前是否存在或选中
      item['mandatoryField'] = item['mandatoryField'] ? true : false;
    });

    return data;
  };

  // 属性列表
  const getAttributeList = async (reqData = toRaw(searchAttributeData), init = false) => {
    setModalProps({ confirmLoading: true });
    await getProductAttributeList(reqData)
      .then((res) => {
        console.log(res);

        if (res.productAttributeConfigs && res.productAttributeConfigs.length !== 0) {
          attributeDataList.value = attributeDataList.value.concat(
            initAttributeData(res.productAttributeConfigs),
          );
        }
        attributeDataListTotalCount.value = Number(res.totalCount);
        // 弹窗初始化
        if (init) {
          if (attributeData.productAttributeConfigs?.length > 0) {
            let addArr = [] as any[];
            attributeData.productAttributeConfigs.forEach((item) => {
              addArr.push({
                id: item.productAttributeConfigId,
                name: item.name,
                remark: item.remark,
                type: item.type,
                isSelect: false,
                mandatoryField: item.mandatoryField,
              });
              // 被选中赋值
              attributeSelectListData.value = deepCopy(addArr);
            });
          }
        }

        setModalProps({ confirmLoading: false });
      })
      .catch((error) => {
        console.error('getProductAttributeList.error =>', error);

        setModalProps({ confirmLoading: false });
        message.error(error?.response?.data?.message || '加载属性列表失败，请刷新');
      });
  };

  // 深度複製 破壞儲存內存
  const deepCopy = (data) => {
    return JSON.parse(JSON.stringify(data));
  };

  // 加载下一页
  const getAttributeScroll = (event) => {
    console.log(event.target);
    // console.log(event);
    // console.log(event.target.scrollTop);
    // console.log(event.target.scrollHeight);
    const scrollY = event.target.scrollTop; // 滚动的距离
    const clientHeight = event.target.clientHeight; // 高度
    const scrollHeight = event.target.scrollHeight; // 滚动条高度
    if (
      clientHeight + scrollY >= scrollHeight &&
      Number(attributeDataListTotalCount.value) > attributeDataList.value.length
    ) {
      scrollAttributeTimes && clearTimeout(scrollAttributeTimes);
      scrollAttributeTimes = window.setTimeout(() => {
        searchAttributeData.offset++; // 页码+1
        getAttributeList(); // 获取数据
        clearTimeout(scrollAttributeTimes);
      }, 600);
    } else {
      clearTimeout(scrollAttributeTimes);
    }
  };

  // 获取 isSelect=true 选中项
  const matchSelectedAttributeItem = (data: any[]) => {
    let result = [] as any[];
    data.forEach((item) => {
      if (item.isSelect) {
        result.push(item);
      }
    });

    return result;
  };

  // 选中项操作 - 更新属性选中框状态 (左右箭头)
  const updateSelectedList = (action) => {
    console.log(action);
    switch (action) {
      case 'add':
        let addData = [] as any[];
        const matchData = matchSelectedAttributeItem(attributeDataList.value);
        matchData.forEach((element) => {
          let result = true;
          for (const item of attributeSelectListData.value) {
            if (item.id === element.id) {
              result = false;
              break;
            }
          }
          if (result) {
            addData.push(element);
          }
        });
        if (addData && addData.length !== 0) {
          addData = _.uniqBy(addData, 'id'); // 排重
          attributeSelectListData.value = deepCopy(
            initAttributeData(attributeSelectListData.value.concat(addData)),
          );
        }
        // 清空选择
        attributeDataList.value = initAttributeData(attributeDataList.value);
        break;
      case 'del':
        let delIndex = [] as number[];
        attributeSelectListData.value.forEach((item, index) => {
          if (item.isSelect) {
            delIndex.push(index);
          }
        });
        console.log(delIndex);
        if (delIndex && delIndex.length !== 0) {
          delIndex.forEach((item, index) => {
            attributeSelectListData.value.splice(item - index, 1);
          });
        }
        break;
    }
  };

  // 初始化属性设置结构
  const initAttributeConfigData = (data: any[]) => {
    let result = [] as any[];
    console.log('更新', data);
    data.forEach((item) => {
      let initData = {
        id: null,
        productAttributeConfigId: item.id,
        name: item.name,
        remark: item.remark,
        type: item.type,
        // 是否必填
        mandatoryField: item.mandatoryField,
      };
      result.push(initData);
    });
    console.log(result);

    return result;
  };

  // 提交
  async function handleOk() {
    try {
      if (attributeSelectListData.value && attributeSelectListData.value.length === 0) {
        message.error('请选择属性');
        return;
      }
      setModalProps({ confirmLoading: true });

      // 排重
      attributeSelectListData.value = _.uniqBy(attributeSelectListData.value, 'id');

      // // 更新数据
      // if (attributeData) {
      //   attributeData.productAttributeConfigs = deepCopy(
      //     initAttributeConfigData(attributeSelectListData.value),
      //   );
      // }

      //关闭弹窗
      closeModal();

      //刷新列表
      emit('success', deepCopy(initAttributeConfigData(attributeSelectListData.value)));
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style scoped lang="less">
  .flex_start_top {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .flex_start {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .scrollbar-item-y {
    overflow-y: scroll;

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

  // 页面table
  .table-container {
    border-radius: 5px 5px 5px 5px;
    height: 100%;
    background-color: #fff;
    position: relative;

    table {
      width: 100%;
      // height: 100%;
      text-align: left;
      border-radius: 5px;
      // overflow: hidden;
      font-size: 14px;
      font-weight: 400;

      th {
        font-weight: 400;
      }

      &._has-tab {
        border-radius: 0 5px 5px 5px;
      }

      thead > tr {
        height: 51px;
        background-color: #f8f8f8;

        th {
          padding: 0 3px;
          color: #83868e;
          font-size: 14px;
          line-height: 45px;
          user-select: none;
          position: relative;

          // &:first-child {
          //     padding-left: 20px;
          // }
          // &[appDynamicColumnWidth]::after {
          //     top: 25%;
          //     right: 7px;
          //     position: absolute;
          //     content: " ";
          //     width: 2px;
          //     height: 50%;
          //     background-color: #F8F8F8;
          // }

          &:hover[appDynamicColumnWidth]::after {
            top: 25%;
            right: 20px;
            position: absolute;
            content: ' ';
            width: 2px;
            height: 50%;
            background-color: #f8f8f8;
            background-color: #22242f !important;
          }
        }
      }

      tbody {
        // min-height: 600px;
        tr {
          height: 45px;
          // background-color: #fff;
          border-bottom: 1px solid #f2f2f2;

          td {
            padding: 0 3px;
            // line-height: 37px;
            font-size: 14px;
            color: #4f4f4f;
            height: 45px;

            div.tdValue {
              // height: 100%;
              width: 100%;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }

            .tag-box {
              display: inline-block;
              padding: 2px 4px;
              line-height: 16px;
              font-size: 12px;
              color: #fff;
              background: #ff4700 !important;
              border-radius: 2px;
              margin-right: 5px;
            }

            // &:first-child {
            //     padding-left: 20px;
            // }

            ._hide-action {
              display: none;
              font-size: 20px;
              color: #a7a7a7;
            }

            ._active {
              display: block !important;
            }
          }

          // &:nth-child(2n) {
          //     background: #F8F8F8;
          // }

          &:hover {
            background-color: #f5f7f9 !important;

            .menu-container .action_icon {
              color: #0070cc !important;
            }

            td ._show-action {
              display: block !important;
            }
          }

          &.active_bg {
            background-color: #f5f7f9 !important;
          }
        }
      }

      tfoot tr {
        background-color: #fff;

        td {
          padding: 30px 0;

          // line-height: 80px;
          .footer-total-container,
          .footer-pagination-container {
            padding: 0 30px;
          }
        }
      }

      // table 操作按钮
      .action-container {
        .action-item {
          font-size: 14px;
          padding: 0 8px;
          cursor: pointer;
          color: #007bff !important;

          &._disable {
            color: #d1d3d7 !important;
            cursor: not-allowed;
          }

          &:first-child {
            padding-left: 0;
          }

          &:last-child {
            padding-right: 0;
          }
        }
      }
    }

    .table-foot-container {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 30px 0;
      background-color: #fff;

      .footer-total-container,
      .footer-pagination-container {
        padding: 0 30px;
      }

      .footer-total-container {
        color: #999;
      }
    }
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

  // 属性选择框
  .attribute-list-container {
    width: 450px;
    height: 550px;
    border: solid #e2e2e2 1px;
    border-radius: 4px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);

    .list-title-container {
      height: 50px;
      padding: 5px 0 10px 20px;

      .title {
        flex-shrink: 0;
        font-size: 14px;
      }

      .search {
        padding: 0 15px;
        width: 100%;
      }
    }

    .table-container {
      table {
        .table-first-td {
          padding-left: 15px;
        }

        tr._selected {
          background-color: #dbebfd;
        }
      }
    }
  }

  .attribute-action-container {
    width: 100px;
    flex-shrink: 0;
    height: 100%;
    text-align: center;
    margin: auto 0;

    .action-btn {
      margin: 30px 0;
      width: 66px;

      &:hover {
        border: 1px solid #c02235;
        background-color: #c02235;
        color: #fff;
      }
    }
  }
</style>
