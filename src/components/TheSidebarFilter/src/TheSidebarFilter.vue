<template>
  <div class="p-6 main-contanier">
    <!-- 側邊欄篩選器 -->
    <div class="filter-wrapper">
      <div class="filter-sidebar rounded-2xl" :style="{ height: height }">
        <!-- 個人資料卡片-外層黑色底 -->
        <div class="personal-card">
          <div class="round-div">
            <div class="info-div w-4/5">
              <div class="left-info">
                <Icon icon="ri:vip-fill" :size="26" />
                <span class="m-1 font-bold">1</span>
                <span>普通會員</span>
              </div>
              <button @click="clickQuestionBtn">
                <div class="question-mark">
                  <span class="question-icon">?</span>
                </div>
              </button>
            </div>
          </div>
          <!-- 下方頭貼與帳號 -->
          <div class="avatar-card shadow-lg">
            <button @click="clickAvatar">
              <Avatar
                src="https://br.web.img3.acsta.net/c_310_420/pictures/19/08/14/22/33/0632419.jpg"
                :size="74"
            /></button>
            <span class="text-sm font-bold mt-2">messi666888</span>
          </div>
        </div>
        <!-- 保留BasicForm空間，在父層使用 -->
        <!-- menu -->
        <slot name="BasicForm"></slot>
      </div>
      <div class="filter-main">
        <!-- 保留body空間，在父層使用 -->
        <slot name="ContentBody"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import '/@/design/member.less';
  import { defineComponent } from 'vue';
  import { Avatar } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { useGo } from '/@/hooks/web/usePage';

  export default defineComponent({
    components: { Avatar, Icon },
    props: {
      height: { type: String, default: '590px' },
    },
    setup() {
      const go = useGo();

      // 問號按鈕
      // TODO: 點擊後跳頁到會員分級說明頁
      function clickQuestionBtn() {
        console.log('clickQuestionBtn');
        go(`/backend/customerService`);
      }

      // 頭貼
      // TODO: 跳更換頭貼頁面
      function clickAvatar() {
        console.log('clickAvatar');
      }

      return { clickQuestionBtn, clickAvatar };
    },
  });
</script>
