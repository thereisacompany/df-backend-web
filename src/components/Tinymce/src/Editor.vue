<template>
  <div
    :class="[prefixCls, { 'readonly-mode': disable }, { fullscreen: fullscreen }]"
    :style="{ width: containerWidth }"
  >
    <textarea :id="tinymceId" ref="elRef" v-if="!initOptions.inline"></textarea>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
  import { Button } from 'ant-design-vue';
  import type { Editor, RawEditorSettings } from 'tinymce';
  import tinymce from 'tinymce/tinymce';
  import 'tinymce/themes/silver';
  import 'tinymce/icons/default/icons';
  import 'tinymce/plugins/advlist';
  import 'tinymce/plugins/anchor';
  import 'tinymce/plugins/autolink';
  import 'tinymce/plugins/autosave';
  import 'tinymce/plugins/code';
  import 'tinymce/plugins/codesample';
  import 'tinymce/plugins/directionality';
  import 'tinymce/plugins/fullscreen';
  import 'tinymce/plugins/hr';
  import 'tinymce/plugins/insertdatetime';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/lists';
  import 'tinymce/plugins/media';
  import 'tinymce/plugins/nonbreaking';
  import 'tinymce/plugins/noneditable';
  import 'tinymce/plugins/pagebreak';
  import 'tinymce/plugins/paste';
  import 'tinymce/plugins/preview';
  import 'tinymce/plugins/print';
  import 'tinymce/plugins/save';
  import 'tinymce/plugins/searchreplace';
  import 'tinymce/plugins/spellchecker';
  import 'tinymce/plugins/tabfocus';
  // import 'tinymce/plugins/table';
  import 'tinymce/plugins/template';
  import 'tinymce/plugins/textpattern';
  import 'tinymce/plugins/visualblocks';
  import 'tinymce/plugins/visualchars';
  import 'tinymce/plugins/wordcount';
  import 'tinymce/plugins/image';
  import 'tinymce/plugins/imagetools';
  import 'tinymce/plugins/table';
  import 'tinymce/plugins/charmap';
  import 'tinymce/plugins/emoticons';

  import {
    defineComponent,
    computed,
    nextTick,
    ref,
    unref,
    watch,
    onDeactivated,
    onBeforeUnmount,
  } from 'vue';
  import { toolbar, plugins } from './tinymce';
  import { buildShortUUID } from '/@/utils/uuid';
  import { bindHandlers } from './helper';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { isNumber } from '/@/utils/is';
  import { useLocale } from '/@/locales/useLocale';
  import { useAppStore } from '/@/store/modules/app';
  import { useI18n } from '/@/hooks/web/useI18n';

  //api
  import { uploadArticleImage } from '/@/api/page/article/articleList';

  //import { useMeetingMinutesStore } from '/@/store/modules/page/DOC/meetingMinutes';

  const tinymceProps = {
    options: {
      type: Object as PropType<Partial<RawEditorSettings>>,
      default: {},
    },
    value: {
      type: String,
    },

    toolbar: {
      type: Array as PropType<string[]>,
      default: toolbar,
    },
    plugins: {
      type: Array as PropType<string[]>,
      default: plugins,
    },
    modelValue: {
      type: String,
    },
    height: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 800,
    },
    width: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 'auto',
    },
    showImageUpload: {
      type: Boolean,
      default: true,
    },
    mon: {
      type: Number,
      default: 0,
    },
    disable: {
      type: Boolean,
    },
    uploadFileFunc: {
      type: String,
    },
    menubar: {
      type: Boolean,
      default: true,
    },
    content_style: {
      type: String,
    },
  };

  export default defineComponent({
    name: 'Tinymce',
    components: {},
    inheritAttrs: false,
    props: tinymceProps,
    emits: ['change', 'update:modelValue', 'inited', 'init-error'],
    setup(props, { emit, attrs }) {
      const { t } = useI18n();
      const change = () => {
        emit('change', 1);
      };
      const maxSize = 2; //檔案大小
      const wordcounts = ref(0);
      const originalEditorData: any = ref([]); //編輯器原來的內容

      const editorRef = ref<Nullable<Editor>>(null);
      const fullscreen = ref(false);
      const tinymceId = ref<string>(buildShortUUID('tiny-vue'));
      const elRef = ref<Nullable<HTMLElement>>(null);
      const { prefixCls } = useDesign('tinymce-container');

      const appStore = useAppStore();

      const tinymceContent = computed(() => props.modelValue);
      const containerWidth = computed(() => {
        const width = props.width;
        if (isNumber(width)) {
          return `${width}px`;
        }
        return width;
      });

      const skinName = computed(() => {
        return appStore.getDarkMode === 'light' ? 'oxide' : 'oxide-dark';
      });

      const langName = computed(() => {
        const lang = useLocale().getLocale.value;
        return ['zh_CN', 'en', 'zh_TW'].includes(lang) ? lang : 'en';
      });
      //刷新mode
      const refreshMode = () => {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        editor.setMode(props.disable ? 'readonly' : 'design');
      };
      watch(
        () => props.disable,
        () => {
          nextTick(() => {
            setTimeout(() => {
              refreshMode();
              //拿編輯器原本的內容
              const editor = unref(editorRef);
              if (editor) {
                originalEditorData.value = editor.getContent();
              }
            }, 300);
          });
        },
        {
          immediate: true,
        },
      );

      const initOptions = computed((): RawEditorSettings => {
        const { height, options, toolbar, plugins } = props;
        const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';

        return {
          selector: `#${unref(tinymceId)}`,
          height,
          toolbar: toolbar,
          menubar: props.menubar ? 'file edit insert view format table' : false,
          plugins,
          language_url: publicPath + 'resource/tinymce/langs/' + langName.value + '.js',
          language: langName.value,
          branding: false,
          default_link_target: '_blank',
          link_title: false,
          object_resizing: false,
          auto_focus: true,
          skin: skinName.value,
          emoticons_database_url: '/emojis.js',
          //inline: true, //开启内联模式
          skin_url: publicPath + 'resource/tinymce/skins/ui/' + skinName.value,
          content_css:
            publicPath + 'resource/tinymce/skins/ui/' + skinName.value + '/content.min.css',
          ...options,
          // 關閉菜單內選項
          removed_menuitems: 'newdocument template visualaid ',
          min_height: 200,
          paste_data_images: true,
          //上傳圖片
          images_file_types: 'jpeg,jpg,png,gif,bmp,webp',
          file_picker_types: 'image',
          imagetools_cors_hosts: ['spring-dev.ceos.center', 'hf8.io'],
          automatic_uploads: false,
          content_style: props.content_style,
          convert_urls: false,
          relative_urls: false,
          images_upload_handler: handelUplodImage,

          setup: (editor: Editor) => {
            editorRef.value = editor;

            editor.on('init', (e) => {
              initSetup(e);
            });
          },
        };
      });

      const blobUUId: any = ref([]); //圖片UUID

      //開始上傳圖片
      const startUploadFile = async () => {
        try {
          const editor = unref(editorRef);
          if (editor) {
            const res = await editor.uploadImages(); //觸發images_upload_handler
            return res;
          }
        } catch (error) {
          return error;
        }
      };
      async function handelUplodImage(blobInfo, succFun, failFun) {
        const errorMessage = t('component.upload.uploadError');

        //console.log('上傳檔案', file);

        const file: any = blobInfo.blob();
        if (file.size / 1024 / 1024 > maxSize) {
          failFun(t('component.upload.maxSize', [maxSize]));
          return false;
        }

        try {
          const res: any = await uploadArticleImage({
            file: file,
            filename: file.name == 'image.png' ? `screenShot_${file.lastModified}` : file.name,
            name: 'file',
          });

          if (!res || res.status !== 200) {
            failFun(errorMessage);
            return '';
          }

          const url = res.data;
          const fileSrc: any = {
            filename: file.fileName,
            path: url,
            uuid: file.uuid,
          };
          blobUUId.value = getImageInfo('history');
          succFun(String(fileSrc.path));
        } catch (e) {
          failFun(e);
        }
      }
      const getImageInfo = (type?) => {
        const editor = unref(editorRef);

        const imageArray: any = ref([]); //圖片UUID陣列
        if (editor) {
          const images = editor.dom.select('img');

          if (images.length > 0) {
            console.log('編輯器中包含圖片');
            images.forEach((img) => {
              const url: any = img.getAttribute('src');

              imageArray.value.push(url);
            });

            if (type == 'history') {
              return imageArray.value;
            } else {
              return {
                final: imageArray.value,
                history: blobUUId.value,
              };
            }
          } else {
            console.log('編輯器中不包含圖片');
            return [];
          }
        }
      };
      //監聽使用者利用按鍵刪除圖片(Backspace、Delete鍵)
      const startDeleteFile = async () => {
        const editor = unref(editorRef);
        if (editor) {
          //原本編輯器內容中的圖片
          const doc = new DOMParser().parseFromString(originalEditorData.value, 'text/html');
          const imgs = doc.getElementsByTagName('img');
          const imageHistory: any = ref([]); //原本圖片Array
          if (imgs.length > 0) {
            for (let i = 0; i < imgs.length; i++) {
              const url: any = imgs[i].src;
              imageHistory.value.push(url);
            }
          }
          console.log('原本的img', imageHistory.value);

          let selectedNode: any = tinymce.activeEditor.selection.getNode();
          if (selectedNode) {
            //直接在編輯器刪除
            setTimeout(() => {
              const finalImages: any = ref([]); //最後留在編輯器裡的img Array
              const images = editor.dom.select('img');
              if (images.length > 0) {
                images.forEach((img) => {
                  const url: any = img.getAttribute('src');
                  finalImages.value.push(url);
                });
              }
              console.log('最後留在編輯器裡的img', finalImages.value);
              //比對imageHistory中是否有不存在於finalImages==被刪除的img
              const delImage = imageHistory.value.filter((x) => !finalImages.value.includes(x));
              console.log('被刪除的', delImage);
              delImage.forEach(async (element) => {
                if (element.startsWith('https://spring-dev.ceos.center/')) {
                  // await deleteFile(String(props.uploadFileFunc), { url: element });
                }
              });
            }, 300);
          }
        }
      };

      const disabled = computed(() => {
        const { options } = props;
        const getdDisabled = options && Reflect.get(options, 'readonly');
        const editor = unref(editorRef);
        if (editor) {
          editor.setMode(getdDisabled ? 'readonly' : 'design');
        }
        return getdDisabled ?? false;
      });
      function destory() {
        if (tinymce !== null) {
          tinymce?.remove?.(unref(initOptions).selector!);
        }
      }

      function initEditor() {
        const el = unref(elRef);
        if (el) {
          el.style.visibility = '';
        }

        tinymce
          .init(unref(initOptions))
          .then((editor) => {
            emit('inited', editor);
          })
          .catch((err) => {
            emit('init-error', err);
          });
      }

      function initSetup(e) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        const value = props.modelValue || '';

        editor.setContent(value);
        bindModelHandlers(editor);
        bindHandlers(e, attrs, unref(editorRef));
      }

      function setValue(editor: Recordable, val: string, prevVal?: string) {
        if (
          editor &&
          typeof val === 'string' &&
          val !== prevVal &&
          val !== editor.getContent({ format: attrs.outputFormat })
        ) {
          editor.setContent(val);
        }
      }

      function bindModelHandlers(editor: any) {
        const modelEvents = attrs.modelEvents ? attrs.modelEvents : null;
        const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;

        watch(
          () => props.modelValue,
          (val: string, prevVal: string) => {
            setValue(editor, val, prevVal);
          },
        );

        watch(
          () => props.value,
          (val: string, prevVal: string) => {
            setValue(editor, val, prevVal);
          },
          {
            immediate: true,
          },
        );

        editor.on(normalizedEvents ? normalizedEvents : 'change keyup undo redo', () => {
          const content = editor.getContent({ format: attrs.outputFormat });
          emit('update:modelValue', content);
          emit('change', content);
        });

        //按下Fullscreen觸發
        editor.on('FullscreenStateChanged', (e) => {
          fullscreen.value = e.state;
        });

        // Cmd+S或 Ctrl+S，不刷新頁面
        editor.on('keydown', function (e) {
          if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault(); // 阻止瀏覽器預設的儲存操作
            return false;
          }
        });
      }
      //編輯器字數
      const countWords = () => {
        const editor = unref(editorRef);
        if (editor) {
          const words = editor.plugins.wordcount.body.getCharacterCount();
          return words;
        }
      };

      // 已上傳的img放入陣列中
      const uploadImg: any = ref([]);

      function handleSubmit() {
        const editor = unref(editorRef);
        const content = editor?.getContent() ?? '';
        console.log('content:', content);
      }

      // 清空編輯器
      function resetContent() {
        const editor = unref(editorRef);
        editor?.setContent('');
      }

      watch(
        () => attrs.disabled,
        () => {
          const editor = unref(editorRef);
          if (!editor) {
            return;
          }
          editor.setMode(attrs.disabled ? 'readonly' : 'design');
        },
      );

      onMountedOrActivated(() => {
        if (!initOptions.value.inline) {
          tinymceId.value = buildShortUUID('tiny-vue');
        }
        nextTick(() => {
          setTimeout(() => {
            initEditor();
          }, 30);
        });
      });

      onBeforeUnmount(() => {
        destory();
      });

      onDeactivated(() => {
        destory();
      });

      return {
        t,
        prefixCls,
        containerWidth,
        initOptions,
        tinymceContent,
        elRef,
        tinymceId,
        editorRef,
        fullscreen,
        disabled,
        handleSubmit,
        change,
        Button,
        uploadImg,
        resetContent,
        wordcounts,
        getImageInfo,
        handelUplodImage,
        startUploadFile,
        startDeleteFile,
        countWords,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-tinymce-container';

  .@{prefix-cls} {
    z-index: 40;
    position: relative;
    line-height: normal;

    textarea {
      z-index: -1;
      visibility: hidden;
    }
  }

  .readonly-mode {
    :deep(.tox-menubar) {
      display: none;
    }

    :deep(.tox-toolbar-overlord) {
      display: none;
    }
  }

  .fullscreen {
    position: fixed;
    z-index: 10000;
  }

  // =================================
  // ===========自訂義 tinymce blockquote 樣式==========
  blockquote {
    overflow: hidden;
    padding-right: 1.5em;
    padding-left: 1.5em;
    margin-left: 0;
    margin-right: 0;
    font-style: italic;
    border-left: 5px solid red !important;
  }
</style>
