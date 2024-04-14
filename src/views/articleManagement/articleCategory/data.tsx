import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { showMsg } from '/@/utils/globalTips';
// api
import { updateCategory } from '/@/api/page/article/articleCategory';

const { t } = useI18n();

// table欄位
export function tableColumns(handleLoading): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 30,
    },
    {
      title: t('component.upload.image'),
      dataIndex: 'img',
      width: 100,
    },
    {
      title: t('component.articleManagement.categoryName'),
      dataIndex: 'name',
      width: 200,
    },
    // {
    //   title: t('component.articleManagement.pronoun'),
    //   dataIndex: 'code',
    //   width: 100,
    // },
    {
      title: t('component.articleManagement.pinToTop'),
      dataIndex: 'isTop',
      width: 80,
      customRender: ({ record }) => {
        return h(Switch, {
          checked: record.isTop === 1,
          checkedChildren: t('common.yes'),
          unCheckedChildren: t('common.no'),
          async onChange() {
            // handleSwitch('isTop', record.id, record['isTop']);
            handleStatus(record, 'isTop', handleLoading);
          },
        });
      },
    },
    {
      title: t('component.articleManagement.post'),
      dataIndex: 'isPublish',
      width: 80,
      customRender: ({ record }) => {
        return h(Switch, {
          checked: record.isPublish === 1,
          checkedChildren: t('common.yes'),
          unCheckedChildren: t('common.no'),
          async onChange() {
            // handleSwitch('isPublish', record.id, record['isPublish']);
            handleStatus(record, 'isPublish', handleLoading);
          },
        });
      },
    },
    // {
    //   title: t('common.sort'),
    //   dataIndex: 'sort',
    //   width: 60,
    // },
    // {
    //   title: t('common.createTime'),
    //   dataIndex: 'createdAt',
    //   width: 120,
    // },
    {
      title: t('component.articleManagement.articleCounts'),
      dataIndex: 'count',
      width: 60,
    },
    {
      title: t('component.backend.createdAt'),
      dataIndex: 'createdAt',
      width: 150,
    },
    {
      title: t('component.backend.createdBy'),
      dataIndex: 'createdBy',
      width: 60,
    },
    {
      title: t('component.backend.updatedAt'),
      dataIndex: 'updatedAt',
      width: 150,
    },
    {
      title: t('component.backend.updatedBy'),
      dataIndex: 'updatedBy',
      width: 60,
    },
    {
      title: t('common.action'),
      key: 'action',
      dataIndex: 'action',
      width: 120,
    },
  ];
}

// modal form
export function schemas(disabled): FormSchema[] {
  return [
    {
      field: 'name',
      label: t('component.articleManagement.categoryName'),
      component: 'Input',
      required: true,
      componentProps: {
        disabled: disabled,
        maxlength: 255,
        showCount: true,
      },
      colProps: { span: 12 },
    },
    // {
    //   field: 'code',
    //   label: t('component.articleManagement.pronoun'),
    //   component: 'Input',
    //   required: true,
    //   componentProps: {
    //     disabled: disabled,
    //     maxlength: 50,
    //     showCount: true,
    //   },
    //   colProps: { span: 12 },
    // },
    // {
    //   field: 'sort',
    //   label: t('common.sort'),
    //   component: 'InputNumber',
    //   required: true,
    //   componentProps: {
    //     disabled: disabled,
    //     min: 0,
    //     max: 99999,
    //     range: true,
    //   },
    //   colProps: { span: 12 },
    // },
    {
      field: 'isTop',
      label: t('component.articleManagement.pinToTop'),
      component: 'Switch',
      componentProps: {
        disabled: disabled,
        checkedValue: 1,
        unCheckedValue: 0,
      },
      colProps: { span: 6 },
    },
    {
      field: 'isPublish',
      label: t('component.articleManagement.post') + `(${t('common.enable')})`,
      component: 'Switch',
      componentProps: {
        disabled: disabled,
        checkedValue: 1,
        unCheckedValue: 0,
      },
      colProps: { span: 6 },
    },
    // {
    //   field: 'memo',
    //   label: t('component.articleManagement.description'),
    //   required: false,
    //   component: 'InputTextArea',
    //   componentProps: {
    //     allowClear: false,
    //     disabled: disabled,
    //     maxlength: 100,
    //     showCount: true,
    //     rows: 3,
    //   },
    //   colProps: { span: 24 },
    // },
  ];
}

export function seoSchemas(disabled): FormSchema[] {
  return [
    {
      field: 'metaTitle',
      label: 'META:TITLE/OG:TITLE',
      component: 'Input',
      componentProps: {
        allowClear: false,
        disabled: disabled,
      },
      colProps: { span: 24 },
    },
    {
      field: 'metaKeywords',
      label: 'META:KEYWORDS',
      component: 'Input',
      componentProps: {
        allowClear: false,
        disabled: disabled,
      },
      colProps: { span: 24 },
    },
    {
      field: 'metaDescription',
      label: 'META:DESCRIPTION/OG:DESCRIPTION',
      component: 'InputTextArea',
      componentProps: {
        allowClear: false,
        showCount: true,
        disabled: disabled,
        maxlength: 100,
        rows: 3,
      },
      colProps: { span: 24 },
    },
    {
      field: 'headerCode',
      label: 'HEADER JS/HTML' + t('component.articleManagement.code'),
      component: 'InputTextArea',
      required: false,
      componentProps: {
        allowClear: false,
        showCount: true,
        disabled: disabled,
        maxlength: 500,
        rows: 5,
      },
      colProps: { span: 24 },
    },
  ];
}

// 切換 置頂或刊登
const handleStatus = async (record, field, handleLoading) => {
  try {
    record[field] === 1 ? (record[field] = 0) : (record[field] = 1);

    const model = { id: record.id };
    model[field] = record[field];

    const res = await updateCategory(model);

    const title =
      field === 'isPublish' && model[field] == 1
        ? `${t('component.articleManagement.post')}(${t('common.enable')}) ${t('common.success')}`
        : `${t('common.close')}${t('component.articleManagement.post')}(${t('common.enable')})`;
    const title2 =
      field === 'isTop' && model[field] == 1
        ? `${t('component.articleManagement.pinToTop')}${t('common.success')}`
        : `${t('common.close')}${t('component.articleManagement.pinToTop')}`;
    if (res.code === 200) {
      handleLoading();
      showMsg('success', field === 'isPublish' ? title : title2);
    } else {
      record[field] === 1 ? (record[field] = 1) : (record[field] = 0);
      showMsg('error', t('component.app.toNavigate') + t('common.fail') + t('common.errMsg'));
    }
  } catch (err: any) {
    showMsg('error', t('component.app.toNavigate') + t('common.fail') + t('common.errMsg'));
  }
};

//取得圖片清單
export const getImages = (record) => {
  console.log(record.images);

  try {
    if (!record.images) return [];

    if (!JSON.parse(record.images)['other']) return [];

    return JSON.parse(record.images)['other'];
  } catch (err) {
    return [];
  }
};
