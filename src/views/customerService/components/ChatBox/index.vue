<template>
  <div class="chat-box" :style="{ paddingBottom: chatBoxStyle + 'px' }">
    <!-- 查詢聊天紀錄 -->
    <SearchChat
      :userInfo="userInfo"
      v-model:chatList="chatList"
      @go-center-anchor="goCenterAnchor"
      @set-loading="setLoading"
    />

    <!-- 對話框 -->
    <div class="chat-message" id="chatBox">
      <!-- chat -->
      <a-spin :spinning="spinning">
        <div
          v-for="(v, index) in chatList"
          class="message-row"
          :key="index"
          :id="'row_' + index"
          :class="[
            v.source === 'other' ? 'other-message' : 'you-message',
            v.isSeach ? 'active-background' : '',
          ]"
        >
          <!-- v.files.length > 0 || -->
          <div class="message-content">
            <!-- <PreviewFile v-model:chatList="chatList" :index="index" /> -->
            <!-- <img class="message-icon" :src="v.icon" v-if="v.icon" /> -->
            <div class="message-text"
              >{{ v.message }}
              <div class="message-time">
                {{ v.datetime }}
                <span
                  class="cursor-pointer pl-1"
                  v-if="isShowRemove(v)"
                  @click="handleRemove(index)"
                >
                  收回
                </span>
              </div>
            </div>
          </div>
        </div>
      </a-spin>

      <!-- go bottom icon  -->
      <div
        class="go-bottom-icon"
        v-if="isShowGoBottomIcon"
        @click="goBottomAnchor(`#row_${chatList.length - 1}`)"
      >
        <Icon icon="bi:arrow-down-circle-fill" :size="40" />
      </div>
    </div>

    <!-- 工具列 -->
    <div class="chat-input">
      <div class="relative w-full flex">
        <ToolBar @handle-submit="putEmojiMessage" />

        <!-- 輸入訊息框 -->
        <a-textarea
          v-model:value="message"
          :auto-size="{ minRows: 1, maxRows: maxRows }"
          :placeholder="t('common.inputText')"
          @keydown="handleKeydown"
          @keyup="handleKeyup"
        />
        <div class="w-14 text-center">
          <Icon
            class="my-icon"
            icon="carbon:send-filled"
            :size="30"
            color="#E7582B"
            @click="submitMessage"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, ref, watch } from 'vue';
  import { Input, Spin } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { useI18n } from '/@/hooks/web/useI18n';
  import dayjs from 'dayjs';
  import { useUserStore } from '/@/store/modules/user';
  import SearchChat from './components/SearchChat/index.vue'; //查詢聊天紀錄
  // import PreviewFile from './components/PreviewFile/index.vue'; //預覽檔案
  import ToolBar from './components/ToolBar/index.vue'; //工具列
  import { getNearlyThreeYears, getTalkList, getChatData } from '/@/views/customerService/common';
  // import { createTGTalks } from '/@/api/page/TGRobot/tgRobotApi';
  import { useCSChart } from '/@/store/modules/page/csChat';
  import { doPublish } from '/@/utils/MQTT';

  export default defineComponent({
    components: {
      Icon,
      SearchChat,
      // PreviewFile,
      ToolBar,
      ATextarea: Input.Textarea,
      ASpin: Spin,
    },
    props: {
      userInfo: { type: Object as PropType<any> },
    },
    emits: ['refresh-row'],
    setup(props, { emit }) {
      const { t } = useI18n();

      /*=========values=========*/
      //spin
      const spinning = ref<any>(true);

      //Chat List
      const chatList = ref<any>([]);
      const nowPosition = ref<any>(0);
      const isShowGoBottomIcon = ref<any>(false);
      const chatBoxStyle = ref<any>(0);
      const defaultPadding = 85;

      //Send Message
      const message = ref<any>('');
      const otherValue = ref<any>('');
      const maxRows = ref<any>(8);

      //MQTT
      const CSChatState = useCSChart(); //客服聊天室Store

      //myInfo
      const userStore = useUserStore();
      const myInfo = userStore.getUserInfo;
      /*=========function=========*/

      //Chat List
      function loadData() {
        chatList.value = [];
        setLoading(true);
        const info: any = props.userInfo;
        //移除scroll監聽事件
        removeListener();

        //取得近3年資料
        const model = {
          jobId: '',
          fromTGid: info.tgId,
          toTGid: info.friendId,
          SDateTime: getNearlyThreeYears().sYear,
          EDatetime: getNearlyThreeYears().eYear,
        };
        getTalkList(model)
          .then((res) => {
            chatList.value = getChatData(res, info);
          })
          .finally(() => {
            setTimeout(() => {
              //初始化
              chatBoxStyle.value = defaultPadding;
              isShowGoBottomIcon.value = false;
              watchScroll();

              //跳至指定位置
              if (chatList.value.length > 0) {
                const anchorId = `#row_${chatList.value.length - 1}`;
                goBottomAnchor(anchorId);
              }
              setLoading(false);
            }, 300);
          });
      }
      //页面錨點定位
      function goBottomAnchor(anchorId) {
        goAnchor(anchorId, 'end');
      }
      function goCenterAnchor(anchorId) {
        goAnchor(anchorId, 'center');
      }
      function goAnchor(anchorId, block) {
        nextTick(() => {
          setTimeout(() => {
            document.querySelector(anchorId).scrollIntoView({
              behavior: 'auto', //auto | smooth
              block: block, //start | center | end | nearest
            });

            nowPosition.value = parseInt(anchorId.split('_')[1]);
          }, 30);
        });
      }
      function showGoBottomIcon(status) {
        isShowGoBottomIcon.value = status;
      }
      function watchScroll() {
        const element: any = document.getElementById('chatBox');
        element.addEventListener('scroll', handleScroll);
      }
      function removeListener() {
        const element: any = document.getElementById('chatBox');
        element.removeEventListener('scroll', handleScroll);
      }
      function isShowRemove(row) {
        if (
          row.source !== 'other' &&
          (row.message || row.icon) &&
          dayjs(row.datetime).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
        ) {
          return true;
        }
      }

      //將emoji放入對話框input
      function putEmojiMessage(emoji) {
        message.value = message.value + emoji;
      }

      //Send Message
      function submitMessage() {
        const source = 'message';
        handleSubmit(message.value, source);
        message.value = null;
        handleChatBoxStyle();
      }
      function handleKeyup(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          submitMessage();
        }

        //偵測是否刪除內容
        const value = message.value;
        const count = value ? value.split('\n').length : 0;
        chatBoxStyle.value = defaultPadding;
        if (count > 0 && !e.shiftKey) {
          handleChatBoxStyle();
        }
      }
      function handleKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          return false;
        } else if (e.key === 'Enter' && e.shiftKey) {
          handleChatBoxStyle();
        }
      }
      function handleChatBoxStyle() {
        const value = message.value;
        const count = value ? value.split('\n').length : 0;
        chatBoxStyle.value = defaultPadding;
        if (count > 2 && count < 8) {
          chatBoxStyle.value += 20.5 * count;
        } else if (count >= 8) {
          chatBoxStyle.value += 20.5 * maxRows.value;
        }
      }
      function handleRemove(index) {
        chatList.value.splice(index, 1);
      }

      //Common
      function setLoading(status) {
        spinning.value = status;
      }

      //送出對話(後台使用者送出的)
      function handleSubmit(value, source) {
        if (value && value !== '\n') {
          const datetime = dayjs().format('YYYY/MM/DD HH:mm:ss');

          // 接收對象
          const info = props.userInfo;

          /* 傳送格式
      {
        "content": "hello!", //傳送訊息內容
        "receiveUserId":"404",//傳送訊息給誰 → 接收訊息的人 'cs'客服
        "receiveUserAccount":"ceos205023",//傳送訊息給誰(登入帳號)
        "userId": "396", //員工或客戶的userId → 發送訊息的人 
        "userAccount": "ceos205010", //員工或客戶的登入帳號 
        "type": "cs", //聊天類型：(1)直播live(2)客服cs
        "role":"employee" //角色:(1)員工employee(2)客戶customer → 發送訊息的角色
        "createTime":"2022/12/12 11:22:33" //資料庫的時間，再由前端轉成使用者的當地時間
        }
      */

          let model = {
            source: source,
            icon: source === 'icon' ? value : null,
            message: source === 'message' ? value : null,
            datetime: datetime,
          };

          //送出對話
          if (model.message) {
            setLoading(true);

            let data = {
              userId: myInfo.userId,
              userAccount: myInfo.username,
              type: 'cs',
              icon: source === 'icon' ? value : null,
              content: model.message,
              createTime: datetime,
              receiveUserId: info.userId,
              receiveUserAccount: info.jobId,
              role: 'employee',
            };
            // 原tg talk
            // createTGTalks(data)
            //   .then(() => {
            //     chatList.value.push(model);
            //     emit('refresh-row', model);
            //   })
            //   .finally(() => {
            //     //跳至指定位置
            //     const anchorId = `#row_${chatList.value.length - 1}`;
            //     goBottomAnchor(anchorId);
            //     setLoading(false);
            //   });

            doPublish({
              topic: `system/${info.userId}`,
              qos: '1',
              payload: JSON.stringify(data),
            });
            setTimeout(() => {
              chatList.value.push(model);
              emit('refresh-row', model);
              const anchorId = `#row_${chatList.value.length - 1}`;
              goBottomAnchor(anchorId);
              setLoading(false);
            }, 300);
          } else {
            chatList.value.push(model);
            //跳至指定位置
            const anchorId = `#row_${chatList.value.length - 1}`;
            goBottomAnchor(anchorId);
          }
        }
      }

      //新增推送訊息(朋友推送過來的)
      function pushUnreadMsg(item) {
        const fromTGId = parseInt(item.fromTGId);
        const toTGId = parseInt(item.toTGId);
        const friendId = parseInt(props.userInfo.friendId);
        const tgId = parseInt(props.userInfo.tgId);
        if (fromTGId === friendId && toTGId == tgId) {
          const model = {
            id: item.id,
            source: 'other',
            message: item.content,
            files: [],
            datetime: dayjs(item.createAt).format('YYYY/MM/DD HH:mm:ss'),
            isSeach: false,
          };
          chatList.value.push(model);
          nextTick(() => {
            //跳至指定位置
            const anchorId = `#row_${chatList.value.length - 1}`;
            goBottomAnchor(anchorId);
          });
        }
      }

      const handleScroll = function () {
        const element: any = document.getElementById('chatBox');
        const total = element.scrollHeight - element.clientHeight - 4;
        const scrollTop = element.scrollTop;
        if (scrollTop < total) {
          showGoBottomIcon(true);
        } else {
          showGoBottomIcon(false);
        }
      };

      //重新刷新資料(通訊查詢用)
      function reload(res, info, keyword) {
        setLoading(true);
        chatList.value = getChatData(res, info);

        //移除scroll監聽事件
        removeListener();

        setTimeout(() => {
          //初始化
          chatBoxStyle.value = 0;
          isShowGoBottomIcon.value = false;
          watchScroll();
          let anchorId = '';

          for (let i = 0; i < chatList.value.length; i++) {
            let element = chatList.value[i];

            if (keyword) {
              //訊息
              if (element.message && element.message == keyword) {
                element.isSeach = true;
                anchorId = `#row_${i}`;
              }

              //檔案
              for (let y = 0; y < element.files.length; y++) {
                const file = element.files[y];
                if (file.name && file.name.indexOf(keyword) > -1) {
                  element.isSeach = true;
                  anchorId = `#row_${i}`;
                }
              }
            }
          }

          //跳至指定位置
          if (chatList.value.length > 0) {
            goCenterAnchor(anchorId);
          }
          setLoading(false);
        }, 300);
      }

      // function getValue(replaceValue) {
      //   let value = '';
      //   for (let index = 0; index < replaceValue.length; index++) {
      //     value += '*';
      //   }
      //   return value;
      // }

      // 接收訊息
      function handleMQTTMsg(data) {
        if (Number(data.userId) == props.userInfo.userId) {
          const icon = data.icon;
          const content = data.content;
          if (icon || (content && content !== '\n')) {
            // let replaceValue = realName.substring(2, realName.length - 1);
            let model = {
              userId: data.userId,
              name: data.userAccount,
              icon: icon ? icon : null,
              message: data.content ? data.content : null,
              source: 'other',
            };
            chatList.value.push(model);

            //跳至指定位置
            setTimeout(() => {
              const anchorId = `#row_${chatList.value.length - 1}`;
              goBottomAnchor(anchorId);
            }, 300);
          }
          setLoading(false);
        } else {
          const anchorId = `#row_${chatList.value.length - 1}`;
          goBottomAnchor(anchorId);
          setLoading(false);
        }
      }

      watch(
        () => CSChatState.count,
        () => {
          const data = CSChatState.getPushMsg();
          handleMQTTMsg(data);
        },
      );

      /*=========data=========*/
      return {
        t,
        spinning,

        //Chat List
        chatList,
        nowPosition,
        isShowGoBottomIcon,
        chatBoxStyle,
        loadData,
        goBottomAnchor,
        goCenterAnchor,
        handleRemove,
        setLoading,
        isShowRemove,

        //將emoji放入對話框input
        putEmojiMessage,

        //Send Message
        message,
        otherValue,
        maxRows,
        submitMessage,
        handleKeydown,
        handleKeyup,
        handleSubmit,
        pushUnreadMsg,

        //common
        reload,

        handleMQTTMsg,
      };
    },
  });
</script>
