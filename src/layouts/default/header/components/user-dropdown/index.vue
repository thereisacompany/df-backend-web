<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <Avatar
        v-if="getUserInfo.avatar == 'none'"
        :class="`${prefixCls}__header`"
        :style="randomColor(getUserInfo.userId)"
        >{{ userText }}</Avatar
      >
      <img v-else :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />

      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate" style="margin-right: 30px">
          {{ getUserInfo.realName }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <!-- <MenuItem
          key="personal"
          :text="t('layout.header.dropdownItemPersonal')"
          icon="ion:person-outline"
          v-if="getShowDoc"
        />
        <MenuDivider v-if="getShowDoc" /> -->
        <MenuItem
          v-if="getUseLockPage"
          key="lock"
          :text="t('layout.header.tooltipLock')"
          icon="ion:lock-closed-outline"
        />
        <MenuItem
          key="logout"
          :text="t('layout.header.dropdownItemLoginOut')"
          icon="ion:power-outline"
        />
      </Menu>
    </template>
  </Dropdown>
  <LockAction @register="register" />
</template>
<script lang="ts">
  // components
  import { Dropdown, Menu, Avatar } from 'ant-design-vue';

  import { defineComponent, computed } from 'vue';
  import headerImg from '/@/assets/images/avatar.png';

  //import { DOC_URL } from '/@/settings/siteSetting';

  import { useUserStore } from '/@/store/modules/user';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';

  import { propTypes } from '/@/utils/propTypes';
  //import { openWindow } from '/@/utils';
  import { useGo } from '/@/hooks/web/usePage';

  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  type MenuEvent = 'logout' | 'personal' | 'lock';

  export default defineComponent({
    name: 'UserDropdown',
    components: {
      Dropdown,
      Menu,
      MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
      //MenuDivider: Menu.Divider,
      LockAction: createAsyncComponent(() => import('../lock/LockModal.vue')),
      Avatar,
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown');
      const { t } = useI18n();
      const go = useGo();
      const { getShowDoc, getUseLockPage } = useHeaderSetting();
      const userStore = useUserStore();

      const getUserInfo = computed(() => {
        const { realName = '', avatar, desc, userId } = userStore.getUserInfo || {};
        return { userId, realName, avatar: avatar || headerImg, desc };
      });
      //使用者名字的第一個字母
      // const userText = getUserInfo.value.realName.slice(0, 1) || '';
      const userText = getUserInfo.value.realName
        ? getUserInfo.value.realName.slice(0, 1)
        : 'Admin';

      const [register, { openModal }] = useModal();

      function handleLock() {
        openModal(true);
      }

      //  login out
      function handleLoginOut() {
        userStore.confirmLoginOut();
      }

      // open personal
      function openPersonal() {
        go('/backend/personal');
      }

      function handleMenuClick(e: { key: MenuEvent }) {
        console.log('>>>');
        switch (e.key) {
          case 'logout':
            handleLoginOut();
            break;
          case 'personal':
            openPersonal();
            break;
          case 'lock':
            handleLock();
            break;
        }
      }

      //---*頭像顏色
      const randomColor = (id) => {
        const x = Math.pow(10, String(id).length);
        return {
          backgroundColor: `#${Math.floor(id * (1 / x) * 16777215).toString(16)}`,
        };
      };

      return {
        prefixCls,
        t,
        getUserInfo,
        handleMenuClick,
        getShowDoc,
        register,
        getUseLockPage,
        userText,
        randomColor,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    .ant-avatar {
      width: 24px;
      height: 24px;
      line-height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
