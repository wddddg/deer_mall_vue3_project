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
        <div class="content-title">{{ getType() === 'show' ? '添加角色' : '编辑角色' }}</div>
        <div class="content-other">
          <BasicForm @register="registerPwdFrom" :showActionButtonGroup="false" />
          <div class="other-tree">
            <BasicTree
              ref="treeRef"
              :checkable="type !== 'show'"
              toolbar
              :treeData="permissionList"
              :checkStrictly="false"
              :clickRowToExpand="true"
              title="权限"
            />
          </div>
        </div>
        <div class="content-bottom">
          <a-button
            size="large"
            type="primary"
            class="btn"
            @click="saveRole"
            v-if="type === 'edit' || type === 'add'"
            >保存</a-button
          >
          <a-button size="large" class="btn" @click="goRole">返回</a-button>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref, nextTick } from 'vue';
  import {
    rolePermissionList,
    rolePermission,
    editRolePermission,
    AddRolePermission,
  } from './role.api';
  import { infoFormSchema } from './role.data';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree';
  import { cloneDeep } from 'lodash-es';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  const { currentRoute } = useRouter();
  const router = useRouter();
  const { params } = unref(currentRoute);
  const { path } = params;

  const treeRef = ref<Nullable<TreeActionType>>(null);
  let permissionList = ref<TreeItem[]>([]);
  const getTree = () => {
    const tree = unref(treeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  };
  let type = ref('');
  let selectId = ref('');
  let roleData = ref();
  onMounted(async () => {
    let arr = path.split('/');
    type.value = arr[0];
    selectId.value = arr.length = 2 ? arr[1] : '';
    getPermissionList();
  });
  const getType = () => {
    let arr = path.split('/');
    return arr[0];
  };
  const [registerPwdFrom, { setFieldsValue, getFieldsValue, validate }] = useForm({
    labelWidth: 120,
    schemas: infoFormSchema,
    disabled: getType() === 'show',
  });
  const goRole = () => {
    router.push({ path: '/management/account/role' });
  };
  const flat = (arr) => {
    return [].concat(
      ...arr.map((item) => {
        if (item.children) {
          let arr = [].concat(item, ...flat(item.children));
          delete item.children;
          return arr;
        }
        return [].concat(item);
      }),
    );
  };

  // 保存操作
  const saveRole = async () => {
    // 获取表单字段
    let info = await getFieldsValue();
    // 选中的权限
    let checkedKeys = getTree().getCheckedKeys();
    console.log('选中的权限：', checkedKeys);

    // 编辑
    if (getType() === 'edit') {
      let { description, name, id } = info;
      if (checkValueOfEmpty(name)) {
        message.error('请输入角色名称');
        return;
      }
      let permissionListClone = cloneDeep(permissionList.value);
      // 一维的tree数据
      let list = flat(permissionListClone);
      // 得到被选中的tree全量数据
      let arr = list.filter((item) => checkedKeys.indexOf(item.key) !== -1);
      console.log('选中的权限全量数据：', arr);
      // 获取仅包含id,code的选中数据
      let permissions = arr.map((item) => {
        return { id: '', code: item.code };
      });
      if (roleData.value.permissions.length) {
        roleData.value.permissions.map((item, index) => {
          permissions.map((item1, index1) => {
            if (item.code == item1.code) {
              permissions[index1].id = roleData.value.permissions[index].id;
            }
          });
        });
      }

      console.log(permissions, roleData.value.permissions);
      if (!permissions.length) {
        message.error('请勾选权限！');
        return;
      }
      // permissions = permissions.slice(1);

      let params = {
        description,
        name,
        id,
        permissions: permissions,
      };
      await editRolePermission(selectId.value, params)
        .then(() => {
          message.success('修改成功');
          router.go(-1);
        })
        .catch((error) => {
          message.error(error.response.data.message);
        });
    } else if (getType() === 'add') {
      let { description, name } = info;
      if (checkValueOfEmpty(name)) {
        message.error('请输入角色名称');
        return;
      }
      let filterPermissionAdd = [];
      Object.values(checkedKeys).forEach((val) => {
        filterPermissionAdd.push({ code: val });
      });
      if (!filterPermissionAdd.length) {
        message.error('请勾选权限！');
        return;
      }
      let params = {
        name,
        description,
        permissions: filterPermissionAdd,
      };
      await AddRolePermission(params)
        .then(() => {
          message.success('新增成功');
          router.go(-1);
        })
        .catch((error) => {
          message.error(error.response.data.message);
        });
    }
  };
  // 空值测试
  function checkValueOfEmpty(value) {
    if (value !== '' && value !== undefined && value !== null) {
      return false;
    }
    return true;
  }
  // 获取权限列表
  const getPermissionList = async () => {
    let formmattingData = [];
    let res = await rolePermissionList();

    if (type.value !== 'add') {
      let owmPressionInfo = await rolePermission(selectId.value);
      let { id, name, description } = owmPressionInfo;
      await setFieldsValue({
        id: id,
        name: name,
        description: description,
      });
      console.log('owmPressionInfo:', owmPressionInfo);
      roleData.value = cloneDeep(owmPressionInfo);
      if (type.value === 'edit') {
        // 编辑
        formmattingData = formattingPermissionList(res, 1, undefined);
        permissionList.value = cloneDeep(formmattingData);
        let permissionArr = owmPressionInfo.permissions.map((item) => item.code);
        getTree().setCheckedKeys(permissionArr);
      } else if (type.value === 'show') {
        // 查看
        let checkPer = {};
        owmPressionInfo.permissions.forEach((element) => {
          checkPer[element.code] = element.code;
        });
        permissionList.value = cloneDeep(formattingViewPermissionList(res, checkPer, 1));
      }
    } else {
      // 新增
      formmattingData = formattingPermissionList(res, 1, undefined);
      console.log(formmattingData);
      permissionList.value = cloneDeep(formmattingData);
    }
    nextTick(() => {
      getTree().expandAll(true);
    });
  };

  /**
   * 数据结构更改后权限列表初始化 V2
   * @param data 原始权限数据
   * @param level 当前level
   * @param parentCode 父级code
   * @param disable 是否禁用
   */
  const formattingPermissionList = (data, level, parentCode, disable = false) => {
    let nextGroupKey = matchLevelName(level); // 下一级的数集keyName
    let nextLevl = level + 1; // 下一级level
    let arr = [];
    data.forEach((element, index) => {
      let item = {
        key: String(element.code),
        id: Number(element.orderId),
        code: String(element.code),
        isSelectable: false,
        pCode: parentCode,
        level: level,
      };
      if (element[nextGroupKey] && element[nextGroupKey].length !== 0) {
        item['expanded'] = true;
        item['title'] = element.name;
        item['disableCheckbox'] = disable;
        item['disabled'] = disable;
        item['children'] = formattingPermissionList(
          element[nextGroupKey],
          nextLevl,
          element.code,
          disable,
        );
      } else {
        item['isLeaf'] = true;
        item['title'] = element.name;
        item['disableCheckbox'] = disable;
        item['disabled'] = disable;

        // 平台客服
        if (element.code === 'MAMA_CHAT') {
          item['title'] = element.name + ' （该项勾选后，即是平台客服，可为消费者/商家服务）';
        }
      }
      arr.push(item);
    });
    return arr;
  };

  // 根据level获取子级数组keyname
  const matchLevelName = (level) => {
    switch (level) {
      case 1:
        return 'groups';
      case 2:
        return 'subGroups';
      case 3:
        return 'permissions';
    }
  };

  /**
   * 格式化查看时树状图数据
   * @param data 原始层级数据
   * @param codeList 被选中的code列表
   * @param level 当前level
   * @param lastLevel 最后一层level
   */
  const formattingViewPermissionList = (data, codeList, level, lastLevel = 4) => {
    let arr = [];
    let nextGroupKey = matchLevelName(level); // 下一级的数集keyName
    let nextLevl = level + 1; // 下一级level
    data.forEach((element) => {
      if (!element[nextGroupKey] || element[nextGroupKey].length === 0) {
        // 沒有子集 則直接判斷是否符合
        if (codeList[element.code]) {
          let item = {
            key: String(element.code),
            id: Number(element.orderId),
            code: String(element.code),
            isSelectable: false,
          };
          item['isLeaf'] = true;
          item['title'] = element.name;
          item['disableCheckbox'] = false;
          arr.push(item);
        }
      } else if (element[nextGroupKey].length !== 0) {
        let item = {
          key: String(element.code),
          id: Number(element.orderId),
          code: String(element.code),
          isSelectable: false,
        };
        item['expanded'] = true;
        item['title'] = element.name;
        item['disableCheckbox'] = false;
        item['children'] = formattingViewPermissionList(element[nextGroupKey], codeList, nextLevl);
        arr.push(item);
      }
    });
    let addList = [];
    arr.forEach((item) => {
      if (item.children && item.children.length !== 0) {
        // 拥有子级（根据最后一级判断没被选中的 最后一级则被删除）
        addList.push(item);
      } else if (!item.children || lastLevel === level) {
        // 不存在子级数组（最后一级）|| 或者到达最底层（自定义层数）4层
        addList.push(item);
      }
    });
    return addList;
  };
</script>

<style lang="less">
  .updata-content {
    height: 100%;
    margin: 20px;
    padding: 20px 34px 20px 34px;
    background: #fff;
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
    .other-tree {
      height: 600px;
      overflow-y: scroll;
    }
    .content-bottom {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      margin-top: 20px;
      padding-left: 40px;
      .btn {
        margin-right: 40px;
      }
    }
  }
</style>
