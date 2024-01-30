<!-- 預覽檔案 -->
<template>
  <div v-if="chatList[index].files.length > 0">
    <a-upload
      class="message-image"
      list-type="picture-card"
      :file-list="chatList[index].files"
      @preview="handlePreview"
      @remove="handleRemove"
      :showUploadList="{
        showDownloadIcon: true,
        showViewIcon: true,
        showRemoveIcon: true,
      }"
    />
    <a-modal :visible="preview.vsible" title="預覽檔案" @cancel="preview.vsible = false">
      <div class="p-4">
        <div class="text-lg font-bold text-center pb-3">檔案名稱：{{ preview.title }}</div>
        <div v-if="preview.isImg">
          <img style="width: auto; margin: 0 auto; max-width: 100%" :src="preview.fileUrl" />
        </div>
        <div class="text-center pt-3">
          <a-button type="primary" @click="handleDownloadByUrl">
            {{ preview.isImg ? '圖片下載' : '檔案下載' }}
          </a-button>
        </div>
      </div>
      <template #footer>
        <a-button @click="preview.vsible = false">關閉</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { Upload, UploadProps, Modal } from 'ant-design-vue';
  import { checkIsImg } from '/@/utils/file/check';
  import { downloadByUrl } from '/@/utils/file/download';
  import { cloneDeep } from 'lodash-es';
  import XEUtils from 'xe-utils';
  export default defineComponent({
    components: {
      AUpload: Upload,
      AModal: Modal,
    },
    props: {
      chatList: { type: Array },
      index: { type: Number },
    },
    emits: ['handle-remove-file', 'update:chatList'],
    setup(props, { emit }) {
      /*=========values=========*/
      const preview = reactive<any>({ vsible: false, fileUrl: '', title: '', isImg: false });

      /*=========function=========*/
      async function handlePreview(file: UploadProps['fileList'][number]) {
        if (!file.url && !file.preview) {
          file.preview = (await getBase64(file.originFileObj)) as string;
        }
        preview.fileUrl = file.url || file.preview;
        preview.title = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
        preview.vsible = true;
        preview.isImg = checkIsImg(preview.fileUrl);
      }
      function handleDownloadByUrl() {
        downloadByUrl({ url: preview.fileUrl, target: '_blank' });
      }
      function handleRemove(file: UploadProps['fileList'][number]) {
        let list = cloneDeep(props.chatList);
        let fileList = list[props.index].files;
        if (fileList.length > 0) {
          const removeIndex = XEUtils.findIndexOf(fileList, (item) => item.url === file.url);
          if (removeIndex > -1) {
            fileList.splice(removeIndex, 1);

            if (fileList.length === 0) {
              list.splice(props.index, 1);
            }
          }
        }
        emit('update:chatList', list);
        return false;
      }

      /*=========data=========*/
      return {
        preview,
        handlePreview,
        handleRemove,
        handleDownloadByUrl,
      };
    },
  });

  function getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
</script>
