import XEUtils from 'xe-utils';
import { FormSchema } from '/@/components/Form/index';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
const { t } = useI18n();

export const option = {
  types: [
    { label: t('common.total'), value: 0 },
    { label: t('component.member.bulletin'), value: 1 },
    { label: t('component.member.notice'), value: 2 },
    { label: t('component.member.activity'), value: 3 },
    { label: t('component.member.schedule'), value: 4 },
  ],
  status: [
    { label: t('component.news.published'), value: 1 },
    { label: t('component.news.unpublished'), value: 2 },
  ],
};

export const schemas: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    label: t('component.member.title'),
    componentProps: {
      placeholder: t('common.chooseText'),
    },
    colProps: { span: 4 },
  },
  {
    field: 'visible',
    component: 'Select',
    label: t('component.news.publishStatus'),
    componentProps: {
      placeholder: t('common.chooseText'),
      options: option.status,
    },
    colProps: { span: 4 },
  },
  {
    field: 'type',
    label: t('component.news.type'),
    defaultValue: 0,
    component: 'RadioButtonGroup',
    componentProps: {
      options: option.types,
    },
    colProps: { span: 16 },
  },
];

export const tableColumns: any = [
  { title: t('common.date'), dataIndex: 'createdAt', width: 160 },
  {
    title: t('component.news.publisher'),
    dataIndex: 'createdBy',
    width: 150,
  },
  {
    title: t('component.news.type'),
    customRender: ({ text }) => {
      return h('div', { class: '' }, getName(option.types, text));
    },
    dataIndex: 'type',
    width: 100,
  },
  { title: t('component.member.title'), dataIndex: 'title' },
  { title: t('component.member.textContent'), dataIndex: 'content' },
  {
    title: t('component.news.publishStatus'),
    dataIndex: 'visible',
    width: 115,
    customRender: ({ text }) => {
      return h('div', { class: '' }, getName(option.status, text));
    },
  },
  { title: t('common.action'), dataIndex: 'action', width: 150 },
];

const getName = (options, text) => {
  const array = XEUtils.filter(options, (item) => item.value == text);
  return array.length > 0 ? array[0].label : '';
};
