<template>
  <div class="overflow-y-auto h-full" style="margin: 0 25px; padding-top: 15px">
    <div class="chat-container">
      <!-- 好友清單 -->
      <div id="chatList" class="chat-list">
        <div class="search-area">
          <div class="friend-total">
            {{ t('component.feedback.member') }}({{ friendData.total }})</div
          >
          <div class="friend-search">
            <a-input
              v-model:value="keyword"
              :placeholder="t('component.chatRoom.searchFriends')"
              @change="handleSearch"
            />
            <Icon icon="akar-icons:search" :size="20" />
          </div>
          <div class="more-btn ml-1">
            <a-popover
              v-model:visible="visible"
              trigger="click"
              placement="bottomLeft"
              class="pop-card"
            >
              <template #content>
                <button @click="openBlackList">{{ t('component.backend.viewBlackList') }}</button>
              </template>
              <button @click="visible = !visible">
                <Icon icon="ic:outline-more-horiz" :size="31" />
              </button>
            </a-popover>
          </div>
        </div>

        <a-tabs v-model:activeKey="activeKey" @change="handleTabClick">
          <a-tab-pane :key="1" :tab="t('component.chatRoom.all')" />
          <a-tab-pane :key="2" :tab="t('component.chatRoom.unreadMessage')" />
          <a-tab-pane :key="3" :tab="t('component.chatRoom.processing')" />
        </a-tabs>
        <div
          class="chat-list-tag"
          v-for="(v, index) in friendData.data"
          :key="index"
          :class="{ active: v.active === true }"
          @click="handleActive(v)"
        >
          <div class="tag-area">
            <div class="head">
              {{ getHeadName(v.FriendName) }}
            </div>
            <div class="mytext">
              <div class="name">{{ v.FriendName }}</div>
              <div class="message">{{ v.message }}</div>
              <div class="time">
                {{ v.lastMsgTime ? dayjs(v.lastMsgTime).format('YYYY/MM/DD') : '' }}
              </div>
            </div>
            <div class="msg-num" v-if="v.isRead === false"></div>
          </div>
        </div>
      </div>
      <!-- 對話框 & 工具列-->
      <div class="chat-area">
        <ChatBox
          ref="chatBoxRef"
          :userInfo="userInfo"
          v-if="userInfo.id"
          @refresh-row="refreshRow"
        />
      </div>

      <!-- 個人資訊 -->
      <div class="user-area">
        <!-- 舊版 -->
        <!-- <UserBlock ref="userBlockRef" v-if="userInfo.id" @update-info="updateInfo" /> -->
        <NewUserArea ref="userBlockRef" v-if="userInfo.id" />
      </div>

      <!-- 黑名單modal -->
      <BlackListModal ref="modalRef" />
    </div>
  </div>
