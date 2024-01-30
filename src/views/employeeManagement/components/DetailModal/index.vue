<template>
  <div>
    <a-modal :title="title" v-model:visible="visible" width="500px">
      <div class="p-6">
        <div class="text-center" v-if="employeeId == 0">
          {{ t('component.backend.defaultPassword') }}
        </div>
        <BasicForm
          ref="formRef"
          layout="vertical"
          :labelWidth="70"
          :schemas="schemas"
          :actionColOptions="{ span: 24 }"
          :showActionButtonGroup="false"
        />
      </div>
      <template #footer>
        <a-button class="mx-2" @click="visible = false">{{ t('common.cancel') }} </a-button>
        <a-button class="mx-2" type="primary" @click="handleSubmit">
          {{ t('common.saveText') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, nextTick, ref } from 'vue';
  import { Modal } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm } from '/@/components/Form/index';
  import { showMsg } from '/@/utils/globalTips';

  //data
  import { getSchemas } from './data';

  export default defineComponent({
    components: {
      BasicForm,
      AModal: Modal,
    },
    emits: ['reload'],
    setup(_, { emit }) {
      const { t } = useI18n();
      /*=========values=========*/
      const visible = ref(false);
      const employeeId = ref<Number>(0);
      const title = ref('');
      const schemas = ref<any>([]);
      const formRef = ref<any>(null);

      /*=========function=========*/
      //開啟Modal
      function openModal(record) {
        visible.value = true;
        employeeId.value = record.Id;
        schemas.value = getSchemas(employeeId.value);

        if (record.Id > 0) {
          //編輯
          title.value = t('common.edit') + t('component.backend.employee');
          nextTick(() => {
            formRef.value.setFieldsValue(record);
          });
        } else {
          //新增
          title.value = t('common.create') + t('component.backend.employee');
          nextTick(() => {
            formRef.value.resetFields();
          });
        }
      }
      async function handleSubmit() {
        await formRef.value.validateFields();

        let check = true;
        let values = formRef.value.getFieldsValue();
        let model: any = {
          jobId: values.JobId,
          name: values.Name,
          positionId: values.PositionId,
          statusId: 1,
          updateBy: '',
          createBy: '',
        };
        console.log(model);
        if (employeeId.value > 0) {
          //異動
        } else {
          //新增
          //todo:系統存在相同帳號，請重新輸入
          //showMsg('warning', t('component.backend.sameJob'));
        }

        if (check) {
          showMsg('success', t('common.success'));
          emit('reload');
          visible.value = false;
        }
      }

      onMounted(async () => {});

      /*=========data=========*/
      return {
        t,

        //modal
        formRef,
        visible,
        employeeId,
        title,
        schemas,
        openModal,
        handleSubmit,
      };
    },
  });
</script>
