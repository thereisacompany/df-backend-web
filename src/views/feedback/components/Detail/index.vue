<template>
  <div>
    <Modal
      v-model:visible="visible"
      width="35%"
      centered
      :title="t('common.edit')"
      :destroyOnClose="false"
    >
      <div class="p-6">
        <BasicForm
          @register="registerForm"
          layout="vertical"
          class="custom-form custom-form-gap-2"
        />
        <div class="px-2" v-if="!showBtn">
          <span class="mr-2" style="color: #585858">
            {{ t('common.reply') }}{{ t('component.feedback.date') }}
          </span>
          <span style="color: #585858">{{ update.updateBy }} {{ update.updateAt }}</span>
        </div>
      </div>
      <template #footer>
        <div class="footer-btn flex justify-end">
          <a-button class="mx-2" @click="visible = false">{{ t('common.cancel') }} </a-button>
          <div class="" v-if="showBtn">
            <a-button class="mx-2" type="primary" @click="openEdit" v-if="!isEdit">
              {{ t('common.edit') }}
            </a-button>
            <a-button class="mx-2" type="primary" @click="handleSave" v-else>
              {{ t('common.saveText') }}
            </a-button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, reactive, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Modal } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { showMsg } from '/@/utils/globalTips';
  import { getFeedback, replayFeedback } from '/@/api/page/feedback';
  import dayjs from 'dayjs';
  import { userNameJobId } from '/@/utils/commonly';
  //data
  import { schemas } from './data';
  export default defineComponent({
    components: {
      BasicForm,
      Modal,
    },
    emits: ['reload'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const isEdit = ref(false);
      const showBtn = ref(false);
      const disable = ref(true);
      const update = reactive({
        updateAt: '',
        updateBy: '',
      });
      /*=========values=========*/
      //Modal
      const visible = ref(false);
      const currentData = ref();

      //from
      const [registerForm, { setFieldsValue, validateFields, getFieldsValue }] = useForm({
        schemas: schemas(disable),
        labelWidth: 200,
        baseColProps: { span: 24 },
        showActionButtonGroup: false,
      });

      /*=========function=========*/
      // 打開modal
      async function openModal(data) {
        visible.value = true;

        //初始化
        isEdit.value = false;
        disable.value = true;
        currentData.value = null;

        //設定值
        nextTick(() => {
          setFieldsValue(data);
          currentData.value = data;
          showBtn.value = data.response === null;
          if (data.response !== null) {
            update.updateAt = data.updatedAt;
            update.updateBy = data.updatedBy;
          }
        });
      }
      async function handleSave() {
        validateFields().then(() => {
          const values = getFieldsValue();
          if (values.response !== null) {
            const params = {
              id: currentData.value.id,
              response: values.response,
              updateAt: dayjs(),
              updateBy: userNameJobId,
            };
            replayFeedback(params)
              .then(() => {
                fetchFeedback();
                showMsg('success', t('common.reply') + t('common.success'));
                disable.value = true;
                showBtn.value = false;
              })
              .catch((error) => {
                console.log('error from 回覆意見', error);
              });
          } else {
            visible.value = false;
          }
        });
      }

      // 取得單筆意見反饋
      async function fetchFeedback() {
        const res = await getFeedback(currentData.value.id);
        const feedback = res.result.feedback;
        setFieldsValue(feedback);
        if (feedback.response !== null) {
          update.updateAt = feedback.updatedAt;
          update.updateBy = feedback.updatedBy;
        }
        emit('reload');
      }

      // 開啟編輯
      function openEdit() {
        isEdit.value = true;
        disable.value = false;
      }

      /*=========data=========*/
      return {
        t,
        // Modal
        visible,
        currentData,
        handleSave,
        showBtn,

        //form
        registerForm,
        schemas,
        disable,
        fetchFeedback,

        openEdit,
        openModal,
        isEdit,
        update,
      };
    },
  });
</script>
<style lang="less" scoped>
  .copy-email-btn {
    width: 100%;
    height: 38px;
    background: #ffeee6;
    border-radius: 30px;
    color: #e7582b;
  }
</style>
