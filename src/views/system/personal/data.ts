import { FormSchema } from '/@/components/Form/index';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface ListItem {
  key: string;
  title: string;
  description: string;
  extra?: string;
  avatar?: string;
  color?: string;
}

// tab的list
export const settingList = [
  {
    key: '2',
    name: t('component.personal.security'),
    component: 'SecureSetting',
  },
];

// 基础设置 form
export const baseSetSchemas: FormSchema[] = [
  {
    field: 'username',
    component: 'Input',
    label: t('component.personal.jobId'),
    colProps: { span: 20 },
    dynamicDisabled: true,
  },
  {
    field: 'realName',
    component: 'Input',
    label: t('component.personal.name'),
    colProps: { span: 20 },
    dynamicDisabled: true,
  },

  {
    field: 'desc',
    component: 'Input',
    label: t('component.personal.unit'),
    colProps: { span: 20 },
    dynamicDisabled: true,
  },
];

// 安全设置 list
export const secureSettingList: ListItem[] = [
  {
    key: '1',
    title: '账户密码',
    description: '当前密码强度：：强',
    extra: '修改',
  },
  {
    key: '2',
    title: '密保手机',
    description: '已绑定手机：：138****8293',
    extra: '修改',
  },
  {
    key: '3',
    title: '密保问题',
    description: '未设置密保问题，密保问题可有效保护账户安全',
    extra: '修改',
  },
  {
    key: '4',
    title: '备用邮箱',
    description: '已绑定邮箱：：ant***sign.com',
    extra: '修改',
  },
  {
    key: '5',
    title: 'MFA 设备',
    description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
    extra: '修改',
  },
];
//change password
export const changePasswordSchema: FormSchema[] = [
  {
    field: 'passwordOld',
    label: t('component.personal.currentPassword'),
    component: 'InputPassword',
    required: true,
    componentProps: {
      placeholder: t('component.personal.currentPassword'),
      autocomplete: 'off',
    },
  },
  {
    field: 'passwordNew',
    label: t('component.personal.newPassword'),
    component: 'StrengthMeter',
    componentProps: {
      placeholder: t('component.personal.newPassword'),
      autocomplete: 'off',
    },
    rules: [
      {
        required: true,
        message: t('common.inputText') + t('component.personal.newPassword'),
      },
    ],
  },
  {
    field: 'confirmPassword',
    label: t('component.personal.confirmPassword'),
    component: 'InputPassword',
    componentProps: {
      placeholder: t('component.personal.confirmPassword'),
      autocomplete: 'off',
    },
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject(t('common.thisIsRequired'));
            }
            if (value !== values.passwordNew) {
              return Promise.reject(t('component.personal.passwordNotMatch'));
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
];
// 账号绑定 list
export const accountBindList: ListItem[] = [
  {
    key: '1',
    title: '绑定淘宝',
    description: '当前未绑定淘宝账号',
    extra: '绑定',
    avatar: 'ri:taobao-fill',
    color: '#ff4000',
  },
  {
    key: '2',
    title: '绑定支付宝',
    description: '当前未绑定支付宝账号',
    extra: '绑定',
    avatar: 'fa-brands:alipay',
    color: '#2eabff',
  },
  {
    key: '3',
    title: '绑定钉钉',
    description: '当前未绑定钉钉账号',
    extra: '绑定',
    avatar: 'ri:dingding-fill',
    color: '#2eabff',
  },
];

// 新消息通知 list
export const msgNotifyList: ListItem[] = [
  {
    key: '1',
    title: '账户密码',
    description: '其他用户的消息将以站内信的形式通知',
  },
  {
    key: '2',
    title: '系统消息',
    description: '系统消息将以站内信的形式通知',
  },
  {
    key: '3',
    title: '待办任务',
    description: '待办任务将以站内信的形式通知',
  },
];
