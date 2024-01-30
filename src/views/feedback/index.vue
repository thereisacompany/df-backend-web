<template>
  <div>
    <PageWrapper :fixSmallWidth="false" class="custom-pageTitle">
      <PageHeader :title="t('routes.menu.Feedback')" />
      <!-- TheFilter -->
      <TheFilter
        :advanced="false"
        :showBtn="false"
        @click-reset="handleReset"
        @click-submit="handleSubmit"
      >
        <template #BasicForm>
          <BasicForm
            ref="formSearchRef"
            layout="vertical"
            :schemas="schemas"
            :labelWidth="186"
            :baseColProps="{ span: 24 }"
            :baseRowStyle="{ alignItems: 'end' }"
            :wrapperCol="{ span: 21 }"
            :showActionButtonGroup="false"
          />
        </template>
      </TheFilter>

      <!-- BasicTable -->
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <Tooltip :title="t('common.reply')" placement="bottom">
              <a-button
                type="primary"
                preIcon="carbon:mail-reply"
                size="small"
                @click="handleOpen(record)"
              />
            </Tooltip>
          </template>
        </template>
      </BasicTable>

      <!-- 詳細資料 -->
      <Detail ref="detailRef" @reload="handleSubmit" />
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { PageHeader, Tooltip } from 'ant-design-vue';
  import { TheFilter } from '/@/components/TheFilter';
  import { BasicForm } from '/@/components/Form/index';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';

  //components
  import Detail from './components/Detail/index.vue';

  //data
  import { schemas, columns } from './data';

  // store & api
  import { getFeedbackList } from '/@/api/page/feedback';

  export default defineComponent({
    components: {
      PageWrapper,
      PageHeader,
      BasicTable,
      Tooltip,
      TheFilter,
      BasicForm,
      Detail,
    },

    setup() {
      const { t } = useI18n();

      //TheFilter
      const formSearchRef = ref<any>(null);
      const search = reactive({
        beginDate: '',
        endDate: '',
        member: '',
        currentPage: 0,
        pageSize: 10,
      });

      //BasicTable
      const [registerTable, { reload, setPagination }] = useTable({
        rowKey: 'id',
        columns,
        loading: true,
        striped: false,
        canResize: false,
        showIndexColumn: false,
        api: async (pageObjcet = { page: 0, pageSize: 10 }) => {
          return getItemsApi(pageObjcet);
        },
      });

      //詳細資料
      const detailRef = ref<any>(null);

      /*=========function=========*/
      //TheFilter
      async function handleReset() {
        await formSearchRef.value.resetFields();

        setTimeout(async () => {
          handleSubmit();
        }, 500);
      }

      function handleSubmit() {
        //初始化
        search.currentPage = 0;
        setPagination({ current: 1 });

        //取得查詢項目
        const values = formSearchRef.value.getFieldsValue();
        search.beginDate = values.date && values.date.length > 0 ? values.date[0] : '';
        search.endDate = values.date && values.date.length > 0 ? values.date[1] : '';
        search.member = values.member ? values.member : '';

        reload();
      }

      function handleEnterPress(e: KeyboardEvent) {
        if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
          const target: HTMLElement = e.target as HTMLElement;
          if (target && target.tagName) {
            handleSubmit();
          }
        }
      }

      //BasicTable
      const getItemsApi = async (pageObjcet = { page: 0, pageSize: 10 }) => {
        search.currentPage = pageObjcet.page > 0 ? pageObjcet.page - 1 : pageObjcet.page;
        search.pageSize = pageObjcet.pageSize;
        const res = await getFeedbackList(search);

        return {
          items: res.result.rows,
          total: res.result.total,
        };
      };

      //Modal
      const handleOpen = (record: Recordable) => {
        detailRef.value.openModal(record);
      };

      /*=========data=========*/
      return {
        t,

        // TheFilter
        formSearchRef,
        schemas,
        handleReset,
        handleSubmit,
        handleEnterPress,

        // BasicTable
        registerTable,

        //modal(詳細資料)
        detailRef,
        handleOpen,
      };
    },
  });
</script>
<style lang="less" scoped></style>
