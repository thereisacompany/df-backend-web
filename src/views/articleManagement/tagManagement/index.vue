<template>
  <PageWrapper :fixSmallWidth="false" class="custom-pageTitle">
    <PageHeader>
      <template #title>
        <div class="flex justify-between">
          <div>{{ t('routes.menu.ArticleManagement.tagManagement') }}</div>
          <div>
            <a-button type="primary" class="w-36" @click="handleAdd(0)">
              <Icon class="mr-2" icon="ion:plus-circled" :size="14" />
              {{ t('common.create') }}
            </a-button>
          </div>
        </div>
      </template>
    </PageHeader>
    <div class="sm:block hidden">
      <!-- 篩選器 -->
      <div class="filter">
        <TheFilter
          @click-submit="handleClickSubmit"
          @click-reset="handleFilterReset"
          :advanced="false"
        >
          <!-- 關鍵字篩選-->
          <template #BasicForm>
            <BasicForm
              @register="registerForm"
              :showActionButtonGroup="false"
              class="keyword-filter-form col-span-7"
            />
          </template>
        </TheFilter>
      </div>

      <!-- 清單 -->
      <BasicTable
        @register="registerTable"
        @change="handleTableChange"
        :columns="tableData.columns"
        :dataSource="tableData.dataSources"
        :pagination="{ total: tableData.total }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <div class="action flex justify-center">
              <div>
                <TableAction
                  class="custom-acton-buttons"
                  :actions="[
                    {
                      icon: 'clarity:note-edit-line',
                      tooltip: t('common.edit'),
                      onClick: handleEdit.bind(null, record),
                    },
                    {
                      icon: 'material-symbols:delete-outline-rounded',
                      tooltip: t('common.delete'),
                      onClick: handleDelete.bind(null, record),
                    },
                  ]"
                />
              </div>
            </div>
          </template>
        </template>
      </BasicTable>
    </div>
    <!-- 新增、編輯 -->
    <ActionModal @register="registerModal" @reload="handleClickSubmit" />
  </PageWrapper>
</template>
<script lang="ts">
  //---* common
  import { defineComponent, ref, onMounted, reactive, h } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageHeader, Select } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { showMsg } from '/@/utils/globalTips';
  import { DeleteTwoTone } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  //---* components
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { TheFilter } from '/@/components/TheFilter';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import ActionModal from './components/Modal/index.vue';
  import { useModal } from '/@/components/Modal';
  //---* data
  import { tableColumns } from './data';
  import { filterSchema, integrateParams } from '../common';
  // api
  import { getTagList, deleteTag } from '/@/api/page/article/tag';

  export default defineComponent({
    components: {
      PageHeader,
      PageWrapper,
      BasicTable,
      TableAction,
      Icon,
      TheFilter,
      BasicForm,
      [Select.name]: Select,
      ActionModal,
    },

    setup() {
      // common
      // const go = useGo();
      const loading: any = ref(false);
      const { t } = useI18n();
      const { createConfirm } = useMessage();

      // modal
      const [registerModal, { openModal }] = useModal();

      // 關鍵字篩選from
      const [registerForm, { resetFields, getFieldsValue }] = useForm({
        layout: 'vertical',
        labelWidth: 186,
        schemas: filterSchema,
        baseColProps: { span: 24 },
        baseRowStyle: {
          alignItems: 'end',
        },
        wrapperCol: { span: 21 },
      });

      // pagination
      const currentPage = ref(1);
      const pageSize = ref(10);
      const total = ref(10);

      // table
      const allowEdit = ref(true);
      const dataList: any = ref();
      const tableData = reactive({
        columns: tableColumns(),
        dataSources: [],
        total: total.value,
      });
      const [registerTable, { getPaginationRef }] = useTable({
        showIndexColumn: false,
        pagination: true,
        canResize: false,
        bordered: false,
        clickToRowSelect: false,
      });

      // 載入資料
      async function fetchData(params) {
        try {
          const response = await getTagList(params);
          console.log('response', response);
          total.value = response.result.total;
          tableData.dataSources = response.result.rows;
          // tableData.dataSources = fakeList();
        } catch (error) {
          console.log('error form fetchData', error);
          showMsg('error', t('common.fetch') + t('common.fail') + t('common.errMsg'));
        }

        loading.value = false;
      }

      // 篩選器-清除條件
      async function handleFilterReset() {
        loading.value = true;
        resetFields();
        setTimeout(() => {
          handleClickSubmit();
        }, 500);
      }

      // 篩選器-確認送出
      async function handleClickSubmit() {
        loading.value = true;
        const value = getFieldsValue();
        const params = await integrateParams(value, currentPage.value, pageSize.value);
        await fetchData(params);
      }

      // 新增
      function handleAdd(type) {
        openModal(true, { type, record: null });
      }

      // 編輯
      function handleEdit(record) {
        openModal(true, { type: 1, record });
      }

      // 刪除
      function handleDelete(record) {
        createConfirm({
          iconType: 'error',
          icon: h(DeleteTwoTone, { twoToneColor: '#e74242' }),
          title: t('common.confirmDelete'),
          autoFocusButton: null,
          okType: 'danger',
          okText: t('common.okText'),
          cancelText: t('common.cancelText'),
          async onOk() {
            deleteTag(record.id)
              .then(() => {
                showMsg('success', t('common.delete') + t('common.success'));
                handleClickSubmit();
              })
              .catch((error) => {
                console.log('error from deleteCategory', error);
                showMsg('error', t('common.delete') + t('common.fail') + t('common.errMsg'));
              });
          },
        });
      }

      // 分頁切換
      function handleTableChange() {
        loading.value = true;
        currentPage.value = getPaginationRef()['current'];
        pageSize.value = getPaginationRef()['pageSize'];
        handleClickSubmit();
      }

      onMounted(async () => {
        handleClickSubmit();
      });

      return {
        t,
        loading,
        registerTable,
        tableColumns,
        tableData,
        dataList,
        allowEdit,

        registerForm,

        handleAdd,
        handleEdit,
        handleDelete,
        handleFilterReset,
        handleClickSubmit,
        fetchData,

        total,
        currentPage,
        pageSize,
        registerModal,
        handleTableChange,
      };
    },
  });
</script>
<style lang="less" scoped>
  .keyword-filter-form:deep(.ant-picker) {
    width: 100% !important;
  }
</style>
