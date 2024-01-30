<template>
  <template v-if="useCustomButton"><slot name="customButton"></slot></template>
  <a-button v-else class="custom-btn-blue custom-size-default float-right" @click="openModal">
    <Icon icon="majesticons:file-report-line" :size="14" />
    {{ buttonName }}
  </a-button>
  <ExpExcelModal @register="register" @success="defaultHeader" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { jsonToSheetXlsx, ExpExcelModal, ExportModalResult } from '/@/components/Excel';
  import { useModal } from '/@/components/Modal';
  import { Icon } from '/@/components/Icon';
  import { cloneDeep } from 'lodash-es';
  import XEUtils from 'xe-utils';

  export default defineComponent({
    components: { ExpExcelModal, Icon },
    props: {
      buttonName: { type: String }, //按鈕名稱
      columns: { type: Array, default: () => [{ field: 'name', title: '名稱' }] }, //表格-表頭列
      dataSource: { type: Array, default: () => [{ name: 'Amy' }] }, //表格數據
      isUpperCase: { type: Boolean, default: false }, //表格數據是否為大寫
      useCustomButton: { type: Boolean, default: false }, //是否使用父層按鈕
      useIndex: { type: Boolean, default: false }, //是否需要有序號
    },
    setup(props) {
      const [register, { openModal }] = useModal(); //components

      //取得匯出的資料
      function getExportData() {
        const dataSourceList = cloneDeep(props.dataSource);
        let columnList: any = [];
        let data: any = [];
        props.columns.forEach((item: any) => {
          if (item.field !== 'checkbox' && item.field !== 'action') {
            columnList.push({ field: item.field, title: item.title, type: item.type });
          }
        });

        dataSourceList.forEach((item: any, index) => {
          let model = {};
          for (const column of columnList) {
            const field = column.field;
            const title = column.title;
            const type = column.type;
            console.log(column);
            props.isUpperCase
              ? (model[title] = valueUpperCase(item[field]))
              : (model[title] = item[field]);
            if (props.useIndex) {
              if (type == 'seq') model[title] = index + 1;
            }
          }
          data.push(model);
        });
        return data;
      }
      function defaultHeader({ filename, bookType }: ExportModalResult) {
        const data = getExportData();
        jsonToSheetXlsx({
          data,
          filename,
          write2excelOpts: {
            bookType,
          },
        });
      }

      //轉成大寫
      function valueUpperCase(value) {
        if (XEUtils.isFinite(value)) {
          //數值
          return value;
        } else if (value) {
          //文字
          return value.toUpperCase();
        } else {
          return '';
        }
      }
      return {
        register,
        defaultHeader,
        openModal,
      };
    },
  });
</script>
