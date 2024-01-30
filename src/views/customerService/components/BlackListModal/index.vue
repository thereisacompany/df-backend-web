<template>
  <PageWrapper>
    <a-modal
      v-model:visible="visible"
      :title="t('component.backend.blackList')"
      width="30%"
      @cancel="closeModal"
    >
      <div class="subtitle">
        <span class="list-total">{{ `${t('component.backend.list')}(${total})` }}</span>
        <span class="select-total"
          >{{ t('component.backend.select') }} <span style="color: #e8572b">{{ select }}</span> /
          {{ total }}</span
        >
      </div>
      <div class="ml-9 mr-3 mt-6 list-content">
        <CheckboxGroup v-model:value="checkedList" style="display: block">
          <div v-for="item in options" :key="item.value" class="list m-0">
            <div class="list-item">
              <div>
                <Avatar v-if="item.avatar == 'none'" :style="randomColor(item.label)" />
                <Avatar :src="item.avatar" v-else />
                <span class="item-name">
                  {{ item.label }}
                </span>
              </div>

              <a-checkbox
                :value="item.value"
                v-model:checked="checkAll"
                class="items-center"
                id="checkbox"
              />
            </div>
          </div>
        </CheckboxGroup>
      </div>
      <template #footer>
        <div class="mt-7 footer">
          <a-button class="cancel-btn" @click="closeModal(false)">{{
            t('common.cancel')
          }}</a-button>
          <a-button class="unblock-btn" @click="deleteVisible = true">{{
            t('component.backend.unblock')
          }}</a-button>
        </div>
      </template>
    </a-modal>

    <a-modal v-model:visible="deleteVisible" width="490px" :centered="true" :destroyOnClose="true">
      <div class="modal-content">
        <div>{{ t('component.backend.checkUnblock') }}</div>
      </div>

      <template #footer>
        <div class="modal-footer">
          <a-button @click="closeModal(true)" class="cancel-btn">{{ t('common.cancel') }}</a-button>
          <a-button type="primary" @click="handleDeleteItem" class="save-btn">{{
            t('common.confirm')
          }}</a-button>
        </div>
      </template>
    </a-modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, watch, toRefs } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Modal, Checkbox, Avatar } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    components: {
      Avatar,
      PageWrapper,
      AModal: Modal,
      ACheckbox: Checkbox,
      CheckboxGroup: Checkbox.Group,
    },

    setup() {
      const { t } = useI18n();
      const visible = ref(false);
      const value = ref();
      const checked = ref(false);
      const options: any = ref([]);
      const total = ref();
      const select = ref(0);
      const deleteVisible = ref(false);

      const state = reactive({
        indeterminate: false,
        checkAll: false,
        checkedList: [],
        theLength: 0,
      });

      function loadData() {
        // 假資料
        for (let i = 0; i < 15; i++) {
          const option = {
            label: `Member${i}`,
            value: i,
            avatar: '/src/assets/images/avatar.png',
          };
          options.value.push(option);
        }

        total.value = options.value.length;
      }

      // 關閉黑名單modal
      function closeModal(isConfirm) {
        console.log('isConfirm', isConfirm); // 確認是哪一個modal
        if (isConfirm == true) {
          deleteVisible.value = false;
        } else {
          visible.value = false;
        }

        state.checkedList = []; // 清空勾選的
        console.log('closeModal', state.checkedList);
      }

      //---*頭像顏色
      const randomColor = (id) => {
        const x = Math.pow(10, String(id).length);
        return {
          backgroundColor: `#${Math.floor(id * (1 / x) * 16777215).toString(16)}`,
        };
      };

      // 確認刪除modal-確認 deleteVisible
      function handleDeleteItem() {
        console.log('handleDeleteItem', state.checkedList);
      }

      watch(
        () => state.checkedList,
        (value) => {
          console.log('val', value);
          select.value = value.length;
        },
      );

      onMounted(() => {
        loadData();
      });
      /*=========data=========*/
      return {
        t,
        visible,
        options,
        value,
        checked,
        randomColor,
        total,
        select,
        ...toRefs(state),
        deleteVisible,
        handleDeleteItem,
        closeModal,
      };
    },
  });
</script>
<style lang="less" scoped>
  @color-green: #0dc452;
  @color-primary: #e7582b;

  /* mixin */
  .flex(@direction:row, @justify:center, @items:center, @wrap:nowrap) {
    display: flex;
    flex-flow: @direction @wrap;
    justify-content: @justify;
    align-items: @items;
  }

  .font(@size:20px, @weight:700, @height: 32px, @color:#ffffff ) {
    font-size: @size;
    font-weight: @weight;
    line-height: @height;
    color: @color;
  }

  .footer-btn {
    height: 45px;
    width: 138px;
    border-radius: 12px;
    text-align: center;
    .font(14px, 500, 17px,#ffffff );
  }

  /*---------------*/
  .subtitle {
    margin: 26px 32px;
    .flex(row, space-between, center, nowrap);

    .list-total {
      .font(14px, 600, 17px,#9d9d9d );
    }

    .select-total {
      .font(14px, 600, 17px,#585858 );
    }
  }

  .list-content {
    max-height: 500px;
    overflow-y: scroll;

    .ant-checkbox-group {
      display: flex;
      flex-direction: column;

      .list {
        margin-right: 0;
        height: 86px;

        .list-item {
          border-bottom: 1px solid #d6d6d6;
          height: 75px;
          width: 100%;
          padding-right: 34px;
          padding-left: 12px;
          .flex(row, space-between, center, nowrap);

          .ant-checkbox-wrapper {
            :deep(.ant-checkbox) {
              width: 24px;
              height: 24px;

              &-checked {
                .ant-checkbox-inner {
                  border-color: @color-green;
                  background: @color-green;
                }

                &::after {
                  border: 1px solid @color-green;
                }
              }

              &::after {
                border: 1px solid @color-green;
              }

              .ant-checkbox-inner {
                width: 24px;
                height: 24px;

                &::after {
                  left: 35.5%;
                }
              }
            }
          }

          .ant-avatar {
            width: 48px;
            height: 48px;
          }

          .item-name {
            margin-left: 8px;
            .font(14px, 400, 22px,#000000 );
          }
        }

        &:hover {
          background: #f7f7f7;

          .ant-checkbox-wrapper :deep(.ant-checkbox) {
            .ant-checkbox-inner {
              border-color: @color-green;
            }
          }

          .ant-checkbox-inner {
            border-color: @color-green;
          }

          .ant-checkbox-checked::after {
            border-color: @color-green;
          }
        }
      }
    }
  }

  .footer {
    .flex(row, center, center, nowrap);

    .cancel-btn {
      background: #9d9d9d;
      .footer-btn;
    }

    .unblock-btn {
      background: #e8572b;
      .footer-btn;
    }
  }

  .modal-content {
    height: 135px;
    padding-top: 87px;
    padding-bottom: 24px;
    .flex(row, center, center, nowrap);
    .font(20px, 600, 24px,#262626 );
  }

  .modal-footer {
    .flex(row, center, center, nowrap);

    .cancel-btn,
    .save-btn {
      height: 45px;
      width: 138px;
      border-radius: 12px;
      text-align: center;
      .font(14px, 500, 17px,#ffffff );
    }

    .cancel-btn {
      background: #9d9d9d;
    }

    .save-btn {
      background: #e8572b;
    }
  }
</style>
