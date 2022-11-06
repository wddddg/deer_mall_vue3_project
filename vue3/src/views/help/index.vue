<template>
  <div style="height: 100%">
    <div class="p-4 page-main-title">
      <div class="page-header row">
        <div class="col-6 logo flex_start">
          <img src="../../assets/images/header-text.png" alt="" style="height: 38px" />
        </div>
        <div class="col-6"></div>
      </div>
    </div>
    <div class="content scrollbar-item-y">
      <div class="page-content-top">
        <div class="title-item">
          <div style="font-size: 40px; padding-top: 60px; padding-bottom: 33px">帮助中心</div>
          <div class="search-item flex_between">
            <a-input
              style="height: 44px"
              allowClear
              v-model:value="searchValue"
              placeholder="请输入搜索内容"
              @pressEnter="searchList"
              @change="searchList"
            >
              <template #prefix>
                <search-outlined />
              </template>
            </a-input>
            <div class="action-btn bule" @click="searchList">搜索</div>
          </div>
        </div>
      </div>
      <div class="page-content flex_between-top">
        <div class="page-content-left-container flex_center-top">
          <div style="width: 160px">
            <div class="content-title">常见问题</div>
            <div>
              <a-menu
                style="width: 160px"
                mode="inline"
                :open-keys="openKeys"
                v-model:selectedKeys="selectedKeys"
                @select="onOpenChange"
              >
                <a-sub-menu :key="item.code" v-for="item in issuesList">
                  <template #title> {{ item.title }}</template>
                  <a-menu-item :key="it.code" v-for="it in item.subChildren">
                    {{ it.title }}
                  </a-menu-item>
                </a-sub-menu>
              </a-menu>
            </div>
          </div>
        </div>
        <div class="page-content-right-container">
          <div class="breadcrumb_navigation">
            <template v-if="isSearchMode">
              <template
                class="breadcrumb_navigation"
                v-for="(breadItem, index) in breadcrumb_navigation"
                :key="index"
              >
                <!-- <span v-if="index !== 0">{{ breadItem.title || '资产管理' }}</span> -->
                <span v-if="index != 0">&nbsp;>&nbsp;</span>
                <span v-if="index == 0" class="return-sup" @click="searchReturn">
                  {{ breadItem.title }}
                </span>
                <span v-if="index != 0" class="return-sup">
                  {{ breadItem.title }}
                </span>
              </template>
            </template>
            <template v-else>
              <template
                class="breadcrumb_navigation"
                v-for="(breadItem, index) in breadcrumb_navigation"
                :key="index"
              >
                <span v-if="index != 0">&nbsp;>&nbsp;</span>
                <span
                  v-if="index == 1"
                  class="return-sup"
                  @click="selectedSubItem(breadcrumb_navigation[0], breadcrumb_navigation[1])"
                >
                  {{ breadItem.title }}
                </span>
                <span v-if="index != 1" class="return-sup">
                  {{ breadItem.title }}
                </span>
              </template>
            </template>
          </div>
          <div class="scrollbar-item-y">
            <template v-if="selectedContentCode === ''">
              <div
                class="flex_between right-content-item"
                v-for="(item, index) in currentRightListData"
                :key="index"
                @click="selectedContentItem(item)"
              >
                <span class="_hover">{{ item.title }}</span>
                <span class="date_text">{{ item.date }}</span>
              </div>
            </template>
            <template v-else>
              <div class="page-template-container">
                <div class="template-title">{{ currentRightContentData.title }}</div>
                <div class="template-update-time">更新于 {{ currentRightContentData.date }}</div>
                <template v-for="(moduleItem, i) in currentRightContentData.moduleData">
                  <div class="template-module-content">
                    <div class="module-title">{{ i + 1 }}.{{ moduleItem.title }}</div>
                    <div v-if="moduleItem.subTitle" class="module-sub-title">{{
                      moduleItem.subTitle
                    }}</div>
                    <template v-for="(contentItem, index) in moduleItem.contentData">
                      <template v-if="contentItem.moduleType === 'TextModule'">
                        <!-- {{textData.class}} -->
                        <div class="module-text-item">
                          <template v-for="textItem in contentItem.content">
                            <span v-if="textItem.type === 'text'" :class="[textItem.class]">{{
                              textItem.title
                            }}</span>
                            <span
                              v-if="textItem.type === 'link'"
                              :class="[textItem.class]"
                              @="goToPageByUrl(textItem.url)"
                              >{{ textItem.title }}</span
                            >
                          </template>
                        </div>
                      </template>
                      <template v-if="contentItem.moduleType === 'TableModule'">
                        <div class="module-table-item">
                          <table style="width: 470px" :style="{ width: contentItem.widthLenght }">
                            <template v-for="(trItem, tri) in contentItem.content">
                              <tr :class="{ 'tr-header': tri === 0 }">
                                <td
                                  v-for="tdItem in trItem"
                                  :colspan="tdItem.colspan"
                                  :rowspan="tdItem.rowspan"
                                  :class="[tdItem.class]"
                                >
                                  {{ tdItem.title }}</td
                                >
                              </tr>
                            </template>
                          </table>
                        </div>
                      </template>
                      <template v-if="contentItem.moduleType === 'OrderedModule'">
                        <ul
                          class="module-ordered-list"
                          :style="{ 'list-style': contentItem.orderType }"
                        >
                          <li class="list-item" v-for="orderItem in contentItem.content">
                            <template v-for="textItem in orderItem">
                              <span v-if="textItem.type === 'text'" :class="[textItem.class]">{{
                                textItem.title
                              }}</span>
                              <span
                                v-if="textItem.type === 'link'"
                                :class="[textItem.class]"
                                @click="goToPageByUrl(textItem.url)"
                                >{{ textItem.title }}</span
                              >
                            </template>
                          </li>
                        </ul>
                      </template>
                      <template v-if="contentItem.moduleType === 'PictureModule'">
                        <div class="module-picture-item">
                          <template v-for="pictureItem in contentItem.content">
                            <img
                              class="picture_item"
                              :style="{ width: contentItem.width, height: contentItem.height }"
                              :src="pictureItem.url"
                            />
                          </template>
                        </div>
                      </template>
                    </template>
                  </div>
                </template>
              </div>
            </template>
          </div>
          <template v-if="isSearchMode">
            <div style="position: absolute; bottom: 10px; left: 40px"
              >符合搜索记录共：{{ currentRightListData.length }}条</div
            >
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { MenuBar, MoneyCollecting } from './data';

  const searchValue = ref('');
  const breadcrumb_navigation = ref([]);
  const issuesList = ref(MenuBar);
  const selectedFatherItemData = ref({}); // 被选中的父级标签
  const selectedSubItemData = ref({});
  const selectedSubCode = ref('MoneyCollecting');

  // 选中内容数据
  const contentData: any = ref(MoneyCollecting);
  const selectedContentCode = ref('');
  const currentRightListData = ref([]); // 三级列表
  const currentRightContentData = ref([]); // 三级内容

  const isSearchMode = ref(false);

  const selectedKeys = ref<string[]>(['MoneyCollecting']);
  const openKeys = ref<string[]>(['AssetManagement']);
  const onOpenChange = ({ item, key, selectedKeys }) => {
    console.log('click', item, key, selectedKeys);
    if (key == 'MoneyCollecting') {
      selectedSubItem(MenuBar[0], MenuBar[0].subChildren[0]);
    } else if (key == 'MoneyDivided') {
      selectedSubItem(MenuBar[0], MenuBar[0].subChildren[1]);
    } else {
      selectedSubItem(MenuBar[0], MenuBar[0].subChildren[2]);
    }
    // if (key == 'AssetManagement') {
    //   if (key == 'MoneyCollecting') {
    //     selectedSubItem(MenuBar[0], MenuBar[0].subChildren[0]);
    //   } else if (key == 'MoneyDivided') {
    //     selectedSubItem(MenuBar[0], MenuBar[1].subChildren[0]);
    //   } else {
    //     selectedSubItem(MenuBar[0], MenuBar[2].subChildren[0]);
    //   }
    // } else {
    //   // selectedSubItem(MenuBar[1], MenuBar[0].subChildren[0]);
    // }
  };

  // 选择菜单
  const selectedSubItem = (fatherItem, item) => {
    selectedSubCode.value = item.code;
    selectedFatherItemData.value = fatherItem;
    selectedSubItemData.value = item;
    breadcrumb_navigation.value = [];
    breadcrumb_navigation.value.push(fatherItem);
    breadcrumb_navigation.value.push(item);
    currentRightListData.value = [];
    currentRightListData.value = item.subChildren;
    selectedContentCode.value = '';
    // console.log('click', breadcrumb_navigation.value, item);
  };

  // 选择内容
  const selectedContentItem = (item) => {
    breadcrumb_navigation.value.push(item);
    selectedContentCode.value = item.code;
    // console.log(contentData.value, item.code);
    currentRightContentData.value = contentData.value[item.code];
    // console.log(item);
    console.log(currentRightContentData.value);
  };

  const searchList = () => {
    let value = searchValue.value.replace(/(^\s*)/g, '').toLowerCase(); // 去空格，英文转小写
    console.log(value);

    if (value === '') {
      issuesList.value = MenuBar; // 赋值回初始数据
      reset();
      return;
    }

    // issuesList = listChange(value, issuesList);
    breadcrumb_navigation.value = [];
    breadcrumb_navigation.value.push({ title: value });
    isSearchMode.value = true;
    selectedContentCode.value = '';
    contentChange(value);
  };

  const searchReturn = () => {
    if (breadcrumb_navigation.value.length <= 1) {
      return;
    }
    selectedContentCode.value = '';
    breadcrumb_navigation.value.splice(-1, 1);
  };

  //  模糊查询 内容查询
  const contentChange = (value) => {
    currentRightListData.value = [];
    for (const key in contentData.value) {
      if (Object.prototype.hasOwnProperty.call(contentData.value, key)) {
        const element = contentData.value[key];
        if (element.title.toLowerCase().indexOf(value) > -1) {
          currentRightListData.value.push(element);
        }
      }
    }
    console.log(currentRightListData.value);
  };
  // 文本跳转
  const goToPageByUrl = (url) => {
    window.open(url);
  };

  const reset = () => {
    let firstData = {};
    let secondData = {};
    for (let item of issuesList.value) {
      if (item.isShow) {
        item.isShowChildren = true;
        firstData = item;
        if (item.subChildren && item.subChildren.length > 0) {
          for (const second of item.subChildren) {
            if (second.isShow) {
              secondData = second;
              break;
            }
          }
          break;
        }
      }
    }
    console.log(firstData, secondData);

    isSearchMode.value = false;
    selectedSubItem(firstData, secondData); // 选中第一个
  };

  selectedSubItem(MenuBar[0], MenuBar[0].subChildren[0]); // 选中第一个

  // watch(
  //   () => searchValue,
  //   (val) => {
  //     searchValue.value = val || '';

  //     reset();
  //   },
  //   { immediate: true },
  // );
