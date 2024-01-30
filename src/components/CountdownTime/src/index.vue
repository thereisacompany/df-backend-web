<template>
  <div class="countdown-time" v-if="eDate">
    <div class="countdown-time-title">
      <Icon icon="ion:football-sharp" :size="16" color="#E0B674" />
      {{ title }}
    </div>

    <table>
      <tr>
        <td class="time">{{ hour }}</td>
        <td class="colon">:</td>
        <td class="time">{{ minute }}</td>
        <td class="colon">:</td>
        <td class="time">{{ second }}</td>
      </tr>
    </table>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, PropType, ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  export default defineComponent({
    components: { Icon },
    props: {
      eDate: { type: String as PropType<any> },
      title: { type: String as PropType<any> },
    },
    setup(props) {
      const hour = ref<any>('');
      const minute = ref<any>('');
      const second = ref<any>('');
      function loadData(eDate) {
        var deadline = new Date(eDate).getTime();

        var x = setInterval(function () {
          var now = new Date().getTime();
          var t = deadline - now;

          var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((t % (1000 * 60)) / 1000);

          hour.value = hours >= 10 ? hours.toString() : `0${hours}`;
          minute.value = minutes >= 10 ? minutes.toString() : `0${minutes}`;
          second.value = seconds >= 10 ? seconds.toString() : `0${seconds}`;

          if (t < 0) {
            clearInterval(x);
            hour.value = '0';
            minute.value = '0';
            second.value = '0';
          }
        }, 1000);
      }

      onMounted(() => {
        if (props.eDate) loadData(props.eDate);
      });
      return { hour, minute, second };
    },
  });
</script>
<style lang="less">
  .countdown-time {
    text-align: center;

    .countdown-time-title {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1rem;
      text-align: left;
    }

    .time {
      font-size: 16px;
      width: 34px;
      height: 29px;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.4) 0%,
        rgba(255, 255, 255, 0) 13.54%,
        rgba(255, 255, 255, 0.0661654) 84.9%,
        rgba(255, 255, 255, 0.4) 100%
      );
      border-radius: 3px;
    }

    .colon {
      font-size: 16px;
      font-weight: bold;
      width: 10px;
    }
  }
</style>
