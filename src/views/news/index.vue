<template>
  <PageWrapper :fixSmallWidth="false" class="custom-pageTitle">
    <PageHeader>
      <template #title>
        <div class="flex justify-between">
          <div>{{ t('routes.menu.News') }}</div>
          <div>
            <a-button type="primary" class="w-36" @click="handleOpenModal(1, null)">
              <Icon class="mr-2" icon="ion:plus-circled" :size="14" />
              {{ t('common.create') }}
            </a-button>
          </div>
        </div>
      </template>
    </PageHeader>

    <!-- TheFilter -->
    <TheFilter :advanced="false" @click-reset="handleReset" @click-submit="handleSubmit">
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

    <!-- table -->
    <BasicTable @register="registerTable" :dataSource="tableData.dataSources">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <Tooltip :title="t('common.edit')" placement="bottom" class="mr-2">
            <a-button
              type="primary"
              preIcon="clarity:note-edit-line"
              size="small"
              @click="handleOpenModal(2, record)"
            />
          </Tooltip>

          <Tooltip :title="t('common.delete')" placement="bottom">
            <a-button
              type="primary"
              preIcon="material-symbols:delete-outline-rounded"
              size="small"
              @click="handleDelete(record)"
            />
          </Tooltip>
        </template>
      </template>
    </BasicTable>

    <!-- 分頁 -->
    <div class="flex py-5 items-center justify-center" style="background: #e4e4e4">
      <a-pagination
        v-model:current="currentPage"
        :pageSize="pageSize"
        :page-size-options="pageSizeOptions"
        :total="total"
        :show-total="(total) => `${t('common.pageTotal')} ${total} ${t('common.pageItems')}`"
        show-size-changer
      />
    </div>
    <!-- 詳細資料 -->
    <NewsDetail ref="newsDetailRef" @register="registerModal" @reload="handleSubmit" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, onMounted } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { PageWrapper } from '/@/components/Page';
  import { PageHeader, Pagination, Tooltip } from 'ant-design-vue';
  import { BasicForm } from '/@/components/Form/index';
  import { BasicTable, useTable } from '/@/components/Table';
  import { TheFilter } from '/@/components/TheFilter';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { showConfirm } from '/@/utils/globalTips';
  import NewsDetail from './components/Detail/index.vue';
  import { deleteNullInParams } from '/@/utils/parameters';
  import { useModal } from '/@/components/Modal';
  import { showMsg } from '/@/utils/globalTips';

  // store & api
  import { getNewsList, deleteNews } from '/@/api/page/news';
  //data
  import { tableColumns, schemas } from './data';

  export default defineComponent({
    components: {
      Icon,
      PageWrapper,
      PageHeader,
      BasicForm,
      BasicTable,
      TheFilter,
      NewsDetail,
      APagination: Pagination,
      Tooltip,
    },
    setup() {
      const { t } = useI18n();
      /*=========values=========*/
      // modal
      const [registerModal, { openModal }] = useModal();
      //TheFilter
      const formSearchRef = ref<any>(null);

      //table
      const dataSources: any = ref([]);
      const tableData = reactive({ columns: tableColumns, dataSources: dataSources });
      const [registerTable] = useTable({
        columns: tableData.columns,
        showIndexColumn: false,
        pagination: true,
        canResize: false,
        bordered: false,
      });

      //---* pagination
      const currentPage = ref(1);
      const pageSize = ref(10);
      const total = ref(10);
      const pageSizeOptions = ref<string[]>(['10', '25', '50', '100']);

      //詳細資料
      const newsDetailRef = ref<any>(null);
      /*=========function=========*/
      //TheFilter
      // 取消篩選
      function handleReset() {
        formSearchRef.value.resetFields();
        setTimeout(() => {
          handleSubmit();
        }, 300);
      }

      // 確認篩選
      function handleSubmit() {
        const values = formSearchRef.value.getFieldsValue();
        const data = {
          title: values.title !== undefined ? values.title : null,
          type: values.type !== undefined && values.type !== 0 ? values.type : null,
          visible: values.visible !== undefined ? values.visible : null,
          currentPage: currentPage.value - 1,
          pageSize: pageSize.value,
        };

        deleteNullInParams(data);
        loadData(data);
      }

      //table
      async function loadData(parameters) {
        const list = await getNewsList(parameters);
        const data = list.result.rows;
        if (data.length > 0) dataSources.value = data;
        else tableData.dataSources = [];
      }

      // 開啟編輯
      function handleOpenModal(type, record) {
        openModal(true, { type, record });
      }

      // 刪除
      function handleDelete(record) {
        showConfirm({
          iconType: 'warning',
          title: 'Tip',
          content: t('common.confirmDelete'),
          onOk() {
            deleteNews(record.id)
              .then(() => {
                showMsg('success', t('common.delete') + t('common.success'));
                handleSubmit();
              })
              .catch((error) => {
                console.log('ERROR from 刪除最新消息', error);
              });
          },
          onCancel() {},
        });
      }

      onMounted(() => {
        handleSubmit();
      });
      /*=========data=========*/
      return {
        t,

        //TheFilter
        formSearchRef,
        schemas,
        handleReset,
        handleSubmit,

        //table
        registerTable,
        dataSources,
        tableData,
        loadData,
        handleOpenModal,
        handleDelete,

        //詳細資料
        newsDetailRef,
        openModal,

        //paganation
        currentPage,
        pageSize,
        total,
        pageSizeOptions,
        //pageChange,

        //modal
        registerModal,
      };
    },
  });
</script>
<style lang="less" scoped></style>
