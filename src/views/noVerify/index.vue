<!-- 設定白名單IP權限 -->
<template>
  <div class="text-center">
    <div class="grid grid-cols-1 gap-4 place-content-center" style="height: 89vh">
      <div>
        <img
          src="/src/assets/svg/icon-lock.svg"
          style="width: 25vw; min-width: 275px; margin: 0 auto"
        />
      </div>
      <div class="text-3xl font-bold">{{ t('component.noVerify.access') }}</div>
      <div class="text-xl">{{ ip }}</div>
      <div class="text-xl">{{ t('component.noVerify.area') }}</div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUserStore } from '/@/store/modules/user';
  export default defineComponent({
    components: {},
    setup() {
      const { t } = useI18n();
      const userStore = useUserStore();
      const ip = ref<any>(null);

      onMounted(async () => {
        ip.value = await userStore.getRoleIP;
      });
      return {
        t,
        ip,
      };
    },
  });
</script>