</template>
<script lang="ts">
  import '/@/design/chat-room.less';
  import { defineComponent, onMounted, nextTick, reactive, watch, ref } from 'vue';
  import { Tabs, TabPane, Popover } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { showMsg } from '/@/utils/globalTips';
  import XEUtils from 'xe-utils';
  import dayjs from 'dayjs';

  // import UserBlock from './components/UserBlock/index.vue'; //個人資訊
  import NewUserArea from './components/NewUserArea/index.vue'; //個人資訊
  // import ChatBox from './components/ChatBox/index.vue'; //對話框
  // import { useUserStore } from '/@/store/modules/user';
  // import { getTGFriends, updateTGFriends } from '/@/api/page/TGRobot/tgRobotApi';
  import { getHeadName } from '/@/views/customerService/common';
  // import { useRobotState } from '/@/store/modules/page/tgRobot';
  import BlackListModal from './components/BlackListModal/index.vue';
  import { useCSChart } from '/@/store/modules/page/csChat';

  export default defineComponent({
    components: {
      // UserBlock,
      NewUserArea,
      // ChatBox,
      Icon,
      ATabs: Tabs,
      ATabPane: TabPane,
      APopover: Popover,
      BlackListModal,
    },
    setup() {
      // const userStore = useUserStore();
      // const robotState = useRobotState();
      //MQTT
      const CSChatState = useCSChart(); //客服聊天室Store

      const { t } = useI18n();
      const visible = ref(false);
      const openModal = ref(false);
      const modalRef = ref<any>(null);
      /*=========values=========*/
      //Friend List
      const activeKey = ref<any>(1);
      const keyword = ref<any>(null);
      const friendData = reactive<any>({ source: [], data: [], total: 0 });

      //ChatBox
      const chatBoxRef = ref<any>(null);

      //UserInfo
      const userBlockRef = ref<any>(null);
      const userInfo = reactive<any>({
        createAt: null,
        friendId: null,
        friendName: null,
        userId: null,
        id: null,
        jobId: null,
        tgId: null,
        lastActTime: null,
        lastMsgTime: null,
      });

      //other
      const otherValue = ref<any>('');
      const maxRows = ref<any>(8);

      //my info
      // const myInfo = userStore.getUserInfo;

      // 假資料
      // const fakeData = [
      //   {
      //     CreateAt: '2022-10-21T07:46:44',
      //     FriendId: 1025667495,
      //     FriendName: 'Zora',
      //     Id: 5,
      //     JobId: 'CEOS205024',
      //     LastActTime: '2023-01-13T13:53:05',
      //     LastMsgTime: '2023-01-13T13:53:05',
      //     TGId: 5393360032,
      //     UserId: 405,
      //     active: false,
      //     friendName: 'Zora',
      //     isRead: true,
      //     message: '對話0001~~',
      //   },
      //   {
      //     CreateAt: '2022-10-21T07:46:44',
      //     FriendId: 1025667495,
      //     FriendName: 'Edith',
      //     Id: 6,
      //     JobId: 'CEOS205024',
      //     LastActTime: '2023-01-13T13:53:05',
      //     LastMsgTime: '2023-01-13T13:53:05',
      //     TGId: 5323692729,
      //     UserId: 405,
      //     active: false,
      //     friendName: 'Edith',
      //     isRead: true,
      //     message: '對話0001~~',
      //   },
      // ];

      /*=========function=========*/
      //Friend List
      async function loadData() {
        // getTGFriends(myInfo.username).then((res) => {
        //   let list: any = [];
        //   res.data.result.forEach((item) => {
        //     const model = item;
        //     item.message = '對話0001~~';
        //     item.active = false;
        //     item.isRead = checkRead(item.lastActTime, item.lastMsgTime);
        //     list.push(model);
        //   });
        //   // 假資料
        //   // fakeData.forEach((item) => {
        //   //   const model = item;
        //   //   item.message = '對話0001~~';
        //   //   item.active = false;
        //   //   item.isRead = checkRead(item.LastActTime, item.LastMsgTime);
        //   //   list.push(model);
        //   // });
        //   friendData.source = list;
        //   friendData.data = list;
        //   friendData.total = list.length;
        // });
      }
      async function handleActive(row) {
        updateInfo(row);
        //Active
        // const data = await updateFriend(row);
        const status = 200;
        if (status === 200) {
          for (let y = 0; y < friendData.data.length; y++) {
            let item = friendData.data[y];
            if (userInfo.id === item.id) {
              item.active = true;
              item.isRead = true; //設定已讀
            } else {
              item.active = false;
            }
          }

          chatBoxRef.value.spinning = true;
          userBlockRef.value.loading = true;
          //ChatBox
          nextTick(() => {
            setTimeout(() => {
              userBlockRef.value.setUserInfo(userInfo);
              chatBoxRef.value.loadData();
            }, 3000);
          });
        } else {
          showMsg('warning', '更新已讀狀態錯誤');
        }
      }
      function handleSearch(e) {
        const value = e.target.value.toLowerCase();
        const source = cloneDeep(friendData.source);
        if (value) {
          friendData.data = XEUtils.filter(
            source,
            (item) => item.friendName.toLowerCase().indexOf(value) > -1,
          );
        } else {
          friendData.data = source;
        }
      }
      function handleTabClick() {
        const array = friendData.source;
        if (activeKey.value == 1) {
          friendData.data = array;
        } else {
          friendData.data = XEUtils.filter(array, (item) => item.isRead === false);
        }
      }
      //更新朋友清單訊息內容及時間
      async function refreshRow(row) {
        const index = XEUtils.findIndexOf(friendData.data, (o) => o.Id === userInfo.id);
        let item = friendData.data[index];
        // const model = {
        //   Id: userInfo.id,
        //   FriendName: userInfo.friendName,
        //   UserId: userInfo.userId,
        //   LastMsgTime: row.datetime,
        //   LastActTime: row.datetime,
        // };
        // const data = await updateFriend(model);
        const status = 200;
        if (status === 200) {
          if (row.message) item.message = row.message;
          // if (row.files.length > 0) item.message = '檔案';
          if (row.icon) item.message = '貼圖';
          item.lastMsgTime = row.datetime;
        }
      }
      function updateInfo(row) {
        //UserInfo
        userInfo.id = row.Id;
        userInfo.createAt = row.CreateAt;
        userInfo.friendId = row.FriendId;
        userInfo.friendName = row.FriendName;
        userInfo.jobId = row.JobId;
        userInfo.userId = row.UserId;
        userInfo.tgId = row.TGID;
        userInfo.lastActTime = row.LastActTime;
        userInfo.lastMsgTime = row.LastMsgTime;

        //數據
        const index = XEUtils.findIndexOf(friendData.data, (item) => item.Id == row.Id);
        friendData.data[index].friendName = row.friendName;

        //來源
        const sourceIndex = XEUtils.findIndexOf(friendData.source, (item) => item.Id == row.Id);
        friendData.source[sourceIndex].friendName = row.friendName;
      }

      //Common
      function goCenterAnchor(anchorId) {
        chatBoxRef.value.goCenterAnchor(anchorId);
      }
      // function checkRead(lastActTime, lastMsgTime) {
      //   let isRead = true; //true=已讀 / false=未讀
      //   if (lastActTime && lastMsgTime) {
      //     isRead = dayjs(lastActTime).diff(lastMsgTime, 'time') >= 0;
      //   } else if (lastMsgTime && !lastActTime) {
      //     isRead = false;
      //   }
      //   return isRead;
      // }
      // async function updateFriend(row) {
      //   //更新已讀時間
      //   const tgFriendId = row.Id;
      //   const model = {
      //     friendName: row.FriendName,
      //     lastMsgTime: row.LastMsgTime
      //       ? dayjs(row.LastMsgTime).format('YYYY-MM-DD HH:mm:ss')
      //       : dayjs().format('YYYY-MM-DD HH:mm:ss'),
      //     lastActTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      //   };

      //   // const data = await updateTGFriends(tgFriendId, model);
      //   // return data;
      // }

      // 查看黑名單
      function openBlackList() {
        modalRef.value.visible = true; // 開啟modal
        // openModal.value = true; // 開啟modal
        visible.value = false; // 關閉popover
      }

      watch(
        () => CSChatState.getCount,
        () => {
          loadData();
          if (chatBoxRef.value) {
            chatBoxRef.value.pushUnreadMsg(CSChatState.getPushMsg());
          }
        },
      );

      onMounted(() => {
        loadData();
      });
      /*=========data=========*/
      return {
        t,
        dayjs,

        //Friend List
        activeKey,
        keyword,
        friendData,
        handleActive,
        handleSearch,
        handleTabClick,
        refreshRow,

        //ChatBox
        chatBoxRef,

        //UserInfo
        userBlockRef,
        userInfo,
        getHeadName,
        updateInfo,

        //other
        otherValue,
        maxRows,
        goCenterAnchor,
        visible,
        openBlackList,
        openModal,

        modalRef,
      };
    },
  });
</script>
<style lang="less" scoped>
  .more-btn {
    .ant-popover {
      border: 1px salmon solid;
    }
  }
</style>
