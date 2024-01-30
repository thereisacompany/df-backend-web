<template>
  <PageWrapper :fixSmallWidth="false" class="custom-pageTitle">
    <PageHeader>
      <template #title>
        <div class="flex justify-between">
          <div>{{ t('routes.menu.EmployeeManagement') }}</div>
          <div>
            <a-button type="primary" class="w-36" @click="openModal({ Id: 0 })">
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
            @register="filterRegisterForm"
            class="keyword-filter-form col-span-7"
            @keyup.enter="handleEnter"
          />
        </template>
      </TheFilter>
      <BasicTable @register="registerTable" :dataSource="tableData">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <TableAction
              class="custom-acton-buttons"
              :actions="[
                {
                  icon: 'clarity:note-edit-line',
                  tooltip: t('common.edit'),
                  onClick: handleEdit.bind(null, record),
                },
                {
                  icon: 'ic:sharp-lock-reset',
                  tooltip: t('component.personal.resetPwd'),
                  onClick: resetPwd.bind(null, record),
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </div>
    <!-- modal -->
    <DetailModal ref="detailRef" @reload="handleSubmit" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { PageWrapper } from '/@/components/Page';
  import { PageHeader } from 'ant-design-vue';
  import { showMsg, showConfirm } from '/@/utils/globalTips';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Icon } from '/@/components/Icon';
  import XEUtils from 'xe-utils';

  import { TheFilter } from '/@/components/TheFilter';
  import DetailModal from './components/DetailModal/index.vue';

  import { userNameJobId } from '/@/utils/commonly';
  import { columns, filterSchemas } from './data';

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

      DetailModal,
    },
    setup() {
      const { t } = useI18n();
      /*=========values=========*/

      //Filter
      const [filterRegisterForm, { resetFields }] = useForm({
        layout: 'vertical',
        labelWidth: 186,
        schemas: filterSchemas,
        showActionButtonGroup: false,
        baseColProps: { span: 24 },
        baseRowStyle: { alignItems: 'end' },
        wrapperCol: { span: 23 },
      });

      //Table
      const tableData: any = ref([]);
      const [registerTable, { setLoading }] = useTable({
        rowKey: 'id',
        columns,
        canResize: false,
        loading: true,
        showIndexColumn: false,
        striped: false,
      });

      //Modal
      const detailRef = ref<any>(null);

      /*=========function=========*/
      //TheFilter
      const handleSubmit = async () => {
        await loadData();
      };
      const handleReset = async () => {
        resetFields();
        loadData();
      };
      function handleEnter(e: KeyboardEvent) {
        if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
          const target: HTMLElement = e.target as HTMLElement;
          if (target && target.tagName) {
            handleSubmit();
          }
        }
      }

      //Table
      async function loadData() {
        tableData.value = [];
        for (let i = 0; i < 18; i++) {
          const model = {
            Id: i + 1,
            JobId: 'CEOS205' + i,
            Name: 'Test' + i,
            PositionId: random('PositionId'),
            status: random('status'),
          };
          tableData.value.push(model);
        }
        setLoading(false);
      }
      function handleEdit(record: Recordable) {
        detailRef.value.openModal(record);
      }
      function resetPwd(record: Recordable) {
        showConfirm({
          iconType: 'warning',
          title: 'Tip',
          class: 'custom-confirm',
          content: `${record.JobId} ${record.Name} ${t('component.personal.resetPwd')}，${t(
            'component.backend.defaultPassword',
          )}`,
          async onOk() {
            const params = {
              targetUserId: record.Id,
              editor: userNameJobId,
            };
            console.log(params);
            showMsg('success', t('component.personal.resetPwd') + t('common.success'));
          },
          onCancel() {},
        });
      }

      //Modal
      function openModal(record) {
        detailRef.value.openModal(record);
      }

      //common
      function random(type) {
        if (type === 'PositionId') {
          return XEUtils.random(1, 2);
        } else if (type === 'status') {
          return XEUtils.random(0, 1);
        }
      }

      onMounted(async () => {
        await loadData();
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
        tableData,
        handleEdit,
        resetPwd,

        //Modal
        detailRef,
        openModal,
      };
    },
  });
</script>
<style lang="less" scoped></style>
