<template>
  <BasicModal
    :footer="null"
    :title="t('layout.header.lockScreen')"
    v-bind="$attrs"
    :class="prefixCls"
    @register="register"
    :centered="true"
  >
    <div :class="`${prefixCls}__entry`" style="padding: 70px 30px 30px">
      <div :class="`${prefixCls}__header`" class="flex">
        <Avatar v-if="getUserInfo.avatar == 'none'" :style="randomColor(getUserInfo.userId)">
          {{ userText }}
        </Avatar>
        <img :src="getUserInfo.avatar" :class="`${prefixCls}__header-img`" v-else />
        <p class="pl-2" :class="`${prefixCls}__header-name`">
          {{ getRealName }}
        </p>
      </div>

      <BasicForm @register="registerForm" />

      <div :class="`${prefixCls}__footer`">
        <a-button type="primary" block class="mt-2" @click="handleLock">
          {{ t('layout.header.lockScreenBtn') }}
        </a-button>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { Avatar } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicModal, useModalInner } from '/@/components/Modal/index';
  import { BasicForm, useForm } from '/@/components/Form/index';

  import { useUserStore } from '/@/store/modules/user';
  import { useLockStore } from '/@/store/modules/lock';
  import headerImg from '/@/assets/images/avatar.png';
  export default defineComponent({
    name: 'LockModal',
    components: { Avatar, BasicModal, BasicForm },

    setup() {
      const { t } = useI18n();
      const { prefixCls } = useDesign('header-lock-modal');
      const userStore = useUserStore();
      const lockStore = useLockStore();

      const getRealName = computed(() => userStore.getUserInfo?.realName);
      const [register, { closeModal }] = useModalInner();

      const [registerForm, { validateFields, resetFields }] = useForm({
        showActionButtonGroup: false,
        schemas: [
          {
            field: 'password',
            label: t('layout.header.lockScreenPassword'),
            colProps: {
              span: 24,
            },
            component: 'InputPassword',
            required: true,
          },
        ],
      });

      const getUserInfo = computed(() => {
        const { realName = '', avatar, desc, userId } = userStore.getUserInfo || {};
        return { userId, realName, avatar: avatar || headerImg, desc };
      });
      //使用者名字的第一個字母
      const userText = getUserInfo.value.realName.slice(0, 1);

      async function handleLock() {
        const values = (await validateFields()) as any;
        const password: string | undefined = values.password;
        closeModal();

        lockStore.setLockInfo({
          isLock: true,
          pwd: password,
        });
        await resetFields();
      }

      const avatar = computed(() => {
        const { avatar } = userStore.getUserInfo;
        return avatar || headerImg;
      });

      //---*頭像顏色
      const randomColor = (id) => {
        const x = Math.pow(10, String(id).length);
        return {
          backgroundColor: `#${Math.floor(id * (1 / x) * 16777215).toString(16)}`,
        };
      };

      return {
        t,
        prefixCls,
        getRealName,
        register,
        registerForm,
        handleLock,
        getUserInfo,
        userText,
        avatar,
        randomColor,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-lock-modal';

  .@{prefix-cls} {
    &__entry {
      position: relative;
      //height: 240px;
      padding: 130px 30px 30px;
      border-radius: 10px;
    }

    &__header {
      position: absolute;
      top: 0;
      left: calc(50% - 45px);
      width: auto;
      text-align: center;

      &-img {
        width: 70px;
        border-radius: 50%;
      }

      &-name {
        margin-top: 5px;
      }
    }

    &__footer {
      text-align: center;
    }
  }
</style>
