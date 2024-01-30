import { filterOptions } from '/@/utils/options';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//import { Switch, Input } from 'ant-design-vue';
import { Switch } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { showMsg } from '/@/utils/globalTips';
//import { Icon } from '/@/components/Icon';
import { h } from 'vue';
import XEUtils from 'xe-utils';
import dayjs, { Dayjs } from 'dayjs';

//api
import { updateArticle } from '/@/api/page/article/articleList';

const { t } = useI18n();

//---* 日期區間快選
type RangeValue = [Dayjs, Dayjs];
const yesterday = dayjs().subtract(1, 'day');
const firstDay = dayjs().startOf('month');
const lastDay = dayjs().endOf('month');
const tomorrow = dayjs().add(1, 'day');
const lastMonthStart = dayjs().subtract(1, 'month').startOf('month'); // 上個月第一天
const lastMonthEnd = dayjs().subtract(1, 'month').endOf('month'); // 上個月最後一天

const colProps = { span: 6 };
export const filterSchemas: FormSchema[] = [
  {
    field: 'keyword',
    component: 'Input',
    label: t('common.keyword'),
    componentProps: {
      placeholder: t('common.inputText'),
      allowClear: true,
      maxlength: 100,
      showCount: true,
    },
    colProps: colProps,
  },
  {
    field: 'category',
    component: 'Select',
    label: t('component.articleManagement.articleCategory'),
    componentProps: ({}) => {
      return {
        mode: 'multiple',
        maxTagCount: 3,
        options: [],
      };
    },
    colProps: colProps,
  },
  {
    field: 'filter',
    component: 'Select',
    label: t('component.articleManagement.filter'),
    componentProps: ({}) => {
      return {
        mode: 'multiple',
        maxTagCount: 3,
        options: filterOptions,
      };
    },
    colProps: colProps,
  },
  {
    field: 'date',
    label: t('component.articleManagement.publicationDate'),
    component: 'RangePicker',
    componentProps: {
      allowClear: true,
      format: 'YYYY-MM-DD ',
      valueFormat: 'YYYY-MM-DD',
      placeholder: [t('common.startDate'), t('common.endDate')],
      ranges: {
        [t('common.today')]: [dayjs(), dayjs()] as RangeValue,
        [t('common.yesterday')]: [yesterday, yesterday] as RangeValue,
        [t('common.nearlyThreeDays')]: [yesterday, tomorrow] as RangeValue,
        [t('common.thisMonth')]: [firstDay, lastDay] as RangeValue,
        [t('common.lastMonth')]: [lastMonthStart, lastMonthEnd] as RangeValue,
      },
    },
    colProps: { span: 6 },
  },
];

export const getColumns = (categorys, handleLoading) => {
  const columns: BasicColumn[] = [
    { title: 'ID	', dataIndex: 'id', width: 50 },
    {
      title: t('component.upload.image'),
      dataIndex: 'image',
      width: 80,
      customRender: ({ record }) => {
        const data = record.images ? JSON.parse(record.images) : { list: [], inner: [], icon: [] };
        console.log(data);
        const img = data.list.length > 0 ? data.list[0].thumbUrl : '';
        return h('img', { src: img, class: 'h-12 m-auto' });
      },
    },
    {
      title: t('component.articleManagement.titleContent'),
      dataIndex: 'body',
      width: 500,
      customRender: ({ record }) => {
        let content = '';

        const myDiv = document.getElementById('myDiv');
        if (myDiv) {
          myDiv.innerHTML = record.content;
          content = myDiv.innerText;
        }

        return h('div', { class: 'text-left' }, [
          h('div', { class: 'font-bold' }, record.title),
          h('div', { class: 'text-red-500' }, record.code),
          h(
            'div',
            {
              style:
                'overflow: hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;',
            },
            content,
          ),
        ]);
      },
    },
    {
      title: t('component.articleManagement.articleCategory'),
      dataIndex: 'category',
      width: 80,
      customRender: ({ record }) => {
        let text = '';
        const values = XEUtils.filter(categorys, (item) => item.value === record.category);
        if (values.length > 0) text = values[0].label;

        return h('div', { class: '', innerHTML: text });
      },
    },
    // {
    //   title: t('component.articleManagement.featured'),
    //   width: 80,
    //   dataIndex: 'isFeatured',
    //   customRender: ({ record }) => {
    //     return h(Switch, {
    //       checked: record.isFeatured === 1,
    //       checkedChildren: t('common.yes'),
    //       unCheckedChildren: t('common.no'),
    //       async onChange() {
    //         handleStatus(record, 'isFeatured', handleLoading);
    //       },
    //     });
    //   },
    // },
    {
      title: t('component.articleManagement.latest'),
      width: 80,
      dataIndex: 'isLatest',
      customRender: ({ record }) => {
        return h(Switch, {
          checked: record.isLatest === 1,
          checkedChildren: t('common.yes'),
          unCheckedChildren: t('common.no'),
          async onChange() {
            handleStatus(record, 'isLatest', handleLoading);
          },
        });
      },
    },
    {
      title: t('component.articleManagement.post'),
      width: 80,
      dataIndex: 'isPublish',
      customRender: ({ record }) => {
        return h(Switch, {
          checked: record.isPublish === 1,
          checkedChildren: t('common.yes'),
          unCheckedChildren: t('common.no'),
          async onChange() {
            handleStatus(record, 'isPublish', handleLoading);
          },
        });
      },
    },
    {
      title: t('component.articleManagement.pinToTop'),
      width: 80,
      dataIndex: 'isTop',
      customRender: ({ record }) => {
        return h(Switch, {
          checked: record.isTop === 1,
          checkedChildren: t('common.yes'),
          unCheckedChildren: t('common.no'),
          async onChange() {
            handleStatus(record, 'isTop', handleLoading);
          },
        });
      },
    },
    // {
    //   title: t('common.sort'),
    //   dataIndex: 'sort',
    //   width: 80,
    //   customRender: ({ record }) => {
    //     return h(Input, {
    //       value: record.sort,
    //       onChange: (e: ChangeEvent) => {
    //         record.sort = e.target.value;
    //       },
    //     });
    //   },
    // },
    {
      title: t('component.articleManagement.publicationDate'),
      dataIndex: 'publishDate',
      width: 110,
    },
    // {
    //   title: t('component.articleManagement.views'),
    //   dataIndex: 'view',
    //   width: 80,
    //   customRender: ({ record }) => {
    //     return h('div', { class: 'text-center' }, [
    //       h(Icon, { icon: 'carbon:view' }),
    //       h('div', { class: '' }, record.browserCount),
    //     ]);
    //   },
    // },
    { title: t('common.action'), dataIndex: 'action', width: 120 },
  ];

  return columns;
};

const handleStatus = async (record, field, handleLoading) => {
  try {
    handleLoading(true);
    record[field] === 1 ? (record[field] = 0) : (record[field] = 1);

    const model = { id: record.id };
    model[field] = record[field];

    const res = await updateArticle(model);
    if (res.code === 200) {
      showMsg('success', t('common.success'));
    } else {
      record[field] === 1 ? (record[field] = 1) : (record[field] = 0);
      showMsg('success', t('common.fail'));
    }
  } catch (err: any) {
    showMsg('success', err);
  } finally {
    setTimeout(() => {
      handleLoading(false);
    }, 1000);
  }
};
