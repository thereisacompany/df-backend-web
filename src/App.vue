<template>
  <div>
    <ConfigProvider :locale="getAntdLocale">
      <div :class="{ scrollRWD: deviceType == 'mobile' }" style="width: 100%; height: 100vh">
        <AppProvider>
          <RouterView />
        </AppProvider>
      </div>
    </ConfigProvider>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, onUnmounted, ref } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';
  import { useAppStore } from '/@/store/modules/app';

  // import { createConnection, doSubscribe } from '/@/utils/MQTT';
  // import { useMQTTStore } from '/@/store/modules/page/MQTT';

  import 'dayjs/locale/zh-cn';
  //---value
  const { getAntdLocale } = useLocale(); //local
  // Listening to page changes and dynamically changing site titles
  useTitle();
  //---*判斷裝置螢幕大小
  const screenWidth = ref(document.body.clientWidth);
  const screenHeight = ref(document.body.clientHeight);

  onMounted(async () => {
    //裝置螢幕大小
    window.onresize = () => {
      screenWidth.value = document.body.clientWidth;
      screenHeight.value = document.body.clientHeight;
    };
    useAppStore().setScreenSize(screenWidth.value, screenHeight.value);

    // //無帳號連接MQTT
    // if (!getUserInfo.value.userId) {
    //   createConnection('noAccount');
    //   setTimeout(() => {
    //     doSubscribe();
    //   }, 30);
    // }
  });

  onUnmounted(async () => {
    window.onresize = null; //移除判斷裝置大小
  });

  //---*裝置螢幕大小
  if (screenWidth.value > 560) {
    useAppStore().setDeviceType('pc');
  } else {
    useAppStore().setDeviceType('mobile');
  }
  const deviceType = useAppStore().getDeviceType;

  // if (getUserInfo.value.userId) {
  //   //---*連接MQTT
  //   useMQTTStore().setSubscription();
  //   createConnection(getUserInfo.value.userId);
  //   doSubscribe();
  // }

  // watch(
  //   () => getUserInfo.value,
  //   async () => {
  //     console.log('MQTT', getUserInfo.value);

  //     //---*連接MQTT
  //     useMQTTStore().setSubscription();
  //     createConnection(getUserInfo.value.userId);
  //     doSubscribe();
  //   },
  // );
</script>
<style lang="less">
  @bg-black: #000000;

  .scrollRWD {
    z-index: 1;
    position: absolute;
  }

  body {
    background: #000;

    .ant-layout {
      background: @bg-black;
    }
  }
</style>
