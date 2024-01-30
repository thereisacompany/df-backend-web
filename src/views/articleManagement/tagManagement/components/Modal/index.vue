<template>
  <div>
    <BasicModal @register="registerModal" :title="title" centered width="500px">
      <Spin :spinning="spinning">
        <div class="flex flex-col">
          <div class="w-full">
            <BasicForm
              @register="registerForm"
              layout="vertical"
              class="custom-form custom-form-gap-2"
              :class="disable ? 'edit-form' : ''"
            />
          </div>
        </div>
      </Spin>
      <template #footer>
        <div class="flex justify-end">
          <a-button class="mx-2" @click="closeModal()">{{ t('common.cancel') }} </a-button>

          <div>
            <a-button class="mx-2" type="primary" @click="openEdit" v-if="!isEdit">
              {{ t('common.edit') }}
            </a-button>
            <a-button class="mx-2" type="primary" @click="handleSubmit" v-else>
              {{ t('common.saveText') }}
            </a-button>
          </div></div
        >
      </template>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Spin } from 'ant-design-vue';
  import { deleteNullInParams } from '/@/utils/parameters';
  import { showMsg } from '/@/utils/globalTips';
  import dayjs from 'dayjs';
  import { formatToDateTime } from '/@/utils/dateUtil';
  // api
  import { addTag, updateTag } from '/@/api/page/article/tag';
  import { useUserStore } from '/@/store/modules/user';
  //data
  import { schemas } from '/@/views/articleManagement/tagManagement/data';
  import { checkEditFields } from '/@/views/articleManagement/common';
  export default defineComponent({
    components: {
      BasicModal,
      BasicForm,
      Spin,
    },
    emits: ['register', 'reload'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const visible = ref(false); // 關閉modal
      const title = ref<string>(''); // modal title
      const isEdit = ref(false); // 是否為編輯中
      const disable = ref(false); // 欄位是否disabled
      const spinning = ref(false);
      const type = ref(); // 類別 0新增 1編輯
      const currentInfo = ref(); // 當前資料
      const userStore = useUserStore();
      const userInfo = userStore.getUserInfo;
      // modal
      const [registerModal, { closeModal }] = useModalInner((data) => {
        resetFields();
        spinning.value = true;
        type.value = data.type; // 0新增 1編輯
        currentInfo.value = data.record;
        title.value = data.type === 0 ? t('common.create') : t('common.edit');
        isEdit.value = data.type === 0;
        disable.value = data.type === 1;
        if (data.type === 1) {
          setFieldsValue(data.record);
        }
        spinning.value = false;
      });

      // 左側 form
      const [registerForm, { getFieldsValue, setFieldsValue, resetFields }] = useForm({
        layout: 'vertical',
        labelWidth: 300,
        schemas: schemas(disable),
        showActionButtonGroup: false,
        baseColProps: { span: 24 },
        baseRowStyle: { alignItems: 'end' },
        wrapperCol: { span: 23 },
      });

      /*=========function=========*/

      // 儲存
      async function handleSubmit() {
        spinning.value = true;
        const value = await getFieldsValue();
        console.log('value', value);
        const params = {
          id: type.value === 0 ? null : currentInfo.value.id,
          name: checkEditFields('name', value.name, type.value, currentInfo.value),
          sort: checkEditFields('sort', value.sort, type.value, currentInfo.value),
        };
        deleteNullInParams(params);

        if (type.value === 0) {
          // 新增
          try {
            await addTag(params);
            showMsg('success', t('common.create') + t('common.success'));
            emit('reload');
          } catch (error) {
            console.log('error from handleSubmit add', error);
            showMsg('error', t('common.create') + t('common.fail') + t('common.errMsg'));
          }
        } else {
          // 編輯
          try {
            await updateTag(params);
            showMsg('success', t('common.edit') + t('common.success'));
            emit('reload');
          } catch (error) {
            console.log('error from handleSubmit edit', error);
            showMsg('error', t('common.edit') + t('common.fail') + t('common.errMsg'));
          }
        }

        disable.value = true;
        spinning.value = false;
        closeModal();
        resetFields();
      }

      // 開啟編輯
      function openEdit() {
        isEdit.value = true;
        disable.value = false;
      }

      /*=========data=========*/
      return {
        t,

        //modal
        title,
        visible,
        registerModal,

        //form
        registerForm,
        schemas,
        handleSubmit,
        openEdit,
        isEdit,
        disable,
        closeModal,
        spinning,
        userInfo,
        dayjs,
        currentInfo,
        type,
        formatToDateTime,
      };
    },
  });
</script>
<style lang="less" scoped>
  .edit-form {
    :deep(.ant-switch-disabled) {
      opacity: 0.6;
    }

    :deep(.ant-radio-button-wrapper-disabled) {
      &.ant-radio-button-wrapper-checked {
        color: #fff;
        background: #e8572b;
        border-color: #e8572b;
        opacity: 0.6;
      }
    }
  }
</style>
