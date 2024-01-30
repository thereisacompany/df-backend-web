<template>
  <Form
    class="p-4 enter-x custom-login-form"
    :model="formData"
    :layout="'vertical'"
    :rules="getFormRules"
    ref="formRef"
  >
    <FormItem :label="t('sys.login.userName')" name="registerAccount" class="enter-x">
      <Input
        class="fix-auto-fill input-no-border"
        size="large"
        v-model:value="formData.registerAccount"
        :placeholder="t('sys.login.userName')"
      >
        <template #prefix>
          <div class="prefix-icon">
            <img src="/src/assets/svg/icon-user.svg" alt="" class="w-full" />
          </div>
        </template>
      </Input>
    </FormItem>

    <FormItem :label="t('sys.login.password')" name="registerPassword" class="enter-x">
      <StrengthMeter
        size="large"
        autocomplete="false"
        v-model:value="formData.registerPassword"
        :placeholder="t('sys.login.passwordPlaceholder')"
        class="strengthMeter-no-border"
      >
        <template #prefix>
          <div class="prefix-icon">
            <img src="/src/assets/svg/icon-locker.svg" alt="" class="w-full" />
          </div>
        </template>
      </StrengthMeter>
    </FormItem>

    <FormItem :label="t('sys.login.country')" name="registerCountry" class="enter-x">
      <Select
        class="select-no-border select-icon"
        size="large"
        v-model:value="formData.registerCountry"
        :placeholder="t('sys.login.countryPlaceholder')"
        :options="countryList"
        :field-names="{ label: 'label', value: 'value' }"
      >
        <template #suffixIcon> <Icon icon="ion:arrow-down-b" :size="20" class="-ml-3" /></template>
      </Select>
    </FormItem>
    <FormItem :label="t('sys.login.invitationCode')" name="registerInvitationCode" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.registerInvitationCode"
        :placeholder="t('common.inputText')"
        class="fix-auto-fill input-no-border"
      >
        <template #prefix>
          <div class="prefix-icon">
            <img src="/src/assets/svg/icon-letter.svg" alt="" class="w-full" />
          </div>
        </template>
      </Input>
    </FormItem>

    <!-- <FormItem class="enter-x" name="policy">
        <Checkbox v-model:checked="formData.policy" size="small">
          {{ t('sys.login.policy') }}
        </Checkbox>
      </FormItem> -->
    <FormItem class="enter-x text-center">
      <Button
        class="custom-btn-warning"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >
        {{ t('sys.login.registerButton') }}
      </Button>
    </FormItem>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, watchEffect } from 'vue';
  import { Form, Input, Select, Button } from 'ant-design-vue';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useFormRules, useFormValid, useResetFields } from './useLogin';
  import { countryList } from './data';
  import { Icon } from '/@/components/Icon';

  const props = defineProps({
    openModal: {
      type: Boolean,
      default: false,
    },
  });

  const FormItem = Form.Item;
  const { t } = useI18n();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    registerAccount: '',
    registerCountry: '',
    registerPassword: '',
    policy: false,
    registerInvitationCode: '',
  });

  const { getFormRules } = useFormRules(formData);
  const { validForm } = useFormValid(formRef);
  const { resetFields } = useResetFields(formRef);

  async function handleRegister() {
    const data = await validForm();
    console.log('註冊資訊:', data);
    if (!data) return;
  }

  watchEffect(async () => {
    //當login modal關起來時，重置表單
    if (!props.openModal) await resetFields();
  });
</script>
<style scoped lang="less">
  .custom-login-form {
    :deep(input:-webkit-autofill) {
      box-shadow: 0 0 0 1000px #f6f7f9 inset !important;
    }

    .prefix-icon {
      margin-right: 10px;
      border-right: 1px solid #e1e1e1;
      padding-right: 10px;
    }

    .input-no-border {
      border: none;
      background-color: #f6f7f9;
      border-radius: 3px;

      :deep(.ant-input) {
        background-color: #f6f7f9;
      }

      :deep(.ant-input-lg) {
        font-size: 14px;
      }

      &:focus {
        box-shadow: inset 0 0 0 2px rgb(245 176 154 / 46%);
      }
    }

    .strengthMeter-no-border {
      :deep(.ant-input-affix-wrapper) {
        border: none;
        background-color: #f6f7f9;
        border-radius: 3px;
      }

      :deep(.ant-input) {
        background-color: #f6f7f9;
      }

      :deep(.ant-input-lg) {
        font-size: 14px;
      }

      &:focus {
        box-shadow: inset 0 0 0 2px rgb(245 176 154 / 46%);
      }
    }

    .select-no-border {
      font-size: 14px;

      :deep(.ant-select-selector) {
        border: none;
        background-color: #f6f7f9;
        border-radius: 3px;
      }

      :deep(.ant-input) {
        background-color: #f6f7f9;
      }

      :deep(.ant-input-lg) {
        font-size: 14px;
      }

      &:focus {
        box-shadow: inset 0 0 0 2px rgb(245 176 154 / 46%);
      }
    }

    .select-icon {
      &::before {
        content: url('/src/assets/svg/icon-earth.svg');
        width: 20px;
        height: 20px;
        position: absolute;
        z-index: 1;
        top: 10px;
        left: 10px;
      }

      &::after {
        content: '';
        margin-right: 10px;
        border-right: 1px solid #e1e1e1;
        padding-right: 10px;
        width: 20px;
        height: 15px;
        position: absolute;
        z-index: 1;
        top: 10px;
        left: 15px;
      }

      :deep(.ant-select-selector) {
        padding-left: 50px;
      }
    }

    :deep(.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input)
        .ant-select-selector) {
      box-shadow: inset 0 0 0 2px rgb(245 176 154 / 46%);
    }

    :deep(.ant-input-affix-wrapper-focused) {
      box-shadow: inset 0 0 0 2px rgb(245 176 154 / 46%);
    }

    .custom-btn-warning {
      width: 80%;
    }
  }
</style>
