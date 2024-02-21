<template>
  <PageWrapper :fixSmallWidth="false" class="custom-pageTitle" :loading="loading">
    <PageHeader>
      <template #title>
        <div class="flex justify-between">
          <div>{{ t('routes.menu.ArticleManagement.articleCategory') }}</div>
          <div>
            <a-button type="primary" @click="handleOpenModal({ id: 0 })">
              <Icon icon="ion:plus-circled" :size="14" />
              {{ t('common.create') + t('component.articleManagement.category') }}
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
              @keyup.enter="handleEnter"
              :showActionButtonGroup="false"
              class="keyword-filter-form col-span-7"
            />
          </template>
        </TheFilter>
      </div>

      <!-- 清單 -->
      <BasicTable
        @register="registerTable"
        @selection-change="selectionChange"
        @change="handleTableChange"
        :columns="tableData.columns"
        :dataSource="tableData.dataSources"
        :pagination="{ total: tableData.total }"
      >
        <!-- toolbar 上方按鈕 -->
        <template #toolbar>
          <div class="w-full flex justify-start py-3" v-if="tableData.checkList.length > 0">
            <a-button class="custom-size-default ml-3" type="dashed" @click="handleDisabled">
              {{ t('common.disable') + t('component.articleManagement.category') }}
            </a-button>
            <!-- <a-button
              class="custom-btn-second custom-size-default ml-3"
              @click="handleDelete(tableData.checkList)"
            >
              {{ t('common.delete') + t('component.articleManagement.category') }}
            </a-button> -->
          </div>
        </template>

        <!-- bodyCell -->
        <template #bodyCell="{ column, record }">
          <!-- 圖片 -->
          <template v-if="column.dataIndex === 'img'">
            <div v-for="item in getImages(record)" :key="item.thumbUrl">
              <img :src="item.thumbUrl" alt="table-img" />
            </div>
          </template>

          <!-- 動作列 -->
          <template v-if="column.dataIndex === 'action'">
            <TableAction
              class="custom-acton-buttons"
              :actions="[
                {
                  icon: 'clarity:note-edit-line',
                  tooltip: t('common.edit'),
                  onClick: handleOpenModal.bind(null, record),
                },
                {
                  icon: 'material-symbols:delete-outline-rounded',
                  tooltip: t('common.delete'),
                  onClick: handleDelete.bind(null, record),
                },
              ]"
            />
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
  import { useModal } from '/@/components/Modal';
  import { DeleteTwoTone } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { showMsg } from '/@/utils/globalTips';
  import { Icon } from '/@/components/Icon';
  //---* components
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { TheFilter } from '/@/components/TheFilter';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import ActionModal from './components/ActionModal/index.vue';
  //---* data
  import { tableColumns, getImages } from './data';
  import { filterSchema, integrateParams } from '../common';
  // api
  import {
    getCategoryList,
    deleteCategory,
    updateCategory,
  } from '/@/api/page/article/articleCategory';

  export default defineComponent({
    components: {
      PageHeader,
      PageWrapper,
      BasicTable,
      Icon,
      TableAction,

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

      // filter
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
      const dataList: any = ref();
      const tableData = reactive({
        columns: tableColumns(handleClickSubmit),
        dataSources: [],
        total: total.value,
        checkList: [],
      });
      const [registerTable, { getPaginationRef, clearSelectedRowKeys }] = useTable({
        showIndexColumn: false,
        pagination: true,
        canResize: false,
        bordered: false,
        clickToRowSelect: false,
        rowSelection: {
          type: 'checkbox',
        },
      });

      // 載入資料
      async function fetchData(params) {
        try {
          const response = await getCategoryList(params);
          total.value = response.result.total;
          tableData.dataSources = response.result.rows;
          // tableData.dataSources = fakeList();
        } catch (error) {
          console.log('error form fetchData', error);
          showMsg('error', t('common.fetch') + t('common.fail') + t('common.errMsg'));
        }

        loading.value = false;
      }

      // 分頁切換
      function handleTableChange() {
        currentPage.value = getPaginationRef()['current'];
        pageSize.value = getPaginationRef()['pageSize'];
        handleClickSubmit();
      }

      // 篩選器-清除條件
      async function handleFilterReset() {
        await resetFields();
        setTimeout(() => {
          handleClickSubmit();
        }, 500);
      }

      // 篩選器-確認送出
      function handleClickSubmit() {
        loading.value = true;

        setTimeout(async () => {
          console.log('* 確認送出');
          const value = getFieldsValue();
          //pageSize.value
          const params = await integrateParams(value, currentPage.value, 100);
          await fetchData(params);
        }, 500);
      }

      // enter sumbit filter
      function handleEnter(e: KeyboardEvent) {
        if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
          const target: HTMLElement = e.target as HTMLElement;
          if (target && target.tagName) {
            handleClickSubmit();
          }
        }
      }

      // 新增、編輯
      function handleOpenModal(record) {
        const type = record.id == 0 ? 0 : 1;
        openModal(true, { type, record });
      }

      // 刪除
      function handleDelete(record) {
        loading.value = true;
        createConfirm({
          iconType: 'error',
          icon: h(DeleteTwoTone, { twoToneColor: '#e74242' }),
          title: t('common.confirmDelete'),
          autoFocusButton: null,
          okType: 'danger',
          okText: t('common.okText'),
          cancelText: t('common.cancelText'),
          async onOk() {
            deleteCategory(record.id)
              .then(() => {
                showMsg('success', t('common.delete') + t('common.success'));
                handleClickSubmit();
              })
              .catch((error) => {
                console.log('error from deleteCategory', error);
                showMsg('error', t('common.delete') + t('common.fail') + t('common.errMsg'));
              });
          },
          onCancel() {
            clearSelectedRowKeys(); // 清空勾選的
          },
        });
        loading.value = false;
      }

      // 監聽勾選
      function selectionChange({ rows }) {
        tableData.checkList = rows;
      }

      // 停用
      function handleDisabled() {
        loading.value = true;
        let count = 0; // 修改成功的長度
        let isPublishLength = 0; // 待修改的長度
        tableData.checkList.forEach((row) => {
          console.log('* row', row);
          if (row['isPublish'] === 1) {
            isPublishLength++;
            const params = {
              id: row['id'],
              isPublish: 0,
            };
            updateCategory(params)
              .then(async () => {
                count++;
                console.log('* then', count);
                if (isPublishLength == count) {
                  showMsg('success', t('common.disable') + t('common.success'));
                  clearSelectedRowKeys();
                  await handleClickSubmit();
                }
              })
              .catch((error) => {
                console.log('error from handleSwitch', error);
                showMsg(
                  'error',
                  t('component.app.toNavigate') + t('common.fail') + t('common.errMsg'),
                );
              });
          }
        });

        loading.value = false;
      }

      onMounted(async () => {
        currentPage.value = getPaginationRef()['current'];
        pageSize.value = getPaginationRef()['pageSize'];
        handleClickSubmit();
      });

      return {
        t,
        getImages,

        loading,
        registerTable,
        tableColumns,
        tableData,
        dataList,

        total,
        currentPage,
        pageSize,

        registerForm,
        registerModal,

        handleOpenModal,
        handleDelete,
        handleFilterReset,
        handleClickSubmit,
        fetchData,
        selectionChange,
        handleDisabled,
        handleTableChange,
        handleEnter,
      };
    },
  });
</script>
<style lang="less" scoped>
  .keyword-filter-form:deep(.ant-picker) {
    width: 100% !important;
  }
</style>
