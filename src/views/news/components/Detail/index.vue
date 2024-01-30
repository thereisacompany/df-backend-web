<template>
  <div>
    <BasicModal
      @register="registerModal"
      centered
      :title="title"
      width="900px"
      @visible-change="handleShow"
    >
      <Spin :spinning="spinning">
        <div class="p-6">
          <BasicForm
            @register="registerForm"
            layout="vertical"
            class="custom-form custom-form-gap-2"
            :class="disable ? 'edit-form' : ''"
          />
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
  import { defineComponent, ref, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { showMsg } from '/@/utils/globalTips';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { userInfo } from '/@/utils/commonly';
  import dayjs from 'dayjs';
  import { addNews, updateNews } from '/@/api/page/news';
  import { deleteNullInParams } from '/@/utils/parameters';
  import { Spin } from 'ant-design-vue';
  //data
  import { schemas } from './data';
  export default defineComponent({
    components: {
      BasicModal,
      BasicForm,
      Spin,
    },
    emits: ['register', 'reload'],
    setup(_, { emit }) {
      const { t } = useI18n();
      /*=========values=========*/
      const visible = ref(false);
      const title = ref<string>('');
      const isEdit = ref(false);
      const disable = ref(false);
      const userId = Number(userInfo.id);
      const spinning = ref(false);
      const currentData = ref();
      const [registerModal, { closeModal }] = useModalInner((data) => {
        spinning.value = true;
        currentData.value = data;
        title.value = data.type === 1 ? t('common.create') : t('common.edit');
        if (data.type === 2) {
          nextTick(() => {
            let value = { ...data.record };
            value.visible = data.record.visible === 1;
            setFieldsValue(value);
            disable.value = true;
          });
        } else {
          setFieldsValue({
            createdBy: userInfo.username, //純顯示用，後端會自行加入發布者
          });
          disable.value = false;
          isEdit.value = true;
          console.log('registerModal', isEdit.value);
        }

        setTimeout(() => {
          spinning.value = false;
        }, 300);
      });
      const [registerForm, { setFieldsValue, resetFields, getFieldsValue, validateFields }] =
        useForm({
          layout: 'vertical',
          labelWidth: 200,
          schemas: schemas(disable),
          showActionButtonGroup: false,
          baseColProps: { span: 24 },
          baseRowStyle: { alignItems: 'end' },
          wrapperCol: { span: 23 },
        });

      /*=========function=========*/
      // 打開modal
      async function handleShow(visible: boolean) {
        if (visible === false) {
          resetFields();
          isEdit.value = false;
        }
      }
      async function handleSubmit() {
        spinning.value = true;
        const value = getFieldsValue();
        const data = {
          id: currentData.value.type !== 1 ? currentData.value.record.id : null,
          type: value.type,
          title: value.title,
          content: value.content,
          visible: value.visible ? 1 : 2,
          visibleAt: value.visibleAt,
          createdAt: dayjs(),
          createdBy: value.createdBy, //純顯示用，後端會自行加入發布者
        };
        deleteNullInParams(data);

        validateFields().then(() => {
          if (currentData.value.type === 1) {
            addNews(data, userId)
              .then(() => {
                showMsg('success', t('common.create') + t('common.success'));
                closeModal();
                emit('reload');
              })
              .catch((error) => {
                console.log('新增失敗', error);
              });
          } else {
            updateNews(data, userId)
              .then(() => {
                showMsg('success', t('common.edit') + t('common.success'));
                closeModal();
                emit('reload');
              })
              .catch((error) => {
                console.log('編輯失敗', error);
              });
          }
          spinning.value = false;
        });
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
        // showBtn,
        disable,
        handleShow,
        closeModal,
        spinning,
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
