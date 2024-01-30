<template>
  <a-upload
    v-model:file-list="fileList"
    list-type="picture-card"
    class="upload-list-inline"
    :multiple="multiple"
    :max-count="maxNumber"
    :before-upload="beforeUpload"
    :disabled="!allowUpload"
    @remove="handleRemove"
    :capture="null"
  >
    <div v-if="fileList.length < maxNumber && allowUpload" class="2xl:mt-0 mt-3">
      <div v-if="!useCustomButton" class="md:flex grid">
        <a-button @click="clickUploadBtn">
          <upload-outlined />
          {{ t('component.upload.choose') }}
        </a-button>
        <span class="ml-5 md:mt-0 mt-2 items-center">{{
          t('component.upload.maxSize', [maxSize]) +
          t('component.upload.fileUploadNumberLimit', [maxNumber])
        }}</span>
      </div>

      <slot v-else name="CustomButton"></slot>
    </div>

    <template #itemRender="{ file, actions }">
      file/{{ file }}
      <div
        class="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture"
        :class="{ 'missing-file': file.status == 'error' }"
      >
        <div class="ant-upload-list-item-info">
          <span class="ant-upload-span">
            <Image
              v-if="['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)"
              :src="file.thumbUrl"
              :width="50"
              :height="50"
              style="width: 100%; height: 100%"
              :fallback="imageFallBack"
              class="ant-upload-list-item-image"
            />
            <span v-else class="anticon anticon-file">
              <Icon
                :icon="setIcon(file.type)"
                style="font-size: 32px"
                :color="file.status == 'error' ? '#e34d59' : '#85a2ff'"
            /></span>

            <a
              v-if="['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)"
              target="_blank"
              rel="noopener noreferrer"
              class="ant-upload-list-item-name"
              style="line-height: 20px"
              :title="file.name"
              @click="setPreView(true, file.thumbUrl)"
            >
              {{ file.name }}
            </a>
            <a
              v-else
              target="_blank"
              rel="noopener noreferrer"
              class="ant-upload-list-item-name"
              :title="file.name"
              style="line-height: 20px"
              @click="actions.download"
            >
              {{ file.name }}
            </a>

            <span class="ant-upload-list-item-card-actions picture" v-if="file.status != 'error'">
              <a v-if="allowUpload" href="javascript:;" @click="actions.remove">
                <DeleteOutlined />
              </a>
            </span>
          </span>
        </div>

        <Image
          :src="previewImage"
          :fallback="imageFallBack"
          class="ant-upload-list-item-image"
          :preview="{
            visible,
            onVisibleChange: setVisible,
          }"
          :style="{ display: 'none' }"
        />
      </div>
    </template>
  </a-upload>
