<template>
  <a-upload
    v-model:file-list="fileList"
    :list-type="listType"
    @preview="handlePreview"
    :multiple="multiple"
    :max-count="maxNumber"
    :before-upload="beforeUpload"
    :disabled="!allowUpload"
    @remove="handleRemove"
  >
    <div v-if="fileList.length < maxNumber && allowUpload">
      <div v-if="listType === 'picture-card'">
        <plus-outlined />
        <div style="margin-top: 8px">{{ t('component.upload.imgUpload') }}</div>
      </div>
      <a-button v-else>
        <upload-outlined />
        upload
      </a-button>
    </div>
  </a-upload>
  <span v-if="fileList.length < maxNumber && allowUpload">{{
    t('component.upload.maxSize', [maxSize]) +
    t('component.upload.fileUploadNumberLimit', [maxNumber])
  }}</span>
  <Image
    :src="previewImage"
    :width="104"
    :style="{ display: 'none' }"
    :fallback="imageFallBack"
    :preview="{
      visible,
      onVisibleChange: handleCancel,
    }"
  />
</template>
<script lang="ts">
  import {
    defineComponent,
    ref,
    PropType,
    nextTick,
    watch,
    onMounted,
    h,
    unref,
    computed,
  } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Upload, UploadProps, Modal, Image } from 'ant-design-vue';

  import { useMessage } from '/@/hooks/web/useMessage';
  //import { useAssetStore } from '/@/store/modules/page/asset';

  import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
  import { FileItem, UploadResultStatus } from './typing';
  import { isFunction } from '/@/utils/is';
  import { warn } from '/@/utils/log';
  import { DeleteTwoTone } from '@ant-design/icons-vue';

  import { useAppStore } from '/@/store/modules/app';

  //import UploadModal from './components/UploadModal.vue';
  //import { omit } from 'lodash-es';

  function getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  export default defineComponent({
    components: {
      [Upload.name]: Upload,
      [Modal.name]: Modal,
      PlusOutlined,
      Image,
      //UploadModal,
      UploadOutlined,
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
        default: 5,
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
      },
      imgFileList: {
        type: Object as PropType<any>,
      },
      func: { type: String as PropType<String> },
      fileType: {
        type: Array as PropType<string[]>,
        default: () => [],
      }, //可上傳的檔案類型，
      listType: { type: String as PropType<String>, default: 'picture-card' },
    },
    setup(props) {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();
      const imageFallBack = useAppStore().getImageFallBack;
      //Upload Image
      const isUploadingRef = ref(false);
      const previewVisible = ref(false);
      const previewImage = ref('');
      const previewTitle = ref('');

      const fileList = ref<FileItem[]>([]);
      const visible = ref<boolean>(false);

      const handleCancel = (value): void => {
        visible.value = value;
        previewVisible.value = false;
        previewTitle.value = '';
      };

      const handlePreview = async (file: UploadProps['fileList'][number]) => {
        if (!file.url && !file.preview) {
          file.preview = (await getBase64(file.originFileObj)) as string;
        }
        visible.value = true;
        previewImage.value = file.url || file.preview;
        previewVisible.value = true;
        previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
      };

      const beforeUpload: UploadProps['beforeUpload'] = (file: File) => {
        console.log('上傳檔案', file);

        // const { size, name } = file;
        const { maxSize, fileType } = props;
        if (fileType.length > 0) {
          const getStringAccept = computed(() => {
            return unref(fileType)
              .map((item) => {
                if (item.indexOf('/') > 0 || item.startsWith('.')) {
                  return item;
                } else {
                  return `${item}`;
                }
              })
              .join(',');
          });

          if (!getStringAccept.value.includes(file.type)) {
            createMessage.error(t('component.upload.fileFormatError'));
            return Upload.LIST_IGNORE;
          }
        }
        const isLtFileSize = maxSize && file.size / 1024 / 1024 >= maxSize;
        if (isLtFileSize) {
          createMessage.error(`${file.name} ${t('component.upload.maxSizeOver', [maxSize])}`);
          return Upload.LIST_IGNORE;
        }

        return false;
      };

      const handleRemove = async (file: UploadProps['fileList'][number]) => {
        return new Promise((resolve) => {
          createConfirm({
            iconType: 'error',
            icon: h(DeleteTwoTone, { twoToneColor: '#e74242' }),
            title: t('common.delete') + ' ' + t('component.upload.image'),
            autoFocusButton: null,
            content: h('div', { class: 'm-5 text-center' }, [
              h(Image, {
                src: `${file.thumbUrl}`,
                width: '200px',
              }),
            ]),
            okType: 'danger',
            okText: t('common.okText'),
            cancelText: t('common.cancelText'),
            async onOk() {
              if (file.status == UploadResultStatus.SUCCESS) {
                //await props.delApi?.(apiId.value, file.name);
                //---*刪除檔案的api
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
        const { api } = props;

        if (!api || !isFunction(api)) {
          return warn('upload api must exist and be a function');
        }
        try {
          item.status = UploadResultStatus.UPLOADING;

          await props.api?.(props.func, {
            file: item.originFileObj,
            name: 'file',
            filename: item.name,
          });

          item.status = UploadResultStatus.SUCCESS;

          return {
            success: true,
            error: null,
          };
        } catch (e) {
          item.status = UploadResultStatus.ERROR;
          return {
            success: false,
            error: e,
          };
        }
      }

      const handleStartUpload = async () => {
        if (fileList.value.length == 0) return false;
        const uploadFileList: any = ref([]);

        fileList.value.forEach((item) => {
          //移除檔名中間的空白
          item.name = item.name.replace(/\s*/g, '');
        });

        uploadFileList.value =
          fileList.value.filter((item) => item.status !== UploadResultStatus.SUCCESS) || [];

        for (let i = 0; i < uploadFileList.value.length; ++i) {
          await uploadApiByItem(uploadFileList.value[i]);
        }
      };

      //將從api得到的網址，放依序放入上傳元件的資料格式
      const res = ref([]);
      const pushImgArray = () => {
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
            tag: res.value[element].memo1,
            type: res.value[element].fileName ? res.value[element].type : 'missing',
            apiReturnGuid: res.value[element].apiReturnGuid,
          });
        });
      };

      const convertToImgList = () => {
        if (props.imgFileList) {
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
          convertToImgList();
        },
      );

      watch(
        () => props.allowUpload,
        () => {
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

      return {
        t,

        previewVisible,
        previewImage,

        fileList,
        handleCancel,
        handlePreview,
        handleRemove,
        previewTitle,
        beforeUpload,
        handleStartUpload,
        //handleChange,
        isUploadingRef,

        visible,
        imageFallBack,
      };
    },
  });
</script>
