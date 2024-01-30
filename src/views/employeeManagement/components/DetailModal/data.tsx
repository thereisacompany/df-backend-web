import type { Rule } from 'ant-design-vue/es/form';
import { useI18n } from '/@/hooks/web/useI18n';
import { isEnNumber } from '/@/utils/is';

import { positionOptions } from '/@/utils/options';

const { t } = useI18n();

const validatePass = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject(t('component.backend.enterJob'));
  } else if (isEnNumber(value) == false) {
    return Promise.reject(t('component.backend.enterAlphanumeric'));
  } else {
    return Promise.resolve();
  }
};

export function getSchemas(id) {
  return [
    {
      field: 'JobId',
      label: t('component.backend.jobId'),
      component: 'Input',
      required: true,
      rules: [{ required: true, validator: validatePass, trigger: 'change' }],
      componentProps: {
        placeholder: t('common.inputText'),
        maxlength: 20,
        showCount: true,
        disabled: id > 0 ? true : false,
      },
      colProps: { span: 24 },
    },
    {
      field: 'Name',
      label: t('component.backend.name'),
      component: 'Input',
      required: true,
      componentProps: {
        placeholder: t('common.inputText'),
        showCount: true,
        maxlength: 100,
      },
      colProps: { span: 24 },
    },
    {
      field: 'PositionId',
      label: t('component.backend.position'),
      component: 'Select',
      required: true,
      defaultValue: 2,
      componentProps: {
        allowClear: false,
        options: positionOptions,
      },
      colProps: { span: 24 },
    },
  ];
}
