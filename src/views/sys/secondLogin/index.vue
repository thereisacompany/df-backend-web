<template>
  <div class="relative w-full h-full">
    <div class="app-loading">
      <div class="app-loading-wrap">
        <img src="/src/assets/images/logo.png" class="app-loading-logo" alt="Logo" />
        <div class="app-loading-title"></div>
        <div class="app-loading-dots">
          <span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" scoped>
  import { defineComponent, ref, onMounted, reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { useRoute, useRouter } from 'vue-router';
  import { useMessage } from '/@/hooks/web/useMessage';
  //test
  import { useUserStore } from '/@/store/modules/user';
  interface routeInfo {
    TG: string;
    url: string;
  }
  export default defineComponent({
    components: {},
    setup() {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      // const go = useGo();
      const router = useRouter();
      const route = useRoute();
      const userStore = useUserStore();

      const loadingRef = ref(true);
      const routeInfo = reactive<routeInfo>({
        TG: String(route.query.TG),
        url: String(route.query.url),
      });
      onMounted(async () => {
        if (routeInfo.TG != 'undefined') {
          try {
            const userInfo = await userStore.loginTG(routeInfo.url, {
              tgid: routeInfo.TG,
              mode: 'none', //不要默认的错误提示
            });

            if (userInfo) {
              //修改密碼完畢 登入成功
              notification.success({
                message: t('sys.login.loginSuccessTitle'),
                description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
                duration: 3,
              });
            } else {
              //如果沒有userInfo，自動跳到登入頁
              await router.replace('/login');
            }
          } catch (error) {
            //如果沒有toke，自動跳到登入頁

            await router.replace('/login');
          }
        } else {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: 'Login error',
          });
        }
      });

      return {
        t,
        loadingRef,

        router,
        route,
      };
    },
  });
</script>
<style>
  @keyframes antRotate {
    to {
      transform: rotate(405deg);
    }
  }
  @keyframes antRotate {
    to {
      transform: rotate(405deg);
    }
  }
  @keyframes antSpinMove {
    to {
      opacity: 100%;
    }
  }
  @keyframes antSpinMove {
    to {
      opacity: 100%;
    }
  }

  html[data-theme='dark'] .app-loading {
    background-color: #2c344a;
  }

  html[data-theme='dark'] .app-loading .app-loading-title {
    color: rgb(255 255 255 / 85%);
  }

  .app-loading {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: #000;
  }

  .app-loading .app-loading-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    transform: translate3d(-50%, -50%, 0);
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .app-loading .dots {
    display: flex;
    padding: 98px;
    justify-content: center;
    align-items: center;
  }

  .app-loading .app-loading-title {
    display: flex;
    margin-top: 30px;
    font-size: 30px;
    color: rgb(255 255 255 / 85%);
    justify-content: center;
    align-items: center;
    font-family: Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  }

  .app-loading .app-loading-logo {
    display: block;
    width: 100%;
    margin: 0 auto;
  }

  .dot {
    position: relative;
    display: inline-block;
    width: 28px;
    height: 28px;
    margin-top: 30px;
    font-size: 10px;
    transform: rotate(45deg);
    box-sizing: border-box;
    animation: antRotate 1.2s infinite linear;
  }

  .dot i {
    position: absolute;
    display: block;
    width: 15px;
    height: 15px;
    background-color: #fff;
    border-radius: 100%;
    opacity: 30%;
    transform: scale(0.75);
    animation: antSpinMove 1s infinite linear alternate;
    transform-origin: 50% 50%;
  }

  .dot i:nth-child(1) {
    top: 0;
    left: 0;
  }

  .dot i:nth-child(2) {
    top: 0;
    right: 0;
    animation-delay: 0.4s;
  }

  .dot i:nth-child(3) {
    right: 0;
    bottom: 0;
    animation-delay: 0.8s;
  }

  .dot i:nth-child(4) {
    bottom: 0;
    left: 0;
    animation-delay: 1.2s;
  }
</style>
