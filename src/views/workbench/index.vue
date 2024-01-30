<template>
  <Card>
    <div class="lg:flex">
      <div>
        <Avatar v-if="userinfo.avatar == 'none'" :style="randomColor(userinfo.userId)">
          {{ userText }}
        </Avatar>
        <img :src="userinfo.avatar" v-else />
      </div>
      <div class="md:ml-6 flex flex-col justify-center md:mt-0 mt-2">
        <h1 class="md:text-lg text-md">Hi, {{ userinfo.realName }}</h1>
      </div>
    </div>
  </Card>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { Card, Avatar } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  const userinfo = computed(() => userStore.getUserInfo);
  // const userText = userinfo.value.realName.slice(0, 1);

  let userText;

  try {
    // userText = userinfo.value.realName.slice(0, 1);
    userText = userinfo.value.realName?.slice(0, 1) || '';
  } catch (error) {
    console.error('Error while processing userText:', error);
    // 給 userText 一個預設值，例如空字符串
    userText = 'Admin';
  }

  //---*頭像顏色
  const randomColor = (id) => {
    const x = Math.pow(10, String(id).length);
    return {
      backgroundColor: `#${Math.floor(id * (1 / x) * 16777215).toString(16)}`,
      width: '70px',
      height: '70px',
      'line-height': '70px',
      'font-size': '35px',
    };
  };
</script>
