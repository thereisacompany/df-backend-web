<template>
  <div>
    <!-- memo -->
    <div class="user-memo">
      <div>
        <table class="w-full">
          <tr class="momo-item" v-for="(v, index) in memoList" :key="index">
            <td>
              <div class="momo-content">{{ v.content }}</div>
              <div class="momo-date" v-if="v.date">
                <Icon icon="akar-icons:clock" :size="10" />
                {{ v.date }}
              </div>
            </td>
            <td class="memo-action">
              <a-dropdown :trigger="['click']">
                <a class="ant-dropdown-link" @click.prevent>
                  <Icon icon="ant-design:ellipsis-outlined" :size="30" />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a href="javascript:;" @click="handleMemoUpdate(v, index)">
                        {{ t('common.edit') }}
                      </a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;" @click="handleMemoRemove(v, index)">
                        {{ t('common.delText') }}
                      </a>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <BasicModal
      :title="
        memoRow.type === 'add' ? t('component.chatRoom.AddMemo') : t('component.chatRoom.EditMemo')
      "
      :canFullscreen="false"
      :draggable="false"
      @register="registerMome"
      @ok="handleOk"
    >
      <a-form layout="vertical" :model="memoRow">
        <a-form-item>
          <template #label>{{ t('component.docManagement.description') }}</template>
          <a-input v-model:value="memoRow.content" />
        </a-form-item>
        <a-form-item>
          <template #label>
            <a-checkbox v-model:checked="memoRow.checked">
              {{ t('component.chatRoom.setReminderDate') }}
            </a-checkbox>
          </template>
          <a-date-picker
            v-show="memoRow.checked"
            class="w-full"
            v-model:value="memoRow.date"
            format="YYYY/MM/DD"
            valueFormat="YYYY/MM/DD"
            :disabled-date="disabledDate"
          />
        </a-form-item>
      </a-form>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { Dropdown, Menu, MenuItem, Form, FormItem, DatePicker, Checkbox } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { showConfirm, showMsg } from '/@/utils/globalTips';
  import { cloneDeep } from 'lodash-es';
  import dayjs from 'dayjs';

  export default defineComponent({
    components: {
      Icon,
      BasicModal,
      ADropdown: Dropdown,
      AMenu: Menu,
      AMenuItem: MenuItem,
      AForm: Form,
      AFormItem: FormItem,
      ADatePicker: DatePicker,
      ACheckbox: Checkbox,
    },
    setup() {
      const { t } = useI18n();

      /*=========values=========*/
      //memo
      const memoList = ref([]);
      const memoRow = reactive({
        index: null,
        content: null,
        date: null,
        checked: false,
        type: null, //edit or add
      });
      const [registerMome, { openModal: openMemoModal, closeModal: closeMemoModal }] = useModal();
      const disabledDate = (current: Dayjs) => {
        return current && current < dayjs().endOf('day');
      };
      /*=========function=========*/
      //memo
      function loadMemo() {
        memoList.value = [];
        for (let index = 0; index < 10; index++) {
          memoList.value.push({
            content: `明天早上幫他儲值5,00${index}`,
            date: '2022/10/20',
            checked: true,
          });
        }
      }
      function handleMemoAdd() {
        openMemoModal();
        memoRow.type = 'add';
        memoRow.index = null;
        memoRow.content = null;
        memoRow.date = null;
        memoRow.checked = false;
      }
      function handleMemoUpdate(row, index) {
        openMemoModal();
        memoRow.type = 'edit';
        memoRow.index = index;
        memoRow.content = row.content;
        memoRow.date = row.date;
        memoRow.checked = row.checked;
      }
      function handleMemoRemove(row, index) {
        showConfirm({
          iconType: 'warning',
          title: 'Tip',
          content: t('common.confirmDelete'),
          onOk() {
            memoList.value.splice(index, 1);
            console.log(row);
          },
          onCancel() {},
        });
      }
      function handleOk() {
        if (memoRow.type === 'edit') {
          //編輯
          if (checkData() === false) return;
          let item = memoList.value[memoRow.index];
          item.content = memoRow.content;
          item.date = memoRow.date;
          item.checked = memoRow.checked;
        } else {
          //新增
          if (checkData() === false) return;
          memoList.value.push(cloneDeep(memoRow));
        }

        closeMemoModal();
      }

      //common
      function checkData() {
        let isCheck = true;
        if (memoRow.checked === true && !memoRow.date) {
          showMsg('warning', t('component.chatRoom.selectReminderDate'));
          isCheck = false;
        } else if (!memoRow.content) {
          showMsg('warning', t('component.Bulletin.noContent'));
          isCheck = false;
        } else if (memoRow.checked === false) {
          memoRow.date = null;
        }
        return isCheck;
      }

      onMounted(() => {
        loadMemo();
      });
      /*=========data=========*/
      return {
        t,

        //memo
        memoList,
        memoRow,
        handleMemoAdd,
        handleMemoUpdate,
        handleMemoRemove,

        //memo model
        registerMome,
        disabledDate,
        handleOk,
      };
    },
  });
</script>
