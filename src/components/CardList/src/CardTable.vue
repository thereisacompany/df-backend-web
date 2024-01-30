<template>
  <List
    :grid="{ gutter: 5, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }"
    :data-source="dataSource.dataSource"
    :pagination="paginationProp"
  >
    <template #header>
      <div class="flex justify-end space-x-2"><slot name="header"></slot> </div>
    </template>
    <template #renderItem="{ item, index }">
      <ListItem>
        <div style="background: #e4e4e4" class="pt-5 first:pt-0">
          <slot name="content" :item="item" :index="index"></slot>
        </div>
      </ListItem>
    </template>
  </List>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, watchEffect } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { getPercent, roundTo, currencyFormatter } from '/@/utils/formatNumber';
  //---*ant-design
  import { Steps, Row, Col, List } from 'ant-design-vue';
  //import type { TableProps } from 'ant-design-vue';
  //---*store & api
  //---*common components
  //---*components

  export default defineComponent({
    components: {
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,

      [Row.name]: Row,
      [Col.name]: Col,
      List,
      ListItem: List.Item,
    },
    props: {
      dataSource: {
        type: Object as PropType<any>,
      },
      loading: {
        type: Boolean as PropType<any>,
      },
    },
    emits: ['handleViewDetail', 'changePagination'],
    setup(props, { emit }) {
      const { t } = useI18n();

      //分頁相關
      const currentPage = ref(1);
      const pageSize = ref(10);
      const total = ref(0);
      const paginationProp = ref({
        showSizeChanger: false,
        showQuickJumper: true,
        pageSize,
        current: currentPage,
        total,
        showTotal: (total) => `${t('common.pageTotal')} ${total} ${t('common.pageItems')}`,
        onChange: pageChange,
        onShowSizeChange: pageSizeChange,
      });

      function pageChange(p, pz) {
        currentPage.value = p;
        pageSize.value = pz;
        emit('changePagination', { currentPage: currentPage.value, pageSize: pageSize.value });
      }
      function pageSizeChange(_current, size) {
        pageSize.value = size;
        emit('changePagination', { currentPage: currentPage.value, pageSize: pageSize.value });
      }

      watchEffect(() => {
        total.value = props.dataSource.total;
      });
      return {
        t,
        formatToDateTime,
        // handleTableChange,
        getPercent,
        roundTo,
        currencyFormatter,
        //分頁
        paginationProp,
      };
    },
  });
</script>
<style scoped lang="less">
  :deep(.ant-list-pagination) {
    text-align: center;
  }
</style>
