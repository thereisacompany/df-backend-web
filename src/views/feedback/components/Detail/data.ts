import { FormSchema } from '/@/components/Form/index';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export function schemas(disabled): FormSchema[] {
  return [
    {
      field: 'username',
      component: 'Input',
      label: t('component.feedback.member'),
      componentProps: {
        disabled: true,
        class: 'w-full',
      },
      colProps: { span: 12 },
    },
    {
      field: 'createdAt',
      component: 'Input',
      label: t('component.feedback.date'),
      componentProps: {
        disabled: true,
        class: 'w-full',
      },
      colProps: { span: 12 },
    },
    // {
    //   field: 'title',
    //   component: 'Input',
    //   label: t('component.feedback.title'),
    //   componentProps: {
    //     disabled: true,
    //     class: 'w-full',
    //   },
    //   colProps: { span: 24 },
    // },
    {
      field: 'question',
      component: 'Input',
      label: t('component.feedback.question'),
      componentProps: {
        disabled: true,
        class: 'w-full',
      },
      colProps: { span: 24 },
    },
    {
      field: 'phone',
      component: 'Input',
      label: t('component.feedback.phone'),
      componentProps: {
        disabled: true,
        class: 'w-full',
      },
      colProps: { span: 24 },
    },
    {
      field: 'address',
      component: 'Input',
      label: t('component.feedback.address'),
      componentProps: {
        disabled: true,
        class: 'w-full',
      },
      colProps: { span: 24 },
    },
    {
      field: 'content',
      component: 'InputTextArea',
      label: t('component.feedback.content'),
      componentProps: {
        disabled: true,
        rows: 5,
        class: 'w-full',
      },
      colProps: { span: 24 },
    },
    {
      field: 'response',
      component: 'InputTextArea',
      label: t('common.reply'),
      componentProps: {
        rows: 5,
        class: 'w-full',
        disabled: disabled,
      },
      colProps: { span: 24 },
    },
  ];
}
