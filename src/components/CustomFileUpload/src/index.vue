<template>
  <div class="relative" :class="coustomClass">
    <!-- upload -->
    <Upload
      v-model:file-list="files"
      action=""
      name="file"
      :accept="accept"
      :maxCount="maxCount"
      :list-type="getImgListType()"
      :class="[files.length == 0 ? 'upload-w-full' : 'upload-w-auto']"
      :before-upload="handleBeforeUpload"
      :disabled="disabled"
      @preview="handlePreview"
    >
      <div v-if="files.length < maxCount">
        <!-- input upload -->
        <div v-if="component == 'input'">
          <a-button style="width: 112px">
            {{ t('component.articleManagement.selectFile') }}
          </a-button>
          <div class="text-zinc-500 absolute">
            {{ t('component.upload.maxSize', [maxSize]) }}
            {{ t('component.upload.fileUploadNumberLimit', [maxCount]) }}
          </div>
        </div>

        <!-- full upload -->
        <div v-else-if="component == 'full'">
          <div><Icon icon="humbleicons:upload" size="70" color="#74788D" /></div>
          <div class="text-xl">
            {{ t('component.articleManagement.selectComputerFile') }}
          </div>
          <div class="text-zinc-500">
            {{ t('component.upload.maxSize', [maxSize]) }}
            {{ t('component.upload.fileUploadNumberLimit', [maxCount]) }}
          </div>
        </div>

        <!-- card upload -->
        <div v-else>
          <div>
            <Icon icon="ic:outline-plus" />
            <div style="margin-top: 8px">{{ t('component.upload.imgUpload') }}</div>
          </div>
        </div>
      </div>
    </Upload>

    <!-- card upload 提示訊息-->
    <div class="text-zinc-500" v-if="!coustomClass">
      {{ t('component.upload.maxSize', [maxSize]) }}
      {{ t('component.upload.fileUploadNumberLimit', [maxCount]) }}
    </div>

    <!-- view image -->
    <Image
      :src="preview.img"
      :fallback="errorImage"
      :style="{ display: 'none' }"
      :preview="{
        visible: preview.visible,
        onVisibleChange: (value) => {
          if (!value) preview.visible = value;
        },
      }"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, computed, reactive, watch, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { showMsg } from '/@/utils/globalTips';
  import { Icon } from '/@/components/Icon';
  import { Upload, Image } from 'ant-design-vue';
  import XEUtils from 'xe-utils';

  //api
  import { uploadArticleImage } from '/@/api/page/article/articleList'; //文章上傳檔案Api
  import { uploadCategoryImage } from '/@/api/page/article/articleCategory'; //文章類別上傳檔案Api

  import { uploadHistoryImage } from '/@/api/page/history/historyList'; //文章上傳檔案Api
  import { uploadHistoryCategoryImage } from '/@/api/page/history/historyCategory'; //文章類別上傳檔案Api

  //data
  import { checkImgType, getBase64WithFile, errorImage } from './data';

  export default defineComponent({
    components: { Icon, Upload, Image },
    props: {
      //檔案樣式
      component: {
        type: String as PropType<any>,
        default: 'input', //component= input || full || card
      },
      maxSize: { type: Number as PropType<number>, default: 2 }, //檔案大小(預設=2M)
      maxCount: { type: Number as PropType<any>, default: 1 }, //檔案數量(預設=上傳1個)
      fileList: { type: Array as PropType<any> }, //父層使用 => v-model:fileList="files"
      accept: { type: String as PropType<any> }, //接受上传的文件类型
      disabled: { type: Boolean as PropType<any>, default: false },
      apiName: { type: String as PropType<any> }, //article(文章) || articleCategory(分類)
    },
    emits: ['update:fileList'],
    setup(props, { emit }) {
      const { t } = useI18n();
      /*=========values=========*/
      const files = ref<any>([]);
      const preview = reactive({ img: '', visible: false });

      const coustomClass = computed(() => {
        switch (props.component) {
          case 'input':
            return 'input-upload';
          case 'full':
            return 'full-upload';
          default:
            return '';
        }
      });

      /*=========function=========*/
      //處理: 上傳檔案前事件
      const handleBeforeUpload = async (file: File) => {
        //防呆: 檔案大小
        const isLt20M = props.maxSize && file.size / 1024 / 1024 >= props.maxSize;
        // console.log(file.size / 1024 / 1024);
        // console.log(props.maxSize);
        if (isLt20M) {
          showMsg('error', `${file.name} ${t('component.upload.maxSizeOver', [props.maxSize])}`);
          return Upload.LIST_IGNORE;
        }

        //防呆: 相同檔名
        const sameArray = XEUtils.filter(files.value, (item) => item.name == file.name);
        if (sameArray.length != 0) {
          showMsg('error', `${file.name} ${t('component.upload.duplicateFileName')}`);
          return Upload.LIST_IGNORE;
        }

        //顯示: 縮圖
        const imgUrl: any = ref('');
        if (checkImgType(file)) {
          const data = await getBase64WithFile(file);
          imgUrl.value = data.result;
        }
        file['thumbUrl'] = await imgUrl.value;

        return false;
      };

      //處理: 預覽圖片
      const handlePreview = async (file) => {
        preview.img = file.thumbUrl;
        preview.visible = true;
      };

      //處理: 圖片組件類型
      const getImgListType = () => {
        switch (props.component) {
          case 'full':
          case 'card':
            return 'picture-card';
          default:
            return 'text';
        }
      };

      //處理: 上傳檔案(會回傳檔案data => { thumbUrl: '圖片url', name: '檔案名稱' })
      const handleSave = async (images: Array<{ thumbUrl: '圖片url'; name: '檔案名稱' }>) => {
        return new Promise((resolve) => {
          if (!props.apiName) {
            showMsg('error', '請加入upload api名稱');
            throw '請加入upload api名稱';
          }

          //若沒有檔案要上傳，回傳空陣列
          if (images.length === 0) {
            resolve([]);
            return;
          }

          try {
            let result: any = [];

            //取得要上傳的檔案
            // const trueUpload = images.filter(
            //   (item) => {
            //     if (item.thumbUrl && item.thumbUrl.indexOf('http')) return -1;
            //     if (item.thumbUrl && item.thumbUrl.indexOf('https')) return -1;
            //   },
            //   // console.log(item.thumbUrl)
            //   //   item.thumbUrl &&
            //   //   (item.thumbUrl.indexOf('http') || item.thumbUrl.indexOf('https')) == -1,
            // );
            // 取得要上傳的檔案
            const trueUpload = images.filter(
              (item) =>
                item.thumbUrl &&
                ['http', 'https'].every((protocol) => item.thumbUrl.indexOf(protocol) === -1),
            );

            // 取得要上傳的檔案
            // 取得要上傳的檔案
            // const trueUpload = images.filter(
            //   (item) =>
            //     item.thumbUrl &&
            //     (item.thumbUrl.indexOf('https') === -1 || item.thumbUrl.indexOf('http') === -1),
            // );

            // trueUpload.length = 0;
            console.log(trueUpload.length);
            //返回原始檔案(若沒有要上傳的)
            if (trueUpload.length === 0) {
              result = images.map((item) => {
                return { thumbUrl: item.thumbUrl, name: item.name };
              });
              resolve(result);
              return;
            }

            //true upload
            trueUpload.forEach(async (item: any, index) => {
              const data = { file: item.originFileObj, filename: item.name, name: 'file' };

              //upload api
              let res: any = await getUplodaData(data);

              //response
              if (res.status == 200) {
                //上傳成功
                result.push({ thumbUrl: res.data, name: data.filename });
              } else {
                //上傳失敗
                showMsg('error', t('component.upload.uploadError'));
                throw t('component.upload.uploadError');
              }
              if (trueUpload.length == index + 1) resolve(result);
            });
          } catch (e) {
            //catch上傳失敗
            resolve(t('component.upload.uploadError') + '，' + e);
          }
        });
      };

      //設定: 上傳檔案Api
      const getUplodaData = (data) => {
        console.log(data);

        //文章
        if (props.apiName === 'article') return uploadArticleImage(data);

        //類別
        if (props.apiName === 'articleCategory') return uploadCategoryImage(data);

        //文章
        if (props.apiName === 'history') return uploadHistoryImage(data);

        //類別
        if (props.apiName === 'historyCategory') return uploadHistoryCategoryImage(data);

        return null;
      };

      //同步資料
      watch(
        () => files.value,
        () => {
          emit('update:fileList', files.value);
        },
      );

      onMounted(() => {
        if (props.fileList && props.fileList.length > 0) {
          files.value = props.fileList;
        }
      });
      /*=========data=========*/
      return {
        t,
        errorImage,

        files,
        preview,
        coustomClass,
        getImgListType,
        handleBeforeUpload,
        handlePreview,
        handleSave,
      };
    },
  });
</script>
<style lang="less" scoped>
  @border-color: #d9d9d9;

  .input-upload {
    :deep(.ant-upload-list) {
      border: 1px solid @border-color !important;
      display: grid;
      align-items: center;
      width: 100%;
      height: 32px;
      overflow: hidden;

      .ant-upload-list-text-container {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }

    :deep(.ant-upload-list-item) {
      margin: 0;
      cursor: pointer;
    }

    .upload-w-full {
      :deep(.ant-upload.ant-upload-select) {
        width: 100%;
        position: relative;
        z-index: 11;
      }

      :deep(.ant-upload-list) {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        padding-left: 120px;
        z-index: 9;
      }
    }

    .upload-w-auto {
      display: flex;
    }
  }

  .full-upload :deep(.ant-upload-list) {
    & > .ant-upload {
      align-items: center;
      background: #fff;
      border: 2px dashed #ced4da;
      border-radius: 6px;
      display: grid;
      justify-content: center;
      min-height: 230px;
      width: 100%;
    }
  }
</style>
