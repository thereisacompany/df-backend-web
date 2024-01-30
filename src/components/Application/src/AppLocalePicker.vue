<!--
 * @Author: Vben
 * @Description: Multi-language switching component
-->
<template>
  <Dropdown
    placement="bottom"
    :trigger="['click']"
    :dropMenuList="localeList"
    :selectedKeys="selectedKeys"
    @menu-event="handleMenuEvent"
    overlayClassName="app-locale-picker-overlay"
  >
    <span class="cursor-pointer flex items-center">
      <span v-if="showText" class="ml-1 text-white">
        {{ getLocaleText }}
        <Icon
          icon="material-symbols:arrow-drop-down-rounded"
          style="font-size: 20px; display: contents"
        />
      </span>
      <Icon v-if="showIcon" icon="ion:language" />
    </span>
  </Dropdown>
</template>
<script lang="ts" setup>
  import type { LocaleType } from '/#/config';
  import type { DropMenu } from '/@/components/Dropdown';
  import { ref, watchEffect, unref, computed, nextTick } from 'vue';
  import { Dropdown } from '/@/components/Dropdown';
  import { useLocale } from '/@/locales/useLocale';
  import { localeList } from '/@/settings/localeSetting';
  import { Icon } from '/@/components/Icon';

  const props = defineProps({
    /**
     * Whether to display text
     */
    showText: { type: Boolean, default: false },
    /**
     * Whether to refresh the interface when changing
     */
    reload: { type: Boolean },
    showIcon: { type: Boolean, default: false },
  });

  const selectedKeys = ref<string[]>([]);

  const { changeLocale, getLocale } = useLocale();

  const getLocaleText = computed(() => {
    const key = selectedKeys.value[0];
    if (!key) {
      return '';
    }
    return localeList.find((item) => item.event === key)?.text;
  });

  watchEffect(() => {
    selectedKeys.value = [unref(getLocale)];
  });

  async function toggleLocale(lang: LocaleType | string) {
    await changeLocale(lang as LocaleType);
    selectedKeys.value = [lang as string];
    props.reload && location.reload();

    nextTick(() => {
      location.reload();
    });
  }

  function handleMenuEvent(menu: DropMenu) {
    if (unref(getLocale) === menu.event) {
      return;
    }
    toggleLocale(menu.event as string);
  }
</script>

<style lang="less">
  .app-locale-picker-overlay {
    .ant-dropdown-menu-item {
      min-width: 160px;
    }
  }
</style>
