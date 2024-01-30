<!-- 個人資訊  -->
<template>
  <div class="user-container">
    <div class="header">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane :key="0" :tab="t('component.chatRoom.customProfile')" />
      </a-tabs>
    </div>
    <div class="body">
      <div class="card">
        <div class="card-header">
          <div class="avatar">
            <div class="avatar-img">
              {{ getHeadName(info.friendName) }}
            </div>
          </div>
          <div class="name-membership">
            <div class="name">{{ info.friendName }} {{ info.friendId }}</div>
            <div class="membership"
              ><Icon icon="ri:vip-fill" /><span class="level ml-1">1</span
              ><span class="member-status ml-3">普通會員</span>
            </div>
          </div>
        </div>
        <a-spin :spinning="loading">
          <div class="card-body">
            <div class="items">
              <div class="item">
                <span class="item-title">{{ t('component.backend.registrationTime') }}</span>
                <span class="content">{{ info.createAt }}</span>
              </div>
              <div class="item">
                <span class="item-title">{{ t('component.backend.registrationArea') }}</span>
                <span class="content">台灣</span>
              </div>
              <div class="item">
                <span class="item-title">{{ t('component.backend.language') }}</span>
                <span class="content">繁體中文</span>
              </div>
              <div class="item">
                <span class="item-title">{{ t('component.backend.birthday') }}</span>
                <span class="content">1999/01/01</span>
              </div>
              <div class="item">
                <span class="item-title">{{ t('component.backend.mail') }}</span>
                <span class="content">123456@gmail.com</span>
              </div>
              <div class="item">
                <span class="item-title">{{ t('component.backend.ip') }}</span>
                <span class="content">111.11.111.1</span>
              </div>
              <div class="item">
                <span class="item-title">{{ t('component.backend.lastActTime') }}</span>
                <span class="content">{{ info.lastActTime }}</span>
              </div>
            </div>
          </div>
        </a-spin>
      </div>
      <div class="black-list"
        ><div class="flex items-center">
          <Icon icon="ion:alert-circle" :size="21" :style="{ color: '#E7582B' }" /><span
            class="title ml-1"
            >{{ t('component.backend.addBlackList') }}</span
          >
        </div>
        <div
          ><button class="blockade-btn" @click="blockadeVisible = true">{{
            t('component.backend.blockade')
          }}</button></div
        ></div
      >
    </div>
  </div>
  <a-modal v-model:visible="blockadeVisible" width="490px" :centered="true" :destroyOnClose="true">
    <div class="modal-content">
      <div
        >{{
          t('component.backend.checkAddBlack') +
          `${info.friendName} ${info.friendId}` +
          t('component.backend.checkAddBlack2')
        }}
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <a-button @click="blockadeVisible = false" class="cancel-btn">{{
          t('common.cancel')
        }}</a-button>
        <a-button type="primary" @click="handleAddBlockade" class="save-btn">{{
          t('common.confirm')
        }}</a-button>
      </div>
    </template>
  </a-modal>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { Tabs, TabPane, Modal, Spin } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getHeadName } from '/@/views/customerService/common';
  import dayjs from 'dayjs';

  export default defineComponent({
    components: {
      Icon,
      ATabs: Tabs,
      ATabPane: TabPane,
      AModal: Modal,
      ASpin: Spin,
    },
    // emits: ['update-info'],
    setup() {
      const { t } = useI18n();
      const activeKey = ref(0);
      const blockadeVisible = ref(false);
      const loading = ref(true);

      //info
      const info = reactive<any>({
        createAt: null,
        friendId: null,
        friendName: null,
        id: null,
        jobId: null,
        tgId: null,
        lastActTime: null,
        lastMsgTime: null,
      });

      // 假資料
      // const fakeInfo = reactive<any>({
      //   registrationTime: '2022/10/10 10:10:00',
      //   registrationArea: '台灣區',
      //   language: '繁體中文',
      //   birthday: '1999/01/01',
      //   mail: 'abc123456@gmail.com',
      //   ip: '111.111.11.11',
      //   lastActTime: '2022/12/12 12:12:12',
      // });

      // 設定個人資料 由父層傳入
      function setUserInfo(data) {
        info.id = data.id;
        info.createAt = dayjs(data.createAt).format('YYYY-MM-DD HH:mm:ss');
        info.friendId = data.friendId;
        info.friendName = data.friendName;
        info.jobId = data.jobId;
        info.tgId = data.tgId;
        info.lastActTime = data.lastActTime;
        info.lastMsgTime = data.lastMsgTime;
        info.isEdit = false;
        loading.value = false;
      }

      // 確認加入黑名單
      function handleAddBlockade() {
        console.log('handleAddBlockade', info);
      }

      /*=========data=========*/
      return {
        t,
        activeKey,
        getHeadName,
        info,
        setUserInfo,
        blockadeVisible,
        handleAddBlockade,
        loading,
      };
    },
  });
</script>
<style lang="less" scoped>
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

  .modal-content {
    height: 135px;
    padding: 87px 28px 0 28px;
    margin-bottom: 36px;
    text-align: center;
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
