import { ref, reactive } from 'vue';
import { useTimeStore } from '@/stores/time';

const useTimeEffect = () => {
  const defaultBtnIndex = ref(0);
  const timeStore = useTimeStore();
  const dateObj = reactive({ ...timeStore.dateObj });
  const handleChangeDate = (dateRange) => {
    const [startRoundDate, endRoundDate] = dateRange;
    dateObj.startRoundDate = startRoundDate;
    dateObj.endRoundDate = endRoundDate;
  };

  return {
    defaultBtnIndex,
    dateObj,
    handleChangeDate,
  };
};

export { useTimeEffect };
