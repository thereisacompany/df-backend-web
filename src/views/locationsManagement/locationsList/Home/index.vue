<template>
  <PageWrapper :fixSmallWidth="false" class="custom-pageTitle">
    <PageHeader>
      <template #title>
        <!-- myDiv轉換編輯器hmtl => 取得text使用 -->
        <div id="myDiv" style="display: none"></div>

        <!-- PageHeader -->
        <div class="flex justify-between">
          <div>{{ t('routes.menu.ArticleManagement.articleList') }}</div>
          <div>
            <a-button type="primary" class="w-36" @click="goDatail({ id: 0 })">
              <Icon class="mr-2" icon="ion:plus-circled" :size="14" />
              {{ t('common.create') }}
            </a-button>
          </div>
        </div>
      </template>
    </PageHeader>
    <div>
      <!-- 篩選器 -->
      <TheFilter :advanced="false" @click-submit="handleSubmit" @click-reset="handleReset">
        <template #BasicForm>
          <BasicForm
            class="keyword-filter-form col-span-7"
            @register="filterRegisterForm"
            @keyup.enter="handleEnter"
          />
        </template>
      </TheFilter>

      <BasicTable @register="registerTable" @selection-change="handleCheck">
        <template #toolbar>
          <div class="w-full flex justify-start py-3" v-if="checkeds.length > 0">
            <a-button class="w-30 ml-3" type="dashed" @click="handleCancelPublish">
              {{ t('component.articleManagement.cancelPublish') }}
            </a-button>
            <!-- <a-button class="w-30 ml-3" @click="handleDeleteRows">
              {{ t('component.articleManagement.deleteArticle') }}
            </a-button> -->
          </div>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <TableAction
              class="custom-acton-buttons"
              :actions="[
                {
                  icon: 'clarity:note-edit-line',
                  tooltip: t('common.edit'),
                  onClick: goDatail.bind(null, record),
                },
                {
                  icon: 'eva:copy-outline',
                  tooltip: t('common.copy'),
                  onClick: handleCopy.bind(null, record),
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
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onBeforeMount, nextTick, reactive, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { showMsg, commonConfirm } from '/@/utils/globalTips';
  import { PageWrapper } from '/@/components/Page';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useGo } from '/@/hooks/web/usePage';
  import { PageHeader } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import dayjs from 'dayjs';

  //components
  import { TheFilter } from '/@/components/TheFilter';

  //api
  import {
    getArticleList,
    deleteArticle,
    getArticleItem,
    updateArticle,
    addArticle,
  } from '/@/api/page/locations/locationsList';

  import { getAllCategoryList } from '/@/api/page/locations/locationBusiness';

  import { getAllCategoryRegionsList } from '/@/api/page/locations/locationRegions';
  //data
  import { filterOptions } from '/@/utils/options';
  import { getColumns, filterSchemas } from './data';

  export default defineComponent({
    name: 'AccountManagement',
    components: {
      Icon,
      BasicTable,
      TableAction,
      PageWrapper,
      PageHeader,
      TheFilter,
      BasicForm,
    },
    setup() {
      const { t } = useI18n();
      const go = useGo();

      /*=========values=========*/
      //Filter
      const search = reactive({
        filter: [], //latest,featured,publish 可填入此三組篩選 array[string]
        beginDate: '', //開始日期
        endDate: '', //結束日期
        category: [], //array[integer]
        regions: [], //array[integer]
        keyword: '', //關鍵字
        currentPage: 0,
        pageSize: 10,
      });
      const [filterRegisterForm, { getFieldsValue, resetFields, updateSchema }] = useForm({
        layout: 'vertical',
        labelWidth: 186,
        schemas: filterSchemas,
        showActionButtonGroup: false,
        baseColProps: { span: 24 },
        baseRowStyle: { alignItems: 'end' },
        wrapperCol: { span: 23 },
      });

      //Table
      const checkeds = ref([]);
      const [
        registerTable,
        { reload, setPagination, getSelectRows, clearSelectedRowKeys, setColumns, setLoading },
      ] = useTable({
        rowKey: 'id',
        columns: [],
        clickToRowSelect: false,
        loading: true,
        striped: false,
        canResize: false,
        showIndexColumn: false,
        rowSelection: { type: 'checkbox' },
        api: async (pageObjcet = { page: 0, pageSize: 10 }) => {
          return getItemsApi(pageObjcet);
        },
      });

      /*=========function=========*/
      //TheFilter
      const handleSubmit = async () => {
        //初始化
        search.currentPage = 0;
        setPagination({ current: 1 });

        //取得查詢項目
        const values = getFieldsValue();
        search.filter = values.filter ? values.filter : [];
        search.category = values.category ? values.category : [];
        search.regions = values.categoryregions ? values.categoryregions : [];
        search.keyword = values.keyword ? values.keyword : '';
        // search.beginDate = values.date && values.date.length > 0 ? values.date[0] : '';
        // search.endDate = values.date && values.date.length > 0 ? values.date[1] : '';

        //全部
        if (search.filter.length == filterOptions.length) {
          search.filter = [];
        }

        reload();
      };
      const handleReset = async () => {
        await resetFields();

        nextTick(() => {
          handleSubmit();
        });
      };
      const handleEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
          const target: HTMLElement = e.target as HTMLElement;
          if (target && target.tagName) {
            handleSubmit();
          }
        }
      };

      //Table
      //處理: 撈取文章列表
      const getItemsApi = async (pageObjcet = { page: 0, pageSize: 10 }) => {
        search.currentPage = pageObjcet.page > 0 ? pageObjcet.page - 1 : pageObjcet.page;
        search.pageSize = pageObjcet.pageSize;
        const res = await getArticleList(search);

        return {
          items: res.result.rows,
          total: res.result.total,
        };
      };
      //處理: 複製單一項目
      const handleCopy = async (record: Recordable) => {
        try {
          const res = await getArticleItem(record.id);
          if (res.code === 200) {
            let model = res.result.article;
            model.id = 0;
            model.publishDate = '';
            model.createdAt = '';
            model.createdBy = '';
            model.updatedAt = '';
            model.updatedBy = '';
            model.title = model.title + ` copy-${dayjs().format('YYYYMMDDHHmmss')}`;

            let data = {};
            Object.keys(model).forEach((key) => {
              //清除空值
              if (model[key] !== '' && model[key] !== null) data[key] = model[key];
            });

            await addArticle(data);
            showMsg('success', t('component.liveChat.copySuccess'));
            handleSubmit();

            console.log({ record, model });
          }
        } catch (e) {}
      };
      //處理: 刪除單一項目
      const handleDelete = (record: Recordable) => {
        const iconType = 'warning';
        commonConfirm(
          { iconType: iconType, title: iconType, content: t('common.confirmDelete') },
          async (closeDialog) => {
            try {
              await deleteArticle(record.id);
              showMsg('success', t('common.success'));
              reload();
              closeDialog();
            } catch (e) {}
          },
        );
      };
      //處理: 取消刊登(多選)
      const handleCancelPublish = async () => {
        setLoading(true);
        const selected = getSelectRows();

        await selected.forEach(async (item) => {
          await updateArticle({ id: item.id, isPublish: 0 });
        });
        showMsg('success', t('component.articleManagement.cancelPublish') + t('common.success'));

        setTimeout(() => {
          setLoading(false);
          clearSelectedRowKeys();
          reload();
        }, 500);
      };
      //處理: 刪除文章(多選)
      const handleDeleteRows = () => {
        const selected = getSelectRows();
        console.log(selected);
        showMsg('warning', '功能尚未開放');
      };
      //處理: 監聽勾選
      function handleCheck({ rows }) {
        checkeds.value = rows;
      }
      //跳頁至明細
      const goDatail = (record) => {
        go(`/backend/locationsDetail/${record.id}`);
      };
      const handleLoading = (status) => {
        setLoading(status);
      };

      onBeforeMount(async () => {
        const categorys = await getAllCategoryList();
        let array = [];
        if (categorys.code === 200) {
          array = categorys.result.rows.map((item) => {
            return { value: item.id, label: item.name };
          });
        }

        const categorysregions = await getAllCategoryRegionsList();
        let arrayr = [];
        if (categorysregions.code === 200) {
          arrayr = categorysregions.result.rows.map((item) => {
            return { value: item.id, label: item.name };
          });
        }

        //form
        updateSchema([
          {
            field: 'category',
            componentProps: { options: array },
          },
          {
            field: 'categoryregions',
            componentProps: { options: arrayr },
          },
        ]);

        //table
        const columns = getColumns(array, handleLoading, arrayr);
        setColumns(columns);

        // const columnsx = getColumns(arrayr, handleLoading);
        // setColumns(columnsx);
      });
      return {
        t,

        //Filter
        filterRegisterForm,
        handleSubmit,
        handleReset,
        handleEnter,

        //Table
        registerTable,
        checkeds,
        handleCopy,
        handleDelete,
        handleCancelPublish,
        handleDeleteRows,
        handleCheck,
        goDatail,
      };
    },
  });
</script>
<style lang="less" scoped></style>
