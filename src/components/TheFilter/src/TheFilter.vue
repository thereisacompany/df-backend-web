<!-- 篩選，樣式為共用 .\src\design\filter.less -->
<template>
  <div>
    <!-- 關鍵字篩選 -->
    <div class="filter-content mb-3">
      <Collapse class="filter-collapse" v-model:activeKey="activeKey" expandIconPosition="right">
        <!-- 篩選器摺疊的icon -->
        <template #expandIcon="{ isActive }">
          <Icon icon="ion:ios-arrow-up" :size="12" :rotate="isActive ? 180 : 0" />
        </template>
        <CollapsePanel class="collapse-body" key="1">
          <!-- 篩選器的title -->
          <template #header>
            <div class="title mt-2.5">
              <Icon icon="ion:funnel-outline" :size="12" class="mr-2.5" />
              <p>{{ t('common.filter') }}</p>
            </div>
          </template>

          <!-- 保留BasicForm空間，在父層使用 -->
          <div class="filter-min-width">
            <slot name="BasicForm"></slot>
          </div>

          <!-- 按鈕固定位置右下 -->
          <div class="buttons sm:grid sm:grid-cols-6 sm:gap-4">
            <p v-if="searchText" class="col-span-4 sm:text-left text-center sm:m-0 text-gray-400">
              <span class="mr-3">{{ t('common.searchResultFor') }} :</span>
              <template v-for="item in searchText" :key="item.title">
                <span class="mr-3" v-if="item.text != null"
                  >{{ item.title }} / {{ item.text }}</span
                >
              </template>
            </p>

            <div class="sm:flex col-end-7 col-span-2 sm:justify-end text-center">
              <div class="mt-5 sm:mt-0">
                <a-button
                  class="custom-reset-button custom-size-small mx-3"
                  size="small"
                  @click="clickReset()"
                  >{{ t('common.resetFilter') }}</a-button
                >
                <a-button
                  class="custom-btn-area-lightBlue custom-size-small mx-3"
                  size="small"
                  @click="clickSubmit()"
                  >{{ t('common.confirmSubmit') }}</a-button
                >
              </div>
            </div>
          </div>
        </CollapsePanel>
      </Collapse>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, PropType } from 'vue';
  import { Collapse, CollapsePanel } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    components: { Collapse, CollapsePanel, Icon },
    props: {
      searchText: {
        type: Array as PropType<any>,
      },
    },
    emits: ['click-submit', 'click-reset', 'click-pop-cancel'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const activeKey = ref('1');
      const advancedActiveKey = ref('0');
      const clickSubmit = () => {
        emit('click-submit');
      };
      const clickReset = () => {
        emit('click-reset');
      };

      return {
        t,
        activeKey,
        advancedActiveKey,
        clickSubmit,
        clickReset,
      };
    },
  });
</script>
