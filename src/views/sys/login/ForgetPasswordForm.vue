<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x form-title" />

    <Form
      class="p-4 enter-x custom-login-form"
      :model="formData"
      :rules="getFormRules"
      ref="formRef"
      :layout="'vertical'"
    >
      <!-- <FormItem name="forgetAccount" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.forgetAccount"
          :placeholder="t('sys.login.userName')"
          class="fix-auto-fill input-no-border"
        />
      </FormItem> -->
      <FormItem :label="t('sys.login.email')" name="forgetEmail" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.forgetEmail"
          :placeholder="t('sys.login.email')"
          class="fix-auto-fill input-no-border"
        >
          <template #prefix>
            <div class="prefix-icon">
              <img src="/src/assets/svg/icon-user.svg" alt="" class="w-full" />
            </div>
          </template>
        </Input>
      </FormItem>

      <FormItem class="enter-x text-center">
        <Button
          class="custom-btn-warning"
          size="large"
          block
          @click="handleReset"
          :loading="loading"
        >
          {{ t('common.submit') }}
        </Button>
        <Button
          type="link"
          size="small"
          class="custom-btn-link mt-5"
          block
          @click="handleBackLogin"
        >
          <Icon icon="icon-park-outline:return" :size="14" />
          {{ t('sys.login.backSignIn') }}
        </Button>
      </FormItem>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, useFormRules, LoginStateEnum } from './useLogin';
  import { Icon } from '/@/components/Icon';
  const FormItem = Form.Item;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    forgetAccount: '',
    forgetEmail: '',
  });

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);

  async function handleReset() {
    const form = unref(formRef);
    if (!form) return;
    await form.resetFields();
  }
</script>
<style scoped lang="less">
  .form-title {
    margin-bottom: 80px;
    text-align: center;
  }

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

    :deep(
        .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input)
          .ant-select-selector
      ) {
      box-shadow: inset 0 0 0 2px rgb(245 176 154 / 46%);
    }

    :deep(.ant-input-affix-wrapper-focused) {
      box-shadow: inset 0 0 0 2px rgb(245 176 154 / 46%);
    }

    .custom-btn-warning,
    .custom-btn-default {
      width: 80%;
    }
  }
</style>
