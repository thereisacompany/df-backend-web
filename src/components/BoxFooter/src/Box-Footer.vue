<template>
  <div class="fixed bottom-0 right-0 z-40 fixed-box" :style="getWrapStyle">
    <div class="fixed-box-btns">
      <div class="flex items-center mr-3.5">
        {{ t('common.selected') }}：<p class="text-number mb-0 flex items-center font-bold"
          >( {{ itemCount }} )</p
        >&nbsp;{{ t('component.crmManagement.item') }}
      </div>

      <Divider type="vertical" class="divider" />
      <slot name="buttonGroup"></slot>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType, computed, CSSProperties, unref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { Divider } from 'ant-design-vue';
  export default defineComponent({
    components: {
      Divider,
    },
    props: {
      itemCount: {
        type: Number as PropType<any>,
      },
    },
    emits: [],
    setup(_) {
      //---*因應menu收折，計算寬度
      const { getFixed } = useHeaderSetting();
      const { getCalcContentWidth } = useMenuSetting();
      const { getIsMobile } = useAppInject();
      const getWrapStyle = computed((): CSSProperties => {
        const style: CSSProperties = {};
        if (unref(getFixed)) {
          style.width = unref(getIsMobile) ? '100%' : unref(getCalcContentWidth);
        }
        return style;
      });

      const { t } = useI18n();

      return {
        t,
        getWrapStyle,
      };
    },
  });
</script>
<style lang="less" scoped>
  .fixed-box {
    border: 0.5px solid #dcdcdc;

    background-color: #fff;
    box-shadow: 0 -3px 10px 0 rgb(0 0 0 / 27%), 0 -1px 2px -1px rgb(0 0 0 / 10%);
  }

  .fixed-box-btns {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
  }

  .divider {
    border-left: 1px solid #e4e4e4;
    height: 1.5em;
  }

  .text-number {
    color: @primary-color;
  }
</style>
