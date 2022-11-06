import { FetchSetting } from '/@/components/Table/src/types/table';

/**
 * 接口请求配置，可以配置请求的字段和响应的字段名
 * @returns 接口请求配置
 */
export function getFetchSetting(listField: string): Partial<FetchSetting> {
  return {
    // 传给后台的当前页字段
    pageField: 'offset',
    // 传给后台的每页显示多少条的字段
    sizeField: 'limit',
    // 接口返回表格数据的字段
    listField: listField,
    // 接口返回表格总数的字段
    totalField: 'totalCount',
  };
}

/**
 * 请求之前对参数进行处理
 * @param params 请求参数
 */
export function getBeforeFetch(params: any): void {
  params.offset && (params.offset = Number(params.offset) - 1);
}

/**
 * 表记录转化为符合 isTreeTable = true 的格式数据
 * @param records 表记录
 * @param field 需要递归的子类字段
 */
export function convertToTreeTable(records: any[], childrenField: string, level = 1) {
  for (let idx = 0; idx < records.length; idx++) {
    const record = records[idx];
    if (!record.level) {
      record.level = level;
    }

    if (record[childrenField]) {
      if (record[childrenField]?.length > 0) {
        record.children = convertToTreeTable(record[childrenField], childrenField, level + 1);
      }
      delete record[childrenField];
    }
  }

  return records;
}

/**
 * 获取树形表对应可张开节点key
 * @param records 表格内容
 * @returns
 */
export function getTreeTableExpandedRowKeys(records: any[]) {
  const rowKeys = [] as any[];

  for (let idx = 0; idx < records.length; idx++) {
    const record = records[idx];
    if (record['children'] && record['children']?.length > 0) {
      rowKeys.push(record.id);

      const childrenRowKeys = getTreeTableExpandedRowKeys(record['children']);
      childrenRowKeys && childrenRowKeys.length > 0 && rowKeys.push(...childrenRowKeys);
    }
  }

  return rowKeys;
}

//--------------------------------------产品分类 中使用---------------------------------------

/**
 * 表tree格式数据
 * @param datas 表记录
 * @param field 需要递归的子类字段
 */
export function convertToTree(datas: any[], field = 'children', parentLabel = '') {
  const results: any[] = [];

  for (let idx = 0; idx < datas.length; idx++) {
    const item = datas[idx];

    const newItem = {
      label: item.name,
      key: item.id,
      value: item.id,
      isLeaf: true,
      inputLabel: `${parentLabel ? parentLabel + '-' : ''}${item.name}`,
    };

    if (item[field] && item[field].length > 0) {
      newItem.isLeaf = false;
      newItem['children'] = convertToTree(item[field], field, newItem.inputLabel);
    }

    results.push(newItem);
  }

  return results;
}

const Status_Code = {
  // 待提交 - 绿色
  submitItem: {
    ORG_REVIEW_STATUS_WAIT_SUBMIT: true,
    TRADE_WAITING_DELIVERY: true,
    PROCESSING: true, // 处理中

    NOT_SUBMIT: true, // 未提交
    CHECKING: true, // 资料校验中
    ACCOUNT_NEED_VERIFY: true, // 待账户验证
    NEED_SIGN: true, // 待签约
  },
  // 待审核 - 蓝色
  reviewItem: {
    ORG_REVIEW_STATUS_WAIT_REVIEW: true,
    TRADE_WAITING_RECEIPT: true,
    PENDING: true, // 待分账

    AUDITING: true, // 微信审核中
  },
  // 驳回 - 红色
  rejectedItem: {
    ORG_REVIEW_STATUS_REJECTED: true,
    TRADE_CANCELLED: true,
    CLOSED: true,

    REJECTED: true, // 微信已驳回
  },
  //  通过 - 灰色
  approvedItem: {
    ORG_REVIEW_STATUS_APPROVED: true,
    TRADE_SUCCEEDED: true,
    FINISHED: true, // 处理完成

    FINISH: true, // 微信通过，已完成
  },
};

/**
 * 状态着色
 * @param status 状态
 */
export function getStatusClass(status) {
  if (Status_Code.submitItem.hasOwnProperty(status)) {
    return 'project-submit-item';
  } else if (Status_Code.reviewItem.hasOwnProperty(status)) {
    return 'project-review-item';
  } else if (Status_Code.rejectedItem.hasOwnProperty(status)) {
    return 'project-rejected-item';
  } else if (Status_Code.approvedItem.hasOwnProperty(status)) {
    return 'project-approved-item';
  }
}

//--------------------------------------chat 中使用---------------------------------------

// (chat中使用)空值测试
export function checkValueOfEmpty(value) {
  if (value !== '' && value !== undefined && value !== null) {
    return false;
  }

  return true;
}

// (chat中使用)获取时间值
function getDateValue(date: any) {
  const D = new Date(date);
  return {
    year: D.getFullYear(),
    month: formatValueOfTwoDigits(D.getMonth() + 1),
    day: formatValueOfTwoDigits(D.getDate()),
    hour: formatValueOfTwoDigits(D.getHours()),
    minutes: formatValueOfTwoDigits(D.getMinutes()),
    seconds: formatValueOfTwoDigits(D.getSeconds()),
  };
}

// (chat中使用)格式化传入值为两位字符长度
function formatValueOfTwoDigits(value: number | string) {
  if (checkValueOfEmpty(value)) {
    return '00';
  } else if (String(value).length === 1) {
    return '0' + String(value);
  } else {
    return String(value);
  }
}

// (chat中使用)比较当前时间格式显示时间
export function formattingDateByCurrent(diff: any, mode: 'list' | 'chat') {
  if (!diff) {
    return '';
  }

  const diffDate = getDateValue(diff);
  const currentDate = getDateValue(new Date());
  let result = '';
  if (diffDate.year >= currentDate.year) {
    if (diffDate.month === currentDate.month && diffDate.day >= currentDate.day) {
      result = `${diffDate.hour}:${diffDate.minutes}`;
    } else {
      if (mode === 'list') {
        result = `${diffDate.month}-${diffDate.day}`;
      } else if (mode === 'chat') {
        result = `${diffDate.month}-${diffDate.day} ${diffDate.hour}:${diffDate.minutes}`;
      }
    }
  } else {
    if (mode === 'list') {
      result = `${diffDate.year}-${diffDate.month}-${diffDate.day}`;
    } else if (mode === 'chat') {
      result = `${diffDate.year}-${diffDate.month}-${diffDate.day} ${diffDate.hour}:${diffDate.minutes}`;
    }
  }
  return result;
}

// 筛选当前权限列表是否拥有
export function matchPermissionsCode(permissionsCodeList, permissionsList: string[]) {
  for (const key in permissionsCodeList) {
    // if (permissionsCodeList.hasOwnProperty(key)) {
    //   permissionsCodeList[key] = permissionsList[key];
    // }
    permissionsCodeList[key] = permissionsList && permissionsList.some((item) => item == key);
  }

  return permissionsCodeList;
}

// 原始数据copy到目标数据、并且目标对应的字段已存在，第一层数据
export function copyToReactiveObj(origin: any, target: any) {
  if (!target || !origin) {
    return;
  }

  Object.keys(target).forEach((key) => {
    // let key = item as keyof typeof origin;
    if (origin.hasOwnProperty(key)) {
      target[key] = origin[key];
    } else {
      target[key] = '';
    }
  });
}
