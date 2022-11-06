<!--
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-24 22:44:00
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-26 12:36:20
-->
<template>
  <a-row :gutter="10">
    <a-col :xl="24" :lg="24" :md="24" :sm="24" style="flex: 1">
      <!-- 基本信息 -->
      <div class="updata-content">
        <div class="content-title">基本信息</div>
        <div class="content-other">
          <a-row class="flex-1">
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">昵称：</div>
                <div class="item-value"> {{ acoountInfo?.nickName }} </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">所属店铺：</div>
                <div class="item-value"> {{ acoountInfo?.shopName }} </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">账号类型：</div>
                <div class="item-value">{{ acoountInfo?.admin ? '店主' : '店员' }}</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">账号状态：</div>
                <div class="item-value">
                  {{ acoountInfo?.enabled ? '使用中' : '已停用' }}
                </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">角色：</div>
                <div class="item-value">{{ getRoleString(acoountInfo) }}</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">账号：</div>
                <div class="item-value">{{ acoountInfo?.mobile }}</div>
              </div>
              <div class="item-desc">员工使用该联系电话作为帐号即可登录收藏鹿商家端</div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="updata-content">
        <BasicTree
          ref="treeRef"
          :checkable="false"
          toolbar
          :treeData="permissionList"
          :checkStrictly="true"
          :clickRowToExpand="true"
          title="所拥有的的权限"
        />
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref, nextTick } from 'vue';
  import { accountPremisionList } from './accountList.api';
  import { useMerchantStore } from '/@/store/modules/merchant';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree';
  import { cloneDeep } from 'lodash-es';

  import { useRouter } from 'vue-router';
  const { currentRoute } = useRouter();
  const { params } = unref(currentRoute);
  const { path } = params;
  console.log(path, 'path');

  const merchantStore = useMerchantStore();
  const treeRef = ref<Nullable<TreeActionType>>(null);
  let permissionList = ref<TreeItem[]>([]);
  let acoountInfo = ref();
  const getTree = () => {
    const tree = unref(treeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  };
  onMounted(async () => {
    acoountInfo.value = merchantStore.getAccountInfo;
    getPermissionList();
    getTree().expandAll(true);
  });
  // 获取权限列表
  const getPermissionList = async () => {
    let res = await accountPremisionList(path);
    let formmattingData = formattingPermissionList(res, true);
    let formattingNullData = formattingNull(formmattingData);
    console.log(formattingNullData);
    permissionList.value = cloneDeep(formattingNullData);
    nextTick(() => {
      getTree().expandAll(true);
    });
  };
  const getRoleString = (record) => {
    if (record?.roles) {
      return record.roles.map((item) => item.name).join('、') || '-';
    } else {
      return '-';
    }
  };
  /**
   * 数据结构更改后权限列表初始化 V2
   * @param data 原始权限数据
   * @param action 列表是否展开
   */
  const formattingPermissionList = (data, action = false) => {
    let arr = [];
    data.forEach((element) => {
      let item = {
        key: String(element.code),
        id: Number(element.orderId),
      };
      if (element.vendorPermissions && element.vendorPermissions.length !== 0) {
        item['expanded'] = action; // 列表是否默认展开
        item['title'] = element.name;
        item['disabled'] = false;
        item['children'] = formattingPermissionList(element.vendorPermissions, action);
      } else {
        item['isLeaf'] = true; // 最后一级，图标隐藏
        item['title'] = element.name;
        item['disabled'] = false;
      }
      arr.push(item);
    });
    return arr;
  };

  // 剔除 title为null的数组
  const formattingNull = (data) => {
    data.forEach((item, index) => {
      if (item.title === null) {
        if (item.children && item.children.length !== 0) {
          data.splice(index, 1, ...formattingNull(item.children));
        }
      } else if (item.children && item.children.length !== 0) {
        formattingNull(item.children);
      }
    });
    return data;
  };
</script>

<style lang="less" scoped>
  .updata-content {
    margin: 20px;
    padding: 20px 34px 20px 34px;
    border-radius: 2px;
    .ant-col {
      margin-right: 0 !important;
    }
    .item-desc {
      font-size: 12px;
      color: #c4c4c4;
      margin-top: -20px;
    }

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
    .content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .top {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        .top-img {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          margin: 20px 20px 20px 8px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }
        .top-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          .top-info-item {
            height: 35px;
            line-height: 35px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
          }
        }
      }
      .item-box {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding-bottom: 20px;
        .item-title {
          font-size: 14px;
          color: #4f4f4f;
          line-height: 22px;
          min-width: 40px;
          flex-shrink: 0;
        }

        .item-value {
          font-size: 14px;
          color: #4f4f4f;
          line-height: 22px;
        }
      }
    }
    .content-other {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      .flex-1 {
        flex: 1;
      }
      .item-box {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding-bottom: 20px;
        .item-title {
          font-size: 14px;
          color: #4f4f4f;
          line-height: 22px;
          min-width: 40px;
          flex-shrink: 0;
        }

        .item-value {
          font-size: 14px;
          color: #4f4f4f;
          line-height: 22px;
        }
      }
    }
  }
</style>
