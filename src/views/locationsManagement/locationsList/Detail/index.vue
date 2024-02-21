<template>
  <PageWrapper :fixSmallWidth="false" class="custom-pageTitle">
    <Spin :spinning="spinning">
      <PageHeader>
        <template #title>
          <div class="flex justify-between">
            <div>{{ t('component.articleManagement.articleContent') }}</div>
            <div>
              <a-button type="text" class="w-36 mr-3" @click="go('/backend/locationsList')">
                <Icon icon="icon-park-outline:return" />{{ t('common.back') }}
              </a-button>

              <a-button type="primary" class="w-36" @click="handleSave">
                {{ formData.id > 0 ? t('common.save') : t('common.add') }}
              </a-button>
            </div>
          </div>
        </template>
      </PageHeader>
      <!-- 步驟 1 -->
      <div class="bg-white py-4 px-2 rounded-lg">
        <Collapse ghost expandIconPosition="right" v-model:activeKey="step.step1.activeKey">
          <CollapsePanel :key="1">
            <template #header>
              <div class="flex items-center">
                <div class="custom-step dark-color">01</div>
                <div class="pl-3">
                  <div class="text-base dark-color">
                    {{ t('component.articleManagement.articleContentSetting') }}
                  </div>
                  <div class="text-sm text-slate-500">
                    {{ t('component.articleManagement.completeRequiredFields') }}
                  </div>
                </div>
              </div>
            </template>
            <div class="pb-6"><hr /></div>
            <BasicForm
              ref="stepOneRef"
              class="custom-form custom-form-gap-2"
              layout="vertical"
              labelWidth="100%"
              :schemas="step.step1.schemas"
              :showActionButtonGroup="false"
            >
              <template #customSlot="{ model, field }">
                <div v-if="field == 'divider'" class="py-0"><hr /></div>
                <CustomFileUpload
                  v-else-if="field != 'content'"
                  v-model:fileList="model[field]"
                  ref="fileUploadRef"
                  apiName="article"
                  accept="image/*"
                  :key="formData.key"
                />
              </template>
            </BasicForm>
          </CollapsePanel>
        </Collapse>
      </div>

      <!-- 步驟 2 -->
      <br />
      <!-- <div class="bg-white py-4 px-2 rounded-lg">
        <Collapse ghost expandIconPosition="right" v-model:activeKey="step.step2.activeKey">
          <CollapsePanel :key="1">
            <template #header>
              <div class="flex items-center">
                <div class="custom-step dark-color">02</div>
                <div class="pl-3">
                  <div class="text-base dark-color">
                    {{ t('component.articleManagement.relatedSettings') }}
                  </div>
                  <div class="text-sm text-slate-500">
                    {{ t('component.articleManagement.completeRequiredFields') }}
                  </div>
                </div>
              </div>
            </template>
            <div class="pb-6"><hr /></div>
            <BasicForm
              ref="stepTwoRef"
              class="custom-form custom-form-gap-2"
              layout="vertical"
              labelWidth="100%"
              :schemas="step.step2.schemas"
              :showActionButtonGroup="false"
            />
          </CollapsePanel>
        </Collapse>
      </div> -->

      <!-- 步驟 3 -->
      <!-- <br />
     <div class="bg-white py-4 px-2 rounded-lg">
      <Collapse ghost expandIconPosition="right" v-model:activeKey="step.step3.activeKey">
        <CollapsePanel :key="1">
          <template #header>
            <div class="flex items-center">
              <div class="custom-step dark-color">03</div>
              <div class="pl-3">
                <div class="text-base dark-color">
                  {{ t('component.articleManagement.seoLayoutSettings') }}
                </div>
                <div class="text-sm text-slate-500">
                  {{ t('component.articleManagement.completeRequiredFields') }}
                </div>
              </div>
            </div>
          </template>
          <div class="pb-6"><hr /></div>
          <BasicForm
            ref="stepThreeRef"
            class="custom-form custom-form-gap-2"
            layout="vertical"
            labelWidth="100%"
            :schemas="step.step3.schemas"
            :showActionButtonGroup="false"
          />
        </CollapsePanel>
      </Collapse>
    </div> -->

      <!-- 步驟 4 -->
      <!-- <br />
      <div class="bg-white py-4 px-2 rounded-lg">
        <Collapse ghost expandIconPosition="right" v-model:activeKey="step.step4.activeKey">
          <CollapsePanel :key="1">
            <template #header>
              <div class="flex items-center">
                <div class="custom-step dark-color">04</div>
                <div class="pl-3">
                  <div class="text-base dark-color">
                    {{ t('component.articleManagement.uploadRelatedPhotos') }}
                  </div>
                  <div class="text-sm text-slate-500">
                    {{ t('component.articleManagement.completeRequiredFields') }}
                  </div>
                </div>
              </div>
            </template>
            <div class="pb-6"><hr /></div>
            <BasicForm
              ref="stepFourRef"
              class="custom-form custom-form-gap-2"
              layout="vertical"
              labelWidth="100%"
              :schemas="step.step4.schemas"
              :showActionButtonGroup="false"
            >
              <template #customSlot="{ model, field }">
                <CustomFileUpload
                  v-model:file-list="model[field]"
                  accept="image/*"
                  component="full"
                />
              </template>
            </BasicForm>
          </CollapsePanel>
        </Collapse>
      </div> -->
    </Spin>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, nextTick, reactive, computed, unref, ref } from 'vue';
  import { BasicForm } from '/@/components/Form/index';
  import { Spin, PageHeader, Collapse, CollapsePanel } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { showMsg } from '/@/utils/globalTips';
  import { useGo } from '/@/hooks/web/usePage';
  import { Icon } from '/@/components/Icon';
  import { useRoute } from 'vue-router';
  import XEUtils from 'xe-utils';
  import dayjs from 'dayjs';

  //components
  import { CustomFileUpload } from '/@/components/CustomFileUpload';

  //api
  import {
    getArticleItem,
    addArticle,
    updateArticle,
    // getArticleGamesList,
  } from '/@/api/page/locations/locationsList';
  // import { getAllCategoryList } from '/@/api/page/article/articleCategory';
  import { getAllCategoryList } from '/@/api/page/locations/locationBusiness';

  import { getAllCategoryRegionsList } from '/@/api/page/locations/locationRegions';
  // import { getAllTagList } from '/@/api/page/article/tag';
  //data
  import { schemas_step1, schemas_step2, schemas_step3, schemas_step4, tinymceRef } from './data';

  export default defineComponent({
    components: {
      PageWrapper,
      PageHeader,
      BasicForm,
      Collapse,
      CollapsePanel,
      CustomFileUpload,
      Icon,
      Spin,
    },
    emits: ['reload'],
    setup() {
      const { t } = useI18n();
      const go = useGo();
      const route = useRoute();
      /*=========values=========*/
      //spin
      const spinning = ref<any>(true);

      //Collapse
      const stepOneRef = ref<any>(null); //步驟1
      const stepTwoRef = ref<any>(null); //步驟2
      const stepThreeRef = ref<any>(null); //步驟3
      const stepFourRef = ref<any>(null); //步驟3
      const step = reactive<any>({
        step1: {
          ref: computed(() => stepOneRef.value),
          activeKey: 1,
          schemas: schemas_step1,
        },
        step2: {
          ref: computed(() => stepTwoRef.value),
          activeKey: 1,
          schemas: schemas_step2,
        },
        step3: {
          ref: computed(() => stepThreeRef.value),
          activeKey: 1,
          schemas: schemas_step3,
        },
        step4: {
          ref: computed(() => stepFourRef.value),
          activeKey: 1,
          schemas: schemas_step4,
        },
      });

      //form
      const formData = reactive<any>({
        id: Number(route.params.id),
        key: 0,
      });

      //file
      const fileUploadRef = ref<any>(null);

      /*=========function=========*/
      async function loadData() {
        spinning.value = true;

        if (Number(formData.id) === 0) {
          //新增
          spinning.value = false;
          return;
        }

        //編輯
        const res = await getArticleItem(formData.id);
        if (res.code === 200) {
          let model = res.result.article;
          // model.gameSettings = model.gameSettings ? JSON.parse(model.gameSettings) : [];
          // model.articleSettings = model.articleSettings ? JSON.parse(model.articleSettings) : [];
          // model.keywordSettings = model.keywordSettings ? JSON.parse(model.keywordSettings) : [];
          // model.publishDate = dayjs().format('YYYY-MM-DD');

          //取得圖片
          // model.images = model.images ? JSON.parse(model.images) : [];
          // model.listImg = model.images.list ? model.images.list : [];
          // model.detailImg = model.images.inner ? model.images.inner : [];
          // model.thumbnailImg = model.images.icon ? model.images.icon : [];

          await unref(step.step1.ref).setFieldsValue(model);
          // await unref(step.step2.ref).setFieldsValue(model);
          formData.key++;
        }

        spinning.value = false;
      }
      const handleSave = async () => {
        try {
          //驗證
          const validate = await step.step1.ref.validate().catch(() => {
            showMsg('warning', '還有欄位未填寫完成');
            return false;
          });
          if (!validate) return false;

          spinning.value = true;

          //編輯器上傳圖片
          // const resTinymce = await tinymceRef.value?.startUploadFile();
          // const sizeTooBig = XEUtils.filter(resTinymce, (item) => item.status === false);
          // if (sizeTooBig.length > 0) {
          //   showMsg(
          //     'error',
          //     t('component.articleManagement.contentDescription') +
          //       '，' +
          //       t('component.upload.uploadError'),
          //   );
          //   spinning.value = false;
          //   return false;
          // }

          //取得values
          const values1 = step.step1.ref.getFieldsValue();
          // const values2 = step.step2.ref.getFieldsValue();

          //組成api結構
          let model: any = {
            id: formData.id,
            title: values1.title ? values1.title : '', //標題
            // code: values1.code ? values1.code : '', //代稱設定
            address: values1.address ? values1.address : '', //地址
            phone: values1.phone ? values1.phone : '', //服務電話
            latitude: values1.latitude ? values1.latitude : '', //緯度
            longitude: values1.longitude ? values1.longitude : '', //精度
            type: values1.type ? values1.type : 0, //文章類別
            regions: values1.regions ? values1.regions : 0, //地區類別
            business_hours: values1.business_hours ? values1.business_hours : '', //經營時間
            // content: values1.content ? values1.content : '', //內容
            // publishDate: values1.publishDate ? dayjs(values1.publishDate).format('YYYY-MM-DD') : '', //刊登日期
            // sort: values1.sort ? values1.sort : 0, //排序
            // isLatest: values1.isLatest ? values1.isLatest : 0, //最新
            // isFeatured: values1.isFeatured ? values1.isFeatured : 0, //精選
            // isTop: values1.isTop ? values1.isTop : 0, //置頂
            // isPublish: values1.isPublish ? values1.isPublish : 0, //是否刊登
            isDelete: values1.isDelete ? values1.isDelete : 0, //是否刪除
            // images: '', //圖片
            // browserCount: 0, //瀏覽數(確認是否要修改)

            // gameSettings: values2.gameSettings ? JSON.stringify(values2.gameSettings) : '', //相關賽事設定
            // articleSettings: values2.articleSettings ? JSON.stringify(values2.articleSettings) : '', //相關文章設定
            // keywordSettings: values2.keywordSettings ? JSON.stringify(values2.keywordSettings) : '', //熱門關鍵字標籤設定

            //未確定欄位
            // seoHeaderData: '',
            // seoMetaData: '',
            // isEnable: 0,
          };

          //images
          // const images = await upload(values1);
          // model.images = JSON.stringify(images);

          //api
          let res = { code: 400 };
          if (Number(formData.id) === 0) {
            //新增
            res = await addArticle(model);
            go('/backend/locationsList');
          } else {
            //編輯
            res = await updateArticle(model);
          }
          if (res && res.code == 200) {
            showMsg('success', t('common.success'));
            loadData();
          }
        } catch (e) {
          spinning.value = false;
        }
      };
      const getOptions = async () => {
        const option = {
          tags: [],
          categorys: [],
          categorysregions: [],
          sports: [],
        };

        //取得: 所有熱門關鍵字標籤
        // const tag = await getAllTagList();
        // if (tag.code === 200) {
        //   option.tags = tag.result.rows.map((item) => {
        //     return { value: item.id, label: item.name };
        //   });
        //   step.step2.ref.updateSchema([
        //     { field: 'keywordSettings', componentProps: { options: option.tags } },
        //   ]);
        // }

        //取得: 所有文章分類
        const categorys = await getAllCategoryList();
        if (categorys.code === 200) {
          option.categorys = categorys.result.rows.map((item) => {
            return { value: item.id, label: item.name };
          });
          step.step1.ref.updateSchema([
            { field: 'type', componentProps: { options: option.categorys } },
          ]);
          // step.step2.ref.updateSchema([
          //   { field: 'articleSettings', componentProps: { options: option.categorys } },
          // ]);
        }

        const categorysregions = await getAllCategoryRegionsList();
        if (categorysregions.code === 200) {
          option.categorysregions = categorysregions.result.rows.map((item) => {
            return { value: item.id, label: item.name };
          });
          step.step1.ref.updateSchema([
            { field: 'regions', componentProps: { options: option.categorysregions } },
          ]);
          // step.step2.ref.updateSchema([
          //   { field: 'articleSettings', componentProps: { options: option.categorysregions } },
          // ]);
        }

        // //取得: 所有賽事
        // const sports = await getArticleGamesList();
        // if (sports.code === 200) {
        //   option.sports = sports.result.rows.map((item) => {
        //     return { value: item.id, label: item.name };
        //   });
        //   step.step2.ref.updateSchema([
        //     { field: 'gameSettings', componentProps: { options: option.sports } },
        //   ]);
        // }
      };

      //取得上傳的圖片
      // const upload = async (values1) => {
      //   const list = values1.listImg ? values1.listImg : []; //列表圖片上傳
      //   const inner = values1.detailImg ? values1.detailImg : []; //內頁圖片上傳
      //   const icon = values1.thumbnailImg ? values1.thumbnailImg : []; //頁面縮圖設定

      //   //上傳: 列表圖片
      //   const listFlie = await fileUploadRef.value.handleSave(list ? list : []);

      //   //上傳: 內頁圖片
      //   const detailFlie = await fileUploadRef.value.handleSave(inner ? inner : []);

      //   //上傳: 頁面縮圖設定
      //   const thumbnailFlie = await fileUploadRef.value.handleSave(icon ? icon : []);

      //   return {
      //     list: listFlie, //列表圖片上傳
      //     inner: detailFlie, //內頁圖片上傳
      //     icon: thumbnailFlie, //頁面縮圖設定
      //   };
      // };

      onMounted(async () => {
        await getOptions();
        nextTick(() => {
          loadData();
        });
      });
      /*=========data=========*/
      return {
        t,
        go,
        spinning,

        //form
        formData,
        step,
        stepOneRef,
        stepTwoRef,
        stepThreeRef,
        stepFourRef,
        handleSave,

        //file
        fileUploadRef,
      };
    },
  });
</script>
<style lang="less" scoped>
  .dark-color {
    color: #585858;
  }

  hr {
    border-color: #f5f5f5;
  }

  .custom-step {
    @size: 32px;
    background: #f5f6f8;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    border-radius: 50%;
    width: @size;
    height: @size;
    line-height: @size;
  }

  :deep(.tox-tinymce) {
    border: none;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;

    .tox-statusbar {
      border-bottom: 1px solid #ccc;
    }
  }

  :deep(.ant-form) .ant-form-item-control-input-content > div {
    display: block !important;
  }
</style>
