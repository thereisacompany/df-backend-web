<template>
  <CollapseContainer :title="t('component.personal.changePassword')" :canExpan="false">
    <div class="grid grid-cols-6 gap-4 py-6 px-10">
      <div class="col-span-6 lg:col-span-3">
        <BasicForm @register="register" />
        <div class="flex justify-center">
          <a-button @click="resetFields"> {{ t('common.resetText') }} </a-button>
          <a-button class="!ml-4" type="primary" @click="handleSubmit">
            {{ t('common.confirm') }}
          </a-button>
        </div>
      </div>
    </div>
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import { BasicForm, useForm } from '/@/components/Form';
  import { changePasswordSchema } from './data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useGo } from '/@/hooks/web/usePage';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useUserStore } from '/@/store/modules/user';
  import { ChangePassword } from '/@/api/sys/user';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    components: { CollapseContainer, BasicForm },
    setup() {
      const go = useGo();
      const { t } = useI18n();
      const { createMessage, createInfoModal } = useMessage();
      const userStore = useUserStore();
      const [register, { validate, resetFields }] = useForm({
        labelWidth: 200,
        layout: 'vertical',
        showActionButtonGroup: false,
        schemas: changePasswordSchema,
        baseColProps: { span: 24 },
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          const { passwordOld, passwordNew } = values;
          const userId: number | string = userStore.getUserInfo.userId;
          const resData: any = ref([]);
          resData.value.push({
            userId: userId,
            oldpwd: passwordOld,
            newpwd: passwordNew,
          });
          await ChangePassword(resData.value[0])
            .then(async (res) => {
              if (res != 'pwd error') {
                createMessage.success(t('component.personal.changePasswordSuccess'));
                createInfoModal({
                  title: t('component.personal.changePasswordSuccess'),
                  content: t('component.personal.backLogin'),
                  async onOk() {
                    userStore.logout();
                    go(PageEnum.BASE_LOGIN);
                  },
                });
              } else {
                createMessage.error(t('component.personal.currentPasswordError'));
              }
            })
            .catch(() => {
              createMessage.error(t('component.personal.currentPasswordError'));
            });
        } catch (error) {
          console.log(error);
        }
      }
      return {
        t,
        register,
        resetFields,
        handleSubmit,
      };
    },
  });
</script>
<style lang="less" scoped>
  .extra {
    float: right;
    margin-top: 10px;
    margin-right: 30px;
    font-weight: normal;
    color: #1890ff;
    cursor: pointer;
  }
</style>
