<template>
  <div class="main-title-box">
    <div class="relative z-10">{{ title }}</div>
    <div class="sub-title" v-if="subTitle">{{ subTitle }}</div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  export default defineComponent({
    components: {},
    props: {
      title: { type: String as PropType<any> },
      subTitle: { type: String as PropType<any> },
    },
    setup() {
      return {};
    },
  });
</script>
<style lang="less">
  .main-title-box {
    font-size: 32px;
    color: #fff;
    text-align: center;
    position: relative;
    margin: 45px 0;
    font-weight: bold;
  }

  .main-title-box::before {
    content: '';
    background-image: url('/src/assets/images/title-left.png');
    height: 62px;
    top: 10px;
    left: 0;
    position: absolute;
    width: 575px;
  }

  .main-title-box::after {
    content: '';
    background-image: url('/src/assets/images/title-right.png');
    height: 62px;
    top: 10px;
    right: 0;
    position: absolute;
    width: 575px;
  }

  .sub-title {
    color: #fff;
    text-align: center;
    font-size: 16px;
    margin-top: 35px;
  }
</style>