</script>
<style lang="less" scoped>
  .return-sup {
    cursor: pointer;
  }
  :deep(.ant-menu) {
    background: none;
    border: none;
  }
  :deep(.ant-menu-submenu-title) {
    padding-left: 0 !important;
  }
  :deep(.ant-menu-item) {
    padding-left: 20px !important;
  }
  :deep(.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected) {
    background: none !important;
  }

  :deep(.ant-menu-item::after) {
    display: none;
  }

  :deep(.ant-menu-item-selected) {
    color: #007bff;
  }
  :deep(.ant-menu-submenu-title:hover) {
    color: #007bff;
  }
  :deep(.ant-menu-item:hover) {
    color: #007bff;
  }
  :deep(.ant-menu-submenu-selected) {
    color: inherit;
  }

  .content-title {
    color: #000;
    font-size: 18px;
    font-weight: 700;
    width: 100%;
    margin-bottom: 15px;
  }
  .flex_between {
    display: flex;
    justify-content: space-between;
  }
  .page-main-title {
    height: 60px;
    width: 100%;
    margin: 0;
    background: #fff;
    box-shadow: 0 3px 6px rgb(0 0 0 / 8%);
    line-height: 60px;
    position: relative;
    z-index: 100;
    display: flex;
    align-items: center;
  }
  .content {
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    overflow-y: auto;
  }
  .page-content-top {
    background-image: url(/@/assets/images/help_bg.png);
    border-bottom: 1px solid #d9d9d9;
  }
  .title-item {
    height: 250px;
    width: 564px;
    margin-left: 450px;
    box-sizing: border-box;
  }
  .search-item {
    width: 564px;
    height: 44px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .action-btn {
    display: inline-block;
    padding: 0 8px;
    height: 32px;
    text-align: center;
    font-size: 14px;
    color: #000;
    border: 1px solid #d9d9d9;
    background-color: #fff;
    border-radius: 3px;
    cursor: pointer;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
  }
  .action-btn.bule {
    width: 80px;
    height: 100%;
    line-height: 44px;
    color: #fff;
    background: #007bff;
  }
  .page-content {
    height: calc(100% - 251px);
    display: flex;
    justify-content: space-between;
  }
  .breadcrumb_navigation {
    color: #888;
    font-size: 14px;
    line-height: 20px;
    padding-bottom: 30px;
    padding-top: 10px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .page-content-left-container {
    width: 400px;
    height: 100%;
    padding-top: 30px;
    display: flex;
    justify-content: center;
  }
  .page-content-right-container {
    width: calc(100% - 400px);
    height: 100%;
    background: #fff;
    padding: 30px 0 30px 40px;
    overflow: hidden;
    position: relative;
  }
  .breadcrumb_navigation span:last-child {
    color: #007bff;
    cursor: pointer;
  }
  .right-content-item {
    max-width: 1000px;
    padding: 0 20px 0 10px;
    line-height: 60px;
    border-bottom: 1px solid #f5f5f6;
    font-size: 18px;
    cursor: pointer;
    align-items: center;
    &:hover {
      color: #007bff !important;
    }
  }
  .date_text {
    font-size: 14px;
    color: #666;
  }
  // 模板盒子
  .page-template-container {
    width: 100%;
    padding-bottom: 100px;
    background-color: #fff;
    max-width: 1000px;
    padding-left: 10px;

    // 主标题
    .template-title {
      font-size: 30px;
      color: #333;
    }

    // 更新时间
    .template-update-time {
      font-size: 14px;
      color: #999999;
    }

    // 内容段落
    .template-module-content {
      padding-top: 40px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      color: #000000;
      text-align: start;
      line-height: 30px;

      &:first-child {
        padding-top: 30px;
      }

      // 段落标题
      .module-title {
        font-size: 20px;
        line-height: 26px;
        margin-bottom: 20px;
      }

      // 段落副标题、简述
      .module-sub-title {
        color: #000;
      }

      // 粗体文字
      .text-item-weight {
        font-weight: bold;
      }

      // 链接文本
      .text-item-link {
        color: #007bff;
        cursor: pointer;
        user-select: none;
      }

      // 段落文本模板
      .module-text-item {
        color: #000;
      }

      // 段落有序文本模板
      .module-ordered-list {
        color: #000000;
        margin: 0;
      }

      // 段落表格
      .module-table-item {
        margin-top: 20px;

        // 表格宽度自定义
        table {
          border-collapse: collapse;

          td {
            padding: 0 15px;
            border: 1px solid #e1e6f0;
            height: 38px;
            text-align: start;
          }

          .tr-header {
            td {
              background: rgba(245, 247, 250, 0.39);
            }
          }
        }
      }

      // 图片
      .module-picture-item {
        padding: 10px;
        box-sizing: border-box;
        text-align: start;
        overflow: hidden;
        align-items: center;
      }

      .picture_item {
        text-align: center;
        object-fit: scale-down;
        object-position: center;
      }
    }
  }

  .scrollbar-item-y {
    overflow-y: auto;
    width: 100%;
    height: 100%;
  }
  .font-color-FF5050 {
    color: #ff5050 !important;
  }

  .margin-top-30 {
    margin-top: 30px !important;
  }
</style>
