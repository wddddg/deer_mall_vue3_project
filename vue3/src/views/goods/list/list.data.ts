import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { getProductTypeCodeList } from './list.api';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '商品名称',
      dataIndex: 'name',
      align: 'left',
      slots: { customRender: 'productLink' },
    },
    {
      title: '商品编号',
      dataIndex: 'productId',
      align: 'left',
      slots: { customRender: 'productLink' },
    },
    {
      title: '商品分类',
      dataIndex: 'productCategoryName',
      align: 'left',
    },
    {
      title: '代售商品',
      dataIndex: 'delegatedProduct',
      align: 'left',
      customRender: ({ text }: { text: boolean }) => {
        if (text == true) {
          return '是';
        } else {
          return '否';
        }
      },
    },
    {
      title: '商品类型',
      dataIndex: 'type',
      align: 'left',
      customRender: ({ record }) => {
        return record?.type?.name;
      },
    },
    {
      title: '所属店铺',
      dataIndex: 'shopName',
      align: 'left',
    },
    {
      title: '商品状态',
      dataIndex: 'onshow',
      align: 'left',
      customRender: ({ text }: { text: boolean }) => {
        if (text == true) {
          return '上架';
        } else {
          return '下架';
        }
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    showAdvancedButton: false,
    schemas: [
      {
        field: `shopName`,
        label: `店铺名称`,
        component: 'Input',
        // componentProps: {
        //   placeholder: '请输入店铺名称',
        // },
        colProps: {
          span: 4,
        },
      },
      {
        field: `name`,
        label: `商品名称`,
        component: 'Input',
        // componentProps: {
        //   placeholder: '请输入商品名称',
        // },
        colProps: {
          span: 4,
        },
      },
      {
        field: `productId`,
        label: `商品编号`,
        component: 'Input',
        // componentProps: {
        //   placeholder: '请输入商品编号',
        // },
        colProps: {
          span: 4,
        },
      },

      {
        field: `_productCategoryId`,
        label: `商品分类`,
        component: 'Input',
        slot: 'productCategor',
        colProps: {
          span: 5,
        },
      },

      {
        field: `typeCode`,
        label: `商品类型`,
        component: 'ApiSelect',
        componentProps: {
          // placeholder: '请选择商品类型',
          // mode: 'multiple',
          api: getProductTypeCodeList,
          labelField: 'name',
          valueField: 'code',
        },
        colProps: {
          span: 5,
        },
      },
      {
        field: `onShow`,
        label: `商品状态`,
        component: 'Select',
        componentProps: {
          // placeholder: '请选择商品状态',
          options: [
            {
              label: '上架',
              value: 'true',
            },
            {
              label: '下架',
              value: 'false',
            },
          ],
        },
        colProps: {
          span: 5,
        },
      },
      {
        field: `delegatedProduct`,
        label: `代售商品`,
        component: 'Select',
        componentProps: {
          // placeholder: '请选择代售商品',
          options: [
            {
              label: '全部',
              value: '',
            },
            {
              label: '是',
              value: 'true',
            },
            {
              label: '否',
              value: 'false',
            },
          ],
        },
        colProps: {
          span: 4,
        },
      },
    ],
  };
}
