<template>
  <span class="vip-tag">
    <table>
      <tr>
        <td><Icon icon="ri:vip-fill" :size="titleSize" /></td>
        <td v-show="value != null" :style="{ 'font-size': `${numSize}px` }">{{ value }}</td>
      </tr>
    </table>
  </span>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Icon } from '/@/components/Icon';
  export default defineComponent({
    components: { Icon },
    props: {
      value: { type: Number as PropType<any> },
      titleSize: { type: Number as PropType<any>, default: 34 },
      numSize: { type: Number as PropType<any>, default: 16 },
    },
    setup() {
      return {};
    },
  });
</script>
<style lang="less">
  .vip-tag {
    padding-left: 15px;

    .app-iconify {
      margin-right: 5px;
      display: contents !important;
    }

    td {
      color: #dedede;
      font-weight: bold;
    }
  }
</style>
