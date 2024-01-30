<template>
  <div>
    <BasicModal @register="registerModal" :title="title" centered width="1000px">
      <Spin :spinning="spinning">
        <div class="flex">
          <div class="w-1/2">
            <BasicForm
              @register="registerForm"
              layout="vertical"
              class="custom-form custom-form-gap-2"
              :class="disable ? 'edit-form' : ''"
            />
            <!-- <div class="p-3 pt-0">
              <div class="content-subtitle">
                <p> {{ t('component.upload.fileUpload') }}</p>
              </div>
              <div class="">
                <CustomFileUpload
                  ref="uploadRef"
                  v-model:fileList="fileList"
                  accept="image/*"
                  component="card"
                  apiName="historyCategory"
                  :key="fileUploadKey"
                  :disabled="!isEdit"
                />
              </div>
            </div> -->
          </div>
          <!-- <div class="w-1/2">
            <BasicForm
              @register="registerSEOForm"
              layout="vertical"
              class="custom-form custom-form-gap-2"
              :class="disable ? 'edit-form' : ''"
            />
          </div> -->
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
  import { defineComponent, nextTick, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Spin } from 'ant-design-vue';
  // import { CustomUpload } from '/@/components/UploadFile';
  import { deleteNullInParams } from '/@/utils/parameters';
  import { showMsg } from '/@/utils/globalTips';

  //components
  // import { CustomFileUpload } from '/@/components/CustomFileUpload';

  // api
  import { addCategory, updateCategory } from '/@/api/page/locations/locationRegions';

  //data
  import { schemas, seoSchemas } from '/@/views/historyManagement/historyCategory/data';
  import { checkEditFields } from '/@/views/historyManagement/common';
  //data
  import { schemas_step1 } from './data';

  export default defineComponent({
    components: {
      BasicModal,
      BasicForm,
      Spin,
      // CustomFileUpload,
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

      //上傳檔案
      // const uploadRef = ref<any>(null); //上傳附件Ref
      // const fileUploadKey = ref(0);
      // const fileList: any = ref([]);

      // modal
      const [registerModal, { closeModal }] = useModalInner((data) => {
        //初始化
        // fileList.value = [];
        resetFields();
        console.log(data);
        spinning.value = true;
        nextTick(() => {
          type.value = data.type; // 0新增 1編輯
          currentInfo.value = data.record;
          title.value = data.type === 0 ? t('common.create') : t('common.edit');
          isEdit.value = data.type === 0;
          disable.value = data.type === 1;
          if (data.type === 1) {
            // 處理metaData json
            // const metaData = JSON.parse(data.record.metaData);
            // metaData['headerCode'] = data.record.headerCode;
            setFieldsValue(data.record);
            // setSEOFieldsValue(metaData);
            //檔案
            // fileList.value = getImages(data.record);
          }

          // fileUploadKey.value++;
          spinning.value = false;
        });
      });

      // 左側 form
      const [registerForm, { getFieldsValue, setFieldsValue, resetFields }] = useForm({
        layout: 'vertical',
        labelWidth: 300,
        schemas: schemas_step1,
        showActionButtonGroup: false,
        baseColProps: { span: 24 },
        baseRowStyle: { alignItems: 'end' },
        wrapperCol: { span: 23 },
      });

      // 右側SEO form
      const [registerSEOForm, { getFieldsValue: getSEOFieldsValue }] = useForm({
        layout: 'vertical',
        labelWidth: 300,
        schemas: seoSchemas(disable),
        showActionButtonGroup: false,
        baseColProps: { span: 24 },
        baseRowStyle: { alignItems: 'end' },
        wrapperCol: { span: 23 },
      });

      /*=========function=========*/
      // 儲存
      async function handleSubmit() {
        spinning.value = true;

        try {
          //檔案
          // const images = await uploadRef.value.handleSave(fileList.value);

          const value = await getFieldsValue();
          // const seoValue = await getSEOFieldsValue();
          // SEO相關欄位
          // const headerCode = seoValue.headerCode !== undefined ? seoValue.headerCode : null;
          // delete seoValue.headerCode;
          // 除HEADER JS/HTM代碼外其餘欄位包成json
          // const metaData = JSON.stringify(seoValue);
          const params = {
            // code: checkEditFields('code', value.code, type.value, currentInfo.value),
            // headerCode: checkEditFields('headerCode', headerCode, type.value, currentInfo.value),
            id: type.value === 0 ? null : currentInfo.value.id,
            // images: JSON.stringify({ other: images }),
            isDelete: type.value === 0 ? null : currentInfo.value.isDelete, // 0為未刪除
            isEnable: type.value === 0 ? null : currentInfo.value.isEnable, // 暫無切換停用啟用
            // isPublish: checkEditFields('isPublish', value.isPublish, type.value, currentInfo.value),
            // isTop: checkEditFields('isTop', value.isTop, type.value, currentInfo.value),
            memo: checkEditFields('memo', value.memo, type.value, currentInfo.value),
            // metaData: checkEditFields('metaData', metaData, type.value, currentInfo.value),
            name: checkEditFields('name', value.name, type.value, currentInfo.value),
            sort: checkEditFields('sort', value.sort, type.value, currentInfo.value),
          };
          deleteNullInParams(params);

          if (type.value === 0) {
            // 新增
            try {
              await addCategory(params);
              showMsg('success', t('common.create') + t('common.success'));
              emit('reload');
            } catch (error) {
              showMsg('error', t('common.create') + t('common.fail') + t('common.errMsg'));
            }
          } else {
            // 編輯
            try {
              await updateCategory(params);
              showMsg('success', t('common.edit') + t('common.success'));
              emit('reload');
            } catch (error) {
              showMsg('error', t('common.edit') + t('common.fail') + t('common.errMsg'));
            }
          }

          disable.value = true;
          isEdit.value = false;
          closeModal();
        } catch (e) {
        } finally {
          spinning.value = false;
        }
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
        registerSEOForm,
        seoSchemas,
        handleSubmit,
        openEdit,
        isEdit,
        disable,
        closeModal,
        spinning,

        //file
        // uploadRef,
        // fileUploadKey,
        // fileList,
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
