<template>
  <div>
    <PageWrapper :fixSmallWidth="false" class="custom-pageTitle">
      <PageHeader>
        <template #title>
          <div class="flex justify-between">
            <div>{{ t('routes.menu.WhiteList') }}</div>
            <div>
              <a-button type="primary" class="w-36" @click="onShowModal('add')">
                <Icon class="mr-2" icon="ion:plus-circled" :size="14" />
                {{ t('common.create') }}
              </a-button>
            </div>
          </div>
        </template>
      </PageHeader>

      <!-- TheFilter -->
      <TheFilter
        :advanced="false"
        @click-submit="handleFilterSubmit"
        @click-reset="handleFilterReset"
      >
        <template #BasicForm>
          <BasicForm
            @register="filterRegisterForm"
            class="keyword-filter-form col-span-7"
            @keyup.enter="handleEnterPress"
          />
        </template>
      </TheFilter>

      <!-- BasicTable -->
      <BasicTable @register="registerTable" :dataSource="dataSource">
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
                  icon: 'material-symbols:delete-outline-rounded',
                  tooltip: t('common.delete'),
                  onClick: handleDelete.bind(null, record),
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>

      <!-- Modal -->
      <a-modal v-model:visible="visible" :title="t('common.edit')">
        <div class="p-6">
          <BasicForm @register="registerModalForm" />
        </div>
        <template #footer>
          <a-button @click="visible = false">{{ t('common.cancel') }}</a-button>
          <a-button type="primary" @click="handleSave">{{ t('common.saveText') }}</a-button>
        </template>
      </a-modal>
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { PageHeader, Modal } from 'ant-design-vue';
  import { TheFilter } from '/@/components/TheFilter';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { showConfirm } from '/@/utils/globalTips';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Icon } from '/@/components/Icon';

  import { formOption, tableOption, modalFormOption } from './data';
  export default defineComponent({
    components: {
      PageWrapper,
      PageHeader,
      BasicTable,
      TableAction,
      TheFilter,
      BasicForm,
      Icon,
      AModal: Modal,
    },
    setup() {
      const { t } = useI18n();
      /*=========values=========*/
      //TheFilter
      const [filterRegisterForm, { resetFields }] = useForm(formOption);

      //BasicTable
      const dataSource: any = ref([]);
      const [registerTable, { setLoading }] = useTable(tableOption);

      //Modal
      const visible = ref(false);
      const title = ref('');
      const [registerModalForm, { getFieldsValue, setFieldsValue }] = useForm(modalFormOption);

      /*=========function=========*/
      //TheFilter
      function handleFilterSubmit() {}
      function handleFilterReset() {
        resetFields();
      }
      function handleEnterPress(e: KeyboardEvent) {
        if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
          const target: HTMLElement = e.target as HTMLElement;
          if (target && target.tagName) {
            handleFilterSubmit();
          }
        }
      }

      //BasicTable
      function loadData() {
        setLoading(true);
        dataSource.value = [];
        for (let i = 0; i < 15; i++) {
          const model = {
            Name: `${t('component.whitelist.officeName')}${i}`,
            IP: `192.168.1.${i}`,
          };
          dataSource.value.push(model);
        }
        setLoading(false);
      }
      async function handleEdit(record: Recordable) {
        onShowModal('edit');
        setFieldsValue(await record);
      }
      function handleDelete(record: Recordable) {
        showConfirm({
          iconType: 'warning',
          title: 'Tip',
          content: t('common.confirmDelete'),
          onOk() {
            console.log(record);
          },
          onCancel() {},
        });
      }

      //Modal
      function onShowModal(type) {
        visible.value = true;
        title.value = type === 'add' ? t('common.add') : t('common.edit');
      }
      function handleSave() {
        const values = getFieldsValue();
        console.log(values);
      }

      onMounted(() => {
        loadData();
      });
      /*=========data=========*/
      return {
        t,

        //TheFilter
        filterRegisterForm,
        handleEnterPress,
        handleFilterSubmit,
        handleFilterReset,

        //BasicTable
        dataSource,
        registerTable,
        handleEdit,
        handleDelete,

        //Modal
        visible,
        title,
        onShowModal,
        registerModalForm,
        handleSave,
      };
    },
  });
</script>
<style lang="less" scoped></style>
