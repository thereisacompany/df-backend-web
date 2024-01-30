<template>
  <Form
    class="p-4 enter-x custom-login-form"
    :model="formData"
    :layout="'vertical'"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin2"
  >
    <FormItem :label="t('component.accountManagement.jobId')" name="loginAccount" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.loginAccount"
        :placeholder="t('component.backend.enterJob')"
        class="fix-auto-fill input-no-border"
      >
        <template #prefix>
          <div class="prefix-icon">
            <img src="/src/assets/svg/icon-user.svg" alt="" class="w-full" />
          </div>
        </template>
      </Input>
    </FormItem>
    <FormItem :label="t('sys.login.password')" name="loginPassword" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.loginPassword"
        autocomplete="false"
        :placeholder="t('sys.login.passwordPlaceholder')"
        class="input-no-border"
      >
        <template #prefix>
          <div class="prefix-icon">
            <img src="/src/assets/svg/icon-locker.svg" alt="" class="w-full" />
          </div>
        </template>
      </InputPassword>
    </FormItem>

    <FormItem class="enter-x text-center">
      <Button class="custom-btn-warning" size="large" @click="handleLogin2" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
    </FormItem>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';
  import { Form, Input, Button, FormInstance } from 'ant-design-vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useAppStore } from '/@/store/modules/app';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;

  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref<FormInstance>();
  const loading = ref(false);

  const formData = reactive({
    loginAccount: '',
    loginPassword: '',
  });

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin2() {
    const data = await validForm();
    if (!data) return;
    console.log('1111');
    loading.value = true;
    console.log('2222');
    // if (
    //   data.loginAccount !== '84540831984' &&
    //   data.loginAccount !== '84921946216' &&
    //   data.loginAccount !== '84999275629' &&
    //   data.loginAccount !== '84348926958' &&
    //   data.loginAccount !== '84611673624'
    // ) {
    //   createErrorModal({
    //     title: t('sys.api.errorTip'),
    //     content: t('sys.api.loginError'),
    //     getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
    //   });
    //   return;
    // }
    console.log(data);
    try {
      const userInfo = await userStore.loginLive({
        username: data.loginAccount,
        password: data.loginPassword,
        mode: 'none', //不要默认的错误提示
      });

      //登入驗證
      if (userInfo === 'NO_VERIFY') {
        console.log('444');
        userStore.setToken(undefined);
        userStore.setSessionTimeout(false);
        localStorage.clear();
        useAppStore().resetAllState();
        userStore.resetState();
        userStore.setUserInfo(null);
      } else if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
          duration: 3,
        });
      }
    } catch (error) {
    } finally {
      console.log('6666');
      loading.value = false;
    }
  }
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

    :deep(.ant-input-affix-wrapper-focused) {
      box-shadow: inset 0 0 0 2px rgb(245 176 154 / 46%);
    }

    .custom-btn-warning {
      width: 80%;
    }
  }
</style>
