import { reactive, ref, h, unref, watchEffect } from 'vue';
import * as mqtt from 'mqtt/dist/mqtt.min';
import { useMessage } from '/@/hooks/web/useMessage';
import { formatToDateTime, formatToDateTimewithoutSpace } from '/@/utils/dateUtil';
import { useAppStore } from '/@/store/modules/app';
import { useUserStore } from '/@/store/modules/user';
import { Button } from 'ant-design-vue';
import { SmileOutlined } from '@ant-design/icons-vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useCountdown } from '/@/utils/time/useCountdown';
import { useChart } from '../store/modules/page/MQTTChat';
import { useCSChart } from '../store/modules/page/csChat';
const { notification, createErrorModal } = useMessage();

//const MQTTStore = useMQTTStore();
//清出重置 登出
function handleClearAndRedo() {
  localStorage.clear();
  useAppStore().resetAllState();
  useUserStore().resetState();
  location.reload();
}
const connection: any = reactive({
  host: '61.216.105.51', //61.216.105.51 | ceos.business
  port: 8083, //8083 | 8084
  endpoint: '/mqtt',
  clean: true, // 保留会话
  connectTimeout: 4000, // 超时时间
  reconnectPeriod: 4000, // 重连时间间隔
  url: 'ws', //ws | wss
  // 认证信息
  username: 'admin',
  password: 'public',
});

const receiveNews = ref('');

const client: any = ref();
const subscribeSuccess = ref(false);
const { currentCount: currentCount5s, start: start5s } = useCountdown(5); //倒數計時器:60秒

watchEffect(() => {
  //---*60秒倒數停止，自動登出
  if (unref(currentCount5s) === 1) {
    handleClearAndRedo();
  }
});

// 建立連接
export function createConnection(userId) {
  const { t } = useI18n();

  const { host, port, url, endpoint, ...options } = connection;
  const clientId = `CEOS_${userId}_${formatToDateTimewithoutSpace(new Date().getTime())}`; //客戶端Id
  options['clientId'] = clientId;
  const connectUrl = `${url}://${host}:${port}${endpoint}`;
  try {
    client.value = mqtt.connect(connectUrl, options);
  } catch (error) {
    console.log('mqtt.connect error', error);
  }
  client.value.on('connect', () => {
    console.log(`${connectUrl} 連接成功!  ${formatToDateTime(new Date().getTime())}`);
  });
  client.value.on('error', (error) => {
    console.log(`${connectUrl} 連接失敗!`, error);
  });

  //接收到訊息後做的事情

  client.value.on('message', (topic, message) => {
    console.log(`接收訊息 ${message} from topic ${topic}`);

    receiveNews.value = receiveNews.value.concat(message);
    const payload = message.toString();
    const chatState = useChart(); //直播聊天室Store
    const CSChatState = useCSChart(); //客服聊天室Store
    const data = JSON.parse(message.toString());
    if (data.type == 'cs') {
      //更新客服聊天室
      CSChatState.fetchPushMsg(data);
    }
    //聊天室推播訊息
    if (payload && payload.indexOf('content') > -1 && payload.indexOf('userId') > -1) {
      const data = JSON.parse(message.toString());
      /*
      {
        "content": "hello!", //傳送訊息內容
        "receiveUserId":"404",//傳送訊息給誰 → 接收訊息的人
        "receiveUserAccount":"ceos205023",//傳送訊息給誰(登入帳號)
        "userId": "396", //員工或客戶的userId → 發送訊息的人 
        "userAccount": "ceos205010", //員工或客戶的登入帳號 
        "type": "cs", //聊天類型：(1)直播live(2)客服cs
        "role":"employee" //角色:(1)員工employee(2)客戶customer → 發送訊息的角色
        "createTime":"2022/12/12 11:22:33" //資料庫的時間，再由前端轉成使用者的當地時間
        }
      */
      if (data.type == 'live') {
        //更新直播聊天室
        chatState.fetchPushMsg(data);
      }
      // else if (data.type == 'cs') {
      //   //更新客服聊天室
      //   CSChatState.fetchPushMsg(data);
      // }
      console.log(data);
    } else if (topic === `system/${userId}`) {
      if (message == 'ban') {
        start5s();
        //帳號停用，強制登出
        createErrorModal({
          title: () => h('span', t('sys.login.accountDeactivated')),
          content: () =>
            h('p', { class: 'mb-1' }, t('sys.login.sessionTimeoutMsg', [unref(currentCount5s)])),
          centered: true,
        });
      } else {
        notification.success({ message: `訊息 ${message}` });
      }
    } else if (topic === `system/updateWebsite`) {
      notification.open({
        message: t('sys.app.updateWebsite'),
        description: t('sys.app.updateWebsiteMsg'),
        icon: () => h(SmileOutlined, { style: 'color: #556ff6' }),
        placement: 'bottomRight',
        duration: 0,
        btn: () =>
          h(
            Button,
            {
              class: 'custom-btn-blue custom-size-small',
              onClick: () => {
                console.log('xxx立即更新1');
                notification.close(userId);
                location.reload();
              },
            },
            { default: () => t('common.redo') },
          ),
        key: userId,
        onClose: close,
      });
    }
  });
}
//訂閱主題
export async function doSubscribe() {
  const subscription: any = reactive({
    topic: `system/+`,
    qos: 1,
  });
  const { topic, qos } = subscription;
  client.value.subscribe(topic, { qos }, (error, res) => {
    if (error) {
      console.log('訂閱失敗', error);
      return;
    }
    subscribeSuccess.value = true;
    console.log('訂閱成功', res);
  });
}
//取消訂閱
// function doUnSubscribe() {
//   const { topic } = subscription;
//   client.value.unsubscribe(topic, (error) => {
//     if (error) {
//       console.log('Unsubscribe error', error);
//     }
//   });
// }
//發布消息
export function doPublish(data) {
  const { topic, qos, payload } = data;
  client.value.publish(
    topic,
    payload,
    qos,
    (error) => {
      if (error) {
        console.log('Publish error', error);
      }
    },
    false,
  );
}
//斷開連接
// function destroyConnection() {
//   if (client.value.connected) {
//     try {
//       client.value.end();
//       client.value = {
//         connected: false,
//       };
//       console.log('Successfully disconnected!');
//     } catch (error) {
//       console.log('Disconnect failed', error.toString());
//     }
//   }
// }
