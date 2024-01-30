<template>
  <BasicModal
    :wrapClassName="'login-modal'"
    v-bind="$attrs"
    :centered="true"
    @register="registerModal"
    :draggable="false"
    :can-fullscreen="false"
    :footer="null"
    :height="700"
    :useWrapper="false"
    :min-height="700"
    @visible-change="handleVisibleChange"
  >
    <login :open-modal="isOpenModal" :type="typeOfModal" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Input } from 'ant-design-vue';
  import login from '/@/views/sys/login/Login.vue';
  export default defineComponent({
    components: { BasicModal, login, [Input.name]: Input },

    emits: ['register', 'approved'],
    setup() {
      const { t } = useI18n();
      const typeOfModal = ref('');
      const [registerModal, {}] = useModalInner((data) => {
        data;
        typeOfModal.value = data.type;
      });
      const isOpenModal = ref(false);
      function handleVisibleChange(v) {
        v;
        isOpenModal.value = v;
        if (!v) typeOfModal.value = 'null';
      }
      return {
        t,
        registerModal,
        handleVisibleChange,
        isOpenModal,
        typeOfModal,
      };
    },
  });
</script>
<style lang="less" scoped></style>
