import { BasicColumn } from '/@/components/Table/src/types/table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '操作时间',
      align: 'left',
      dataIndex: 'reviewSubmittedDate',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '状态',
      dataIndex: 'reviewStatus',
      slots: { customRender: 'reviewStatus' },
    },
  ];
}
export const getStoreColumns = [
  {
    title: '店铺名称',
    align: 'left',
    dataIndex: 'name',
  },
  {
    title: '店铺logo',
    dataIndex: 'logoUrl',
  },
  {
    title: '店铺介绍',
    dataIndex: 'intro',
    align: 'left',
    customRender: ({ record }) => {
      return record?.intro ? record?.intro : '-';
    },
  },
  {
    title: '店铺状态',
    dataIndex: 'status',
    customRender: ({ record }) => {
      return record?.status?.name;
    },
  },
  {
    title: '自营店铺',
    dataIndex: 'mamaOwned',
    align: 'left',
    customRender: ({ record }) => {
      return record?.mamaOwned ? '是' : '否';
    },
  },
  {
    title: '开店时间',
    dataIndex: 'startDate',
    align: 'left',
    format: 'date|YYYY-MM-DD HH:mm:ss',
  },
  {
    title: '闭店时间',
    dataIndex: 'endDate',
    align: 'left',
    format: 'date|YYYY-MM-DD HH:mm:ss',
    customRender: ({ record }) => {
      return record?.endDate ? record?.endDate : '-';
    },
  },
  {
    title: '店铺链接',
    dataIndex: 'id', //查看店铺详情  店铺二维码
  },
];