</template>
<script lang="ts">
  import { defineComponent, ref, PropType, nextTick, watch, onMounted, h } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Upload, UploadProps, Image } from 'ant-design-vue';

  import { useMessage } from '/@/hooks/web/useMessage';
  //import { useAssetStore } from '/@/store/modules/page/asset';
  import Icon from '/@/components/Icon';
  import { UploadOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { FileItem, UploadResultStatus } from './typing';
  import { isFunction } from '/@/utils/is';
  import { warn } from '/@/utils/log';

  import { useAppStore } from '/@/store/modules/app';

  import { DeleteTwoTone } from '@ant-design/icons-vue';
  import { checkImgType, getBase64WithFile } from './helper';

  export default defineComponent({
    components: {
      [Upload.name]: Upload,
      UploadOutlined,
      Image,
      DeleteOutlined,
      Icon,
    },
    props: {
      multiple: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
      maxNumber: {
        type: Number as PropType<number>,
        default: Infinity,
      },
      maxSize: {
        type: Number as PropType<number>,
        default: 2,
      },
      api: {
        type: Function as PropType<PromiseFn>,
        default: null,
      },
      delApi: {
        type: Function as PropType<PromiseFn>,
        default: null,
      },
      uploadParams: {
        type: Object as PropType<any>,
      },

      allowUpload: {
        type: Boolean as PropType<boolean>,
        default: true,
      }, //是否開放上傳
      imgFileList: {
        type: Object as PropType<any>,
      },
      func: { type: String as PropType<String> },
      useCustomButton: {
        type: Boolean as PropType<boolean>,
        default: false,
      }, //自訂義上傳附件按按鈕
    },
    emits: ['sendDeleteFile'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();
      const imageFallBack = useAppStore().getImageFallBack;
      //Upload Image
      const isUploadingRef = ref(false);
      const previewVisible = ref(false);
      const previewImage = ref('');
      const previewTitle = ref('');

      //const fileList = ref<UploadProps['fileList']>([]);
      const fileList = ref<FileItem[]>([]);
      const visible = ref<boolean>(false);

      const setPreView = (value, img) => {
        console.log('* setPreView');
        previewImage.value = img;
        setVisible(value);
      };
      const setVisible = (value) => {
        console.log('* setVisible');
        visible.value = value;
      };

      const handleCancel = (value): void => {
        console.log('* handleCancel');
        visible.value = value;
        previewVisible.value = false;
        previewTitle.value = '';
      };

      const beforeUpload: UploadProps['beforeUpload'] = async (file: File) => {
        console.log('* beforeUpload', file);
        const { maxSize } = props;
        const isLt20M = maxSize && file.size / 1024 / 1024 >= maxSize;
        if (isLt20M) {
          createMessage.error(`${file.name} ${t('component.upload.maxSizeOver', [maxSize])}`);
          return Upload.LIST_IGNORE;
        }
        const duplicateFileName = fileList.value.filter((item) => item.name == file.name);
        if (duplicateFileName.length != 0) {
          createMessage.error(`${file.name} ${t('component.upload.duplicateFileName')}`);
          return Upload.LIST_IGNORE;
        }
        //縮圖
        const imgUrl: any = ref('');
        if (checkImgType(file)) {
          imgUrl.value = getBase64WithFile(file).then(({ result: thumbUrl }) => {
            return thumbUrl;
          });
        }
        file['thumbUrl'] = await imgUrl.value;
        return false;
      };

      const handleRemove = async (file: UploadProps['fileList'][number]) => {
        console.log('* handleRemove');
        return new Promise((resolve) => {
          createConfirm({
            iconType: 'error',
            icon: h(DeleteTwoTone, { twoToneColor: '#e74242' }),
            title: t('common.delete') + ' ' + t('component.upload.file'),
            autoFocusButton: null,
            content: `${t('component.upload.fileName')}: ${file.name}`,
            okType: 'danger',
            okText: t('common.okText'),
            cancelText: t('common.cancelText'),
            async onOk() {
              if (file.status == UploadResultStatus.SUCCESS) {
                emit('sendDeleteFile', file);
              }
              resolve(true);
            },
            onCancel() {
              resolve(false);
            },
          });
        });
      };

      async function uploadApiByItem(item: UploadProps['fileList'][number]) {
        console.log('* uploadApiByItem');
        const { api } = props;

        if (!api || !isFunction(api)) {
          return warn('upload api must exist and be a function');
        }
        try {
          item.status = UploadResultStatus.UPLOADING;
          console.log('* originFileObj', item.originFileObj);
          const res = await props.api?.({
            file: item.originFileObj,
            name: 'file',
            filename: item.name,
          });

          item.status = UploadResultStatus.SUCCESS;

          return res;
        } catch (e) {
          item.status = UploadResultStatus.ERROR;
          return {
            success: false,
            error: e,
          };
        }
      }

      const handleStartUpload = async () => {
        console.log('* handleStartUpload');
        console.log('* 檔案清單', fileList.value);
        let uploadRes = {};
        if (fileList.value.length == 0) return false;
        fileList.value.forEach((item) => {
          //移除檔名中間的空白
          item.name = `${item.name.replace(/\s*/g, '')}`;
        });

        const uploadFileList =
          fileList.value.filter((item) => item.status !== UploadResultStatus.SUCCESS) || [];
        console.log('* uploadFileList', uploadFileList);
        for (let i = 0; i < uploadFileList.length; ++i) {
          await uploadApiByItem(uploadFileList[i]).then((res) => {
            console.log('* res', res);
            uploadRes = res;
          });
        }

        return uploadRes['data'];
      };

      //將從api得到的網址，放依序放入上傳元件的資料格式
      const res = ref([]);
      const pushImgArray = () => {
        console.log('* pushImgArray', res.value);
        const objKey = Object.keys(res.value).sort();
        objKey.forEach(async (element) => {
          fileList.value.push({
            uuid: res.value[element].sort,
            name: res.value[element].fileName
              ? res.value[element].fileName
              : `Oops! ${t('component.upload.missingFile')}`,
            status: res.value[element].fileName
              ? UploadResultStatus.SUCCESS
              : UploadResultStatus.ERROR,
            url: res.value[element].fileUrl,
            thumbUrl: res.value[element].fileUrl,
            type: res.value[element].fileName ? res.value[element].type : 'missing',
            apiReturnGuid: res.value[element].apiReturnGuid,
          });
        });

        console.log('fileList', fileList.value);
      };

      const convertToImgList = () => {
        console.log('* convertToImgList');

        if (props.imgFileList) {
          console.log('* convertToImgList 2', props.imgFileList);
          res.value = props.imgFileList;

          pushImgArray();
        }
      };

      onMounted(async () => {
        convertToImgList();
      });

      watch(
        () => props.imgFileList,
        () => {
          fileList.value = [];
          console.log('* watch-props.imgFileList');
          if (props.imgFileList) {
            convertToImgList();
          }
        },
      );

      watch(
        () => props.allowUpload,
        () => {
          console.log('* watch-props.allowUpload');
          if (!props.allowUpload) {
            nextTick(() => {
              fileList.value = [];
              if (res.value) {
                convertToImgList();
              }

              return true;
            });
          }
        },
      );

      const trigger = ref(false);
      const clickUploadBtn = () => {
        trigger.value = !trigger.value;
      };

      const setIcon = (type: string) => {
        switch (type) {
          case 'application/msword':
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'ant-design:file-word-outlined';
          case 'application/pdf':
            return 'ant-design:file-pdf-outlined';
          case 'application/vnd.ms-powerpoint':
          case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return 'ant-design:file-ppt-outlined';
          case 'application/zip':
          case 'application/x-zip-compressed':
            return 'ant-design:file-zip-outlined';
          case 'missing':
            return 'ant-design:frown-filled';
          default:
            return 'ant-design:file-outlined';
        }
      };
      return {
        t,

        previewVisible,
        previewImage,

        fileList,
        handleCancel,

        handleRemove,
        previewTitle,
        beforeUpload,
        handleStartUpload,

        isUploadingRef,

        visible,
        imageFallBack,

        clickUploadBtn,
        setVisible,
        setIcon,
        setPreView,
      };
    },
  });
</script>
<style lang="less" scoped>
  /* tile uploaded pictures */
  .upload-list-inline :deep(.ant-upload-list-item) {
    float: left;
    width: 200px;
    margin-right: 8px;
  }

  .upload-list-inline [class*='-upload-list-rtl'] :deep(.ant-upload-list-item) {
    float: right;
  }

  .tag-box {
    float: left;
    width: 200px;
    margin-right: 8px;
  }

  .missing-file {
    border: 1px solid #f9d7d9 !important;

    a {
      color: #e34d59 !important;
      pointer-events: none;

      &:hover {
        color: #e34d59 !important;
      }
    }
  }
</style>
