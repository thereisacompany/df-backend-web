<template>
  <div class="table w-screen h-screen">
    <div class="table-cell align-middle">
      <div class="flex login w-full" style="max-width: 900px">
        <div class="hidden lg:flex xl:flex-col w-3/5 left -enter-x rounded-l-2xl"> </div>
        <div class="flex w-full py-5 xl:h-auto xl:py-0 xl:my-0 right">
          <div
            :class="`${prefixCls}-form`"
            class="relative w-full px-5 py-8 mx-auto my-3 rounded-md sm:px-8 xl:p-4 sm:w-3/4 lg:w-2/4 xl:w-3/4 enter-x"
          >
            <!-- 登入 -->
            <div class="login-tab-capsule">
              <a-tabs centered type="card" v-if="!isShowForgetPassword">
                <a-tab-pane key="LOGIN" :tab="t('sys.login.signInFormTitle')">
                  <!-- <MobileForm /> -->
                  <LoginForm />
                </a-tab-pane>
              </a-tabs>
            </div>

            <!-- envMode -->
            <div v-if="envMode != '正式站'" class="text-xl text-rose-600 m-3">{{ envMode }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { Tabs, TabPane } from 'ant-design-vue';
  import LoginForm from './LoginForm.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { LoginStateEnum, useLoginState } from './useLogin';

  const { prefixCls } = useDesign('login');
  const { t } = useI18n();
  const { getLoginState } = useLoginState();
  const ATabs = Tabs;
  const ATabPane = TabPane;
  const globSetting = useGlobSetting();
  const envMode = globSetting.envMode;

  const isShowForgetPassword = computed(
    () => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD,
  );
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  @logo-prefix-cls: ~'@{namespace}-app-logo';
  @countdown-prefix-cls: ~'@{namespace}-countdown-input';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;

      &::before {
        background: #000000;
      }

      .ant-input,
      .ant-input-password {
        background-color: #232a3b;
      }

      .ant-btn:not(.ant-btn-link):not(.ant-btn-primary) {
        border: 1px solid #4a5569;
      }

      &-form {
        background: transparent !important;
      }

      .app-iconify {
        color: #fff;
      }
    }

    input.fix-auto-fill,
    .fix-auto-fill input {
      -webkit-text-fill-color: #c9d1d9 !important;
      box-shadow: inherit !important;
    }
  }

  .@{prefix-cls} {
    min-height: 100%;
    overflow: hidden;
    background: #000000;

    @media (max-width: @screen-xl) {
      background-color: #293146;

      .@{prefix-cls}-form {
        background-color: #fff;
      }
    }

    .@{logo-prefix-cls} {
      position: absolute;
      top: 12px;
      height: 30px;

      &__title {
        font-size: 16px;
        color: #fff;
      }

      img {
        width: 32px;
      }
    }

    .container {
      .@{logo-prefix-cls} {
        display: flex;
        width: 60%;
        height: 80px;

        &__title {
          font-size: 24px;
          color: #fff;
        }

        img {
          width: 48px;
        }
      }
    }

    &-sign-in-way {
      .anticon {
        font-size: 22px;
        color: #888;
        cursor: pointer;

        &:hover {
          color: @primary-color;
        }
      }
    }

    input:not([type='checkbox']) {
      min-width: 360px;

      @media (max-width: @screen-xl) {
        min-width: 320px;
      }

      @media (max-width: @screen-lg) {
        min-width: 260px;
      }

      @media (max-width: @screen-md) {
        min-width: 240px;
      }

      @media (max-width: @screen-sm) {
        min-width: 160px;
      }
    }

    .@{countdown-prefix-cls} input {
      min-width: unset;
    }

    .ant-divider-inner-text {
      font-size: 12px;
      color: @text-color-secondary;
    }
  }
  //登入
  .login {
    margin: auto;
    height: 700px;

    .left {
      height: auto;

      position: relative;
      background-image: url(/src/assets/images/login-image.jpg);
      background-size: cover;
    }

    .right {
      background-color: @white;
      @media screen and (max-width: @screen-md) {
        border-radius: 1rem;
      }

      @media screen and (min-width: @screen-md) {
        border-radius: 1rem;
      }

      @media screen and (max-width: @screen-sm) {
        border-radius: 1rem;
      }
      @media screen and (min-width: @screen-lg) {
        border-radius: 0 1rem 1rem 0;
      }

      @media screen and (min-width: @screen-xl) {
        border-radius: 0 1rem 1rem 0;
      }
      @media screen and (min-width: @screen-2xl) {
        border-radius: 0 1rem 1rem 0;
      }
    }

    .login-tab-capsule {
      //height: 60vh;

      .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
        color: @white;
      }

      .ant-tabs-tab:hover,
      .ant-tabs-tab:focus {
        color: @black;
      }

      .ant-tabs-card > .ant-tabs-nav::before {
        display: none !important;
      }

      .ant-tabs-card {
        .ant-tabs-nav-list {
          background: #f6f7f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          padding: 8px 5px;
        }

        .ant-tabs-tab {
          background: transparent;
          border-color: transparent;
          height: 34px;
          width: 120px;
          text-align: center;
          justify-content: center;
        }

        .ant-tabs-tab-active {
          background: #252525;
        }

        .ant-tabs-nav {
          margin-bottom: 80px;
        }

        .ant-tabs-nav .ant-tabs-tab:first-child {
          border-radius: 8px;
        }

        .ant-tabs-nav .ant-tabs-tab:nth-child(2) {
          margin-left: 2px;
          border-radius: 0px 8px 8px 0px;
        }
      }
    }
  }
</style>
