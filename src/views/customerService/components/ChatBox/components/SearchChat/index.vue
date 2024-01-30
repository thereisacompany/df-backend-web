<template>
  <div id="searchChat" class="search-chat">
    <div class="flex">
      <div class="head">
        {{ getHeadName(userInfo.friendName) }}
      </div>
      <div class="head-name">{{ userInfo.friendName }}</div>
    </div>

    <div class="search-box" v-if="false">
      <a-input-group compact class="coustom-annual-area">
        <a-select
          class="auto-complete-first"
          v-model:value="searchData.startYear"
          placeholder="年度(起)"
          :options="yearOptions"
          @change="checkYear"
        />
        <input
          placeholder="~"
          type="text"
          class="ant-input ant-input-disabled year-space"
          disabled
        />
        <a-select
          class="auto-complete-last"
          v-model:value="searchData.endYear"
          placeholder="年度(迄)"
          :options="yearOptions"
          @change="checkYear"
        />
      </a-input-group>
      <a-input
        v-model:value="searchData.keyword"
        :placeholder="t('component.chatRoom.searchChatHistory')"
        @press-enter="handleEnter"
      />
      <span class="spna-text" v-if="searchData.total">
        {{ searchData.nowIndex }}/{{ searchData.total }}
      </span>
      <Icon
        class="arrow-up-icon"
        icon="ant-design:up-outlined"
        v-if="searchData.total > 0"
        :size="iconSize"
        @click="handleFilter('up')"
      />
      <Icon
        class="arrow-down-icon"
        icon="ant-design:down-outlined"
        v-if="searchData.total > 0"
        :size="iconSize"
        @click="handleFilter('down')"
      />
      <Icon
        v-if="searchData.total === 0"
        class="search-icon"
        icon="akar-icons:search"
        :size="iconSize"
        @click="handleSearch"
      />
    </div>
    <div class="status"
      ><Icon icon="carbon:dot-mark" :style="{ color: '#E7582B' }" /><span class="ml-2">
        {{ t('component.chatRoom.processing') }}
      </span></div
    >
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, nextTick, reactive, watch, ref } from 'vue';
  import { InputGroup, Select } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { useI18n } from '/@/hooks/web/useI18n';
  import dayjs from 'dayjs';

  import { showMsg } from '/@/utils/globalTips';
  import {
    getHeadName,
    getNearlyThreeYears,
    getTalkList,
    getChatData,
  } from '/@/views/customerService/common';

  export default defineComponent({
    components: {
      Icon,
      AInputGroup: InputGroup,
      ASelect: Select,
    },
    props: {
      userInfo: { type: Object as PropType<any> },
      chatList: { type: Array },
    },
    emits: ['update:chatList', 'go-center-anchor', 'set-loading'],
    setup(props, { emit }) {
      const { t } = useI18n();
      /*=========values=========*/
      const iconSize = ref<any>(17);
      const searchData = reactive<any>({
        keyword: null,
        total: 0,
        nowIndex: 0,
        filterResults: [],
        startYear: null,
        endYear: null,
      });

      //Year
      const yearOptions = ref<any>([]);

      /*=========function=========*/
      async function handleSearch() {
        if (checkYear()) {
          emit('set-loading', true);
          const info = props.userInfo;
          const model = {
            jobId: '',
            fromTGid: info.tgId,
            toTGid: info.friendId,
            SDateTime: `${searchData.startYear}/01/01`,
            EDatetime: `${searchData.endYear}/12/31`,
          };
          const value = searchData.keyword;
          const res = await getTalkList(model);
          let array = getChatData(res, info);

          //初始化
          searchData.total = 0;
          searchData.nowIndex = 0;
          searchData.filterResults = [];

          for (let i = 0; i < array.length; i++) {
            let element = array[i];
            element.isSeach = false; //初始化

            if (value) {
              if (element.message && element.message.indexOf(value) > -1) {
                element.isSeach = true;
                searchData.total += 1;
                searchData.nowIndex += 1;
                searchData.filterResults.push(i);
              }
              for (let y = 0; y < element.files.length; y++) {
                const file = element.files[y];
                if (file.name && file.name.indexOf(value) > -1) {
                  element.isSeach = true;
                  searchData.total += 1;
                  searchData.nowIndex += 1;
                  searchData.filterResults.push(i);
                }
              }
            }
          }
          nextTick(() => {
            handleFilter();
            emit('update:chatList', array);
            emit('set-loading', false);
          });
        }
      }
      function handleFilter(type?) {
        if (type === 'up') {
          //上一個
          if (searchData.nowIndex > 1 && searchData.nowIndex <= searchData.total) {
            searchData.nowIndex -= 1;
          }
        } else {
          //下一個
          if (searchData.nowIndex < searchData.total) {
            searchData.nowIndex += 1;
          }
        }
        const index = searchData.filterResults[searchData.nowIndex - 1];
        if (index !== undefined) emit('go-center-anchor', '#row_' + index);
      }
      function handleEnter() {
        handleSearch();
      }

      //Year
      function getYearOptions() {
        const startYear = 2019;
        const nowYear = parseInt(dayjs().format('YYYY'));
        yearOptions.value = [];
        for (let index = startYear; index <= nowYear; index++) {
          const value = index.toString();
          yearOptions.value.push({ value: value, label: value });
        }
      }
      function checkYear() {
        return verifyYear(searchData);
      }
      function verifyYear(searchData) {
        const startYear = searchData.startYear ? searchData.startYear : null;
        const endYear = searchData.endYear ? searchData.endYear : null;
        let isCheck = true;
        if (startYear && endYear && startYear > endYear) {
          showMsg('warning', t('component.DTC.hintStartYear'));
          isCheck = false;
        } else if (startYear && endYear && endYear - startYear > 2) {
          showMsg('warning', t('component.DTC.hintAllYear'));
          isCheck = false;
        }
        return isCheck;
      }
      function filterOption(input: string, option: any) {
        return option.value.indexOf(input) >= 0;
      }
      function loadDefaultYear() {
        const years = getNearlyThreeYears();
        searchData.startYear = dayjs(years.sYear).format('YYYY');
        searchData.endYear = dayjs(years.eYear).format('YYYY');
      }

      watch(
        () => props.userInfo.id,
        () => {
          //初始化
          searchData.keyword = null;
          searchData.total = 0;
          searchData.nowIndex = 0;
          searchData.filterResults = [];
          loadDefaultYear();
        },
      );

      onMounted(() => {
        getYearOptions();
        loadDefaultYear();
      });
      /*=========data=========*/
      return {
        t,

        yearOptions,
        searchData,
        iconSize,
        getHeadName,
        handleSearch,
        handleFilter,
        handleEnter,

        //Year
        checkYear,
        filterOption,
      };
    },
  });
</script>
