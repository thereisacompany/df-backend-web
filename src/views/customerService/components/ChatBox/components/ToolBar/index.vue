<template>
  <div class="emoji-area" @mouseleave="openEmojiArea(false)">
    <!-- 上傳檔案 -->
    <!--<div class="my-icon" :key="basicUploadKey">
      <BasicUpload
        :maxSize="uploadData.maxSize"
        :maxNumber="uploadData.maxNumber"
        :api="uploadData.api"
        :isCustomUploadButton="true"
        :isShowViewButton="false"
        :isCompleteClose="true"
        @upload-complete="handleFilesComplete"
      >
        <template #CustomButton><Icon icon="el:paper-clip" color="#888888" :size="24" /></template>
      </BasicUpload>
    </div> -->

    <!-- 表情貼圖 -->
    <div class="my-icon icon-tag" @mouseover="openEmojiArea(true)">
      <Icon icon="fa:smile-o" color="#888888" :size="24" />
    </div>
    <EmojiPicker
      v-show="showEmojiArea"
      :native="true"
      :display-recent="false"
      :disable-skin-tones="true"
      @select="onSelectEmoji"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  // import { BasicUpload } from '/@/components/Upload';
  import { Icon } from '/@/components/Icon';
  import EmojiPicker from 'vue3-emoji-picker';
  import 'vue3-emoji-picker/css';

  import { getEmojis } from './data';
  // import { uploadDocFile, getUploadFilesUUID } from '/@/api/page/upload';

  export default defineComponent({
    components: {
      EmojiPicker,
      // BasicUpload,
      Icon,
    },
    emits: ['handle-submit'],
    setup(_, { emit }) {
      /*=========values=========*/
      //ToolBar
      const emojiList = ref<any>(getEmojis());

      //File
      // const basicUploadKey = ref<any>(0);
      // const uploadData = reactive<any>({
      //   maxSize: 10, //单个文件最大体积，单位 M
      //   maxNumber: 5, //最大上传数量，Infinity 则不限制
      //   api: uploadDocFiles,
      // });
      // const uuidList = ref<any>([]);

      //表情貼圖
      const showEmojiArea = ref(false);

      /*=========function=========*/
      //ToolBar
      function onSelectEmoji(emoji) {
        emit('handle-submit', emoji.i, 'myself', 'icon');
      }

      //表情貼圖
      function openEmojiArea(flag) {
        showEmojiArea.value = flag;
      }

      //File
      function handleFilesComplete() {
        // basicUploadKey.value += 1;
        // getFiles(uuidList.value);
      }
      // function getFiles(uuids) {
      //   getUploadFilesUUID(uuids)
      //     .then((res) => {
      //       let files: any = [];
      //       if (res.result.length > 0) {
      //         const data = res.result;
      //         data.forEach((item, index) => {
      //           const model = {
      //             uid: item.uuid,
      //             name: item.fileName,
      //             status: 'done',
      //             url: item.path,
      //           };
      //           files.push(model);
      //           if (index === data.length - 1) {
      //             emit('handle-submit', files, 'myself', 'file');
      //           }
      //         });
      //       }
      //     })
      //     .finally(() => {
      //       uuidList.value = []; //初始化
      //     });
      // }
      // async function uploadDocFiles(row) {
      //   const model = {
      //     file: row.file,
      //     filename: row.file.name,
      //     name: 'file',
      //   };
      //   const res = await uploadDocFile('hr', model);
      //   const uuid = res.data.result.length > 0 ? res.data.result[0] : '';
      //   if (uuid) uuidList.value.push(`uuids=${uuid}`);
      //   return res;
      // }

      /*=========data=========*/
      return {
        //ToolBar
        emojiList,
        onSelectEmoji,

        //File
        // basicUploadKey,
        // uploadData,
        handleFilesComplete,

        //表情貼圖
        showEmojiArea,
        openEmojiArea,
      };
    },
  });
</script>

<style scoped lang="less">
  :deep(.v3-emoji-picker) {
    position: absolute;
    bottom: 32px;
    left: -10px;
    z-index: 5;
  }
</style>
