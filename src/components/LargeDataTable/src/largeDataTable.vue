<template>
  <vxe-grid ref="xGrid" v-bind="gridOptions">
    <!-- @filter-change="filterChangeEvent" -->
    <template #content_edit="{ row, column }">
      <vxe-input v-model="row[column.field]" />
    </template>
    <template #default_actions="{ row, column }" v-if="buttonName">
      <div v-if="buttonName === 'editActions'">
        <div class="flex justify-around" v-if="$refs.xGrid.isEditByRow(row)">
          <a-button :type="buttonType" @click="saveRowEvent(row)">
            {{ t('common.saveText') }}
          </a-button>
          <a-button :type="buttonType" @click="cancelEditEvent(row)">
            {{ t('common.cancel') }}
          </a-button>
        </div>
        <div class="flex justify-around" v-else>
          <a-button :type="buttonType" @click="editRowEvent(row)">
            {{ t('common.edit') }}
          </a-button>
          <a-button :type="buttonType" @click="removeRowEvent(row)">
            {{ t('common.delete') }}
          </a-button>
        </div>
      </div>
      <div v-else-if="buttonName === 'editMemoActions'">
        <div class="flex justify-around" v-if="$refs.xGrid.isEditByRow(row)">
          <a-button :type="buttonType" @click="saveRowEvent(row)">保存</a-button>
          <a-button :type="buttonType" @click="cancelEditEvent(row)">取消</a-button>
        </div>
        <div class="flex justify-around" v-else>
          <a-button :type="buttonType" @click="editRowEvent(row)">編輯</a-button>
        </div>
      </div>
      <div v-else-if="buttonName === 'teamEdit'">
        <div class="flex justify-around">
          <a-button :type="buttonType" @click="leaveTeamBtn(row)">離開隊伍</a-button>
          <a-button :type="buttonType" @click="showDetail(row, column)">編輯</a-button>
        </div>
      </div>
      <div v-else>
        <a-button :type="buttonType" :class="btnCustomClass" @click="showDetail(row, column)">
          <Icon v-if="buttonIconBefore" :icon="buttonIconName" :size="14" />
          {{ buttonName }}
          <Icon v-if="buttonIconAfter" :icon="buttonIconName" :size="14" />
        </a-button>
      </div>
    </template>
    <!--自訂cell -->
    <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>

    <template #left_toolbar v-if="isLeftToolbar">
      <div class="p-4">
        <slot name="LeftToolbar"></slot>
      </div>
    </template>

    <!-- pager -->
    <template #pager v-if="isShowPager">
      <vxe-pager
        background
        :align="'center'"
        v-model:current-page="tablePage.currentPage"
        v-model:page-size="tablePage.pageSize"
        size="mini"
        :page-sizes="[5, 10, 50, 100]"
        :total="tablePage.total"
        :layouts="[
          'PrevJump',
          'PrevPage',
          'JumpNumber',
          'NextPage',
          'NextJump',
          'Sizes',
          'FullJump',
          'Total',
        ]"
        @page-change="handlePageChange"
      />
    </template>
  </vxe-grid>
</template>
<script lang="ts">
  import { defineComponent, PropType, onMounted, reactive, ref } from 'vue';
  import { VxeGridInstance, VxeGridProps, VxeTablePropTypes, VXETable } from 'vxe-table';
  import { cloneDeep } from 'lodash-es';
  import { getFooterCellColorClass } from './data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Icon } from '/@/components/Icon';
  import XEUtils from 'xe-utils';

  export default defineComponent({
    components: {
      Icon,
    },
    props: {
      // https://vxetable.cn/#/table/edit/manual
      buttonName: { type: String }, //#default_actions => 按鈕名稱 // buttonName= 'editActions'行编辑的功能請參考上方連結
      buttonType: { type: String, default: 'default' }, //#default_actions => 按鈕樣式
      btnCustomClass: { type: String, default: 'custom-btn-second custom-size-default' }, //自訂按鈕樣式
      buttonIconBefore: { type: Boolean, default: false }, //按鈕是否有icon(文字前)
      buttonIconAfter: { type: Boolean, default: false }, //按鈕是否有icon(文字後)
      buttonIconName: { type: String }, //按鈕icon
      isShowPager: { type: Boolean }, //是否顯示分頁(true=是)
      border: { type: String as PropType<VxeTablePropTypes.Border> }, //Table border樣式 default（默认）, full（完整边框）, outer（外边框）, inner（内边框）, none（无边框）
      maxheight: { type: Number, default: 634 }, //table的高度(使用虛擬滾動故一定要設高度)
      searchData: { type: Array }, //篩選關鍵字清單
      isStripe: { type: Boolean, default: false }, //是否顯示斑馬紋(true=是)
      editTable: { type: Object }, //編輯table
      showOverflow: { type: Boolean, default: true }, //內容超出是否顯示...(true=是)
      itemVO: { type: String },
      isShowFooter: { type: Boolean, default: false }, //是否顯示表尾(true=是)
      //表尾數據資料
      footerList: {
        type: Array,
        default: () => [
          ['合計', 1, 2, 3, 4, 5, 6, 7, 8, 9],
          ['平均', 11, 12, 13, 14, 15, 16, 17, 18, 19],
        ],
      },
      isToolbarCustom: { type: Boolean, default: false }, //是否顯示列設置
      isLeftToolbar: { type: Boolean, default: false }, //是否自訂左邊工具列
      isUseApiChagePage: { type: Boolean, default: false }, //是否使用api切換分頁，預設是一次load全部表格自動切分頁
      isTreeExpand: { type: Boolean, default: true }, //預設是否展開樹狀表格所有內容(true = 是)
    },
    setup(props, context) {
      /*=========values=========*/
      const { t } = useI18n();
      const xGrid = ref<VxeGridInstance>();

      const gridOptions = reactive<any>({
        keepSource: true,
        headerAlign: 'center',
        align: 'center',
        showOverflow: props.showOverflow,
        showHeaderOverflow: true,
        loading: false,
        stripe: props.isStripe,
        maxHeight: props.maxheight,
        resizable: true,
        border: props.border,
        scrollY: { gt: 15 },
        onCheckboxChange: getSelectEvent,
        onCheckboxAll: getSelectEvent,
        onCheckboxRangeChange: getSelectEvent, //滑鼠移動勾選
        rowConfig: {
          useKey: true,
          isHover: true,
          isCurrent: true,
          keyField: 'id',
        },
        columnConfig: {
          resizable: true,
        },
        checkboxConfig: {
          checkField: 'checked',
          range: true, //是否開啟滑鼠移動勾選
        },
        seqConfig: { startIndex: 0 },
        editConfig: {
          trigger: 'manual',
          mode: 'row',
          showStatus: true,
        },
        filterConfig: { iconNone: 'vxe-icon-search' }, //改變標題篩選的icon
        //footer
        showFooterOverflow: true,
        showFooter: props.isShowFooter,
        footerMethod() {
          if (props.footerList) {
            return props.footerList;
          } else {
            return [];
          }
        },
        //修改表尾顏色
        footerCellClassName({ $columnIndex }) {
          return getFooterCellColorClass($columnIndex, props.footerList);
        },

        //排序
        sortConfig: {
          trigger: 'cell',
          defaultSort: { field: 'checkbox', order: 'asc' },
          orders: ['asc', 'desc', null],
        },
        onSortChange: tableSort,
        autoResize: true,
      } as VxeGridProps);

      const tableData = reactive<any>({ columns: [], data: [], dataSource: [] });

      //分頁
      const tablePage = reactive<any>({
        currentPage: 1,
        pageSize: 10,
        total: 0,
      });

      /*=========function=========*/

      //載入資料
      async function loadData(source, current, pageSize, totalCount, startIndex?) {
        const data = cloneDeep(source);
        const $grid = xGrid.value;
        tableData.columns = data.columns;
        tableData.data = data.dataSource;
        tableData.dataSource = data.dataSource; //來源

        if (startIndex != undefined) {
          gridOptions.seqConfig.startIndex = startIndex; //序號
        }

        if ($grid) {
          Promise.all([$grid.reloadColumn(data.columns), $grid.reloadData(data.dataSource)]).then(
            () => {
              tablePage.currentPage = current;
              tablePage.pageSize = pageSize;
              tablePage.total = totalCount;

              if (props.isShowPager) {
                //使用api切換分頁
                if (props.isUseApiChagePage) {
                  //設定顯示的數據
                  console.log('使用api切換分頁', tablePage.currentPage);
                  const $grid = xGrid.value;
                  const list = tableData.data;
                  if (tablePage.total != 0) {
                    if ($grid) {
                      $grid.loadData(list);
                      allTreeExpand();
                    }
                  }
                } else {
                  handlePageChange({
                    currentPage: tablePage.currentPage,
                    pageSize: tablePage.pageSize,
                  });
                }
              } else {
                allTreeExpand();
              }
            },
          );
        }
      }

      //取得選中資料
      function getSelectEvent() {
        const $grid = xGrid.value;
        if ($grid) {
          const selectRecords = $grid.getCheckboxRecords();
          context.emit('getSelectRecords', selectRecords);
        }
      }

      //分頁-點擊切換頁面
      function handlePageChange({ currentPage, pageSize }) {
        context.emit('handlePageChange', { currentPage, pageSize });
        tablePage.currentPage = currentPage;
        tablePage.pageSize = pageSize;

        //設定顯示的數據
        const $grid = xGrid.value;
        const list = tableData.data;
        if (tablePage.total != 0) {
          const data = list.slice(
            (tablePage.currentPage - 1) * tablePage.pageSize,
            tablePage.currentPage * tablePage.pageSize,
          );
          if ($grid) {
            $grid.loadData(data);
            gridOptions.seqConfig.startIndex = (tablePage.currentPage - 1) * tablePage.pageSize; //序號
            allTreeExpand();
          }
        }
      }

      //cell click
      //show modal
      function showDetail(row, column, seq) {
        if (column.field !== 'checkbox') {
          if (column.field !== '"checkbox"') {
            context.emit(
              'show-modal',
              cloneDeep(row),
              cloneDeep(column),
              cloneDeep(seq),
              cloneDeep(tablePage),
              props.buttonName,
            );
          }
        }
      }
      //拿表格資料
      function getTableData() {
        const $grid = xGrid.value;
        if ($grid) {
          const data = $grid.getTableData();
          return data;
        } else {
          return {};
        }
      }

      // 編輯按鈕
      function editRowEvent(row) {
        const $grid = xGrid.value;
        if ($grid) {
          $grid.setEditRow(row);
          // context.emit('edit-row', row);
        }
      }

      // 取消編輯
      function cancelEditEvent(row) {
        const $grid = xGrid.value;
        if ($grid) {
          $grid.clearEdit(row);
          $grid.revertData(row);
        }
      }

      // 保存按鈕
      const saveRowEvent = async (row: any) => {
        const $grid = xGrid.value;
        if ($grid) {
          await $grid.clearEdit();
          gridOptions.loading = true;
          context.emit('save-row', cloneDeep(row));
          // 模拟异步保存
          setTimeout(() => {
            gridOptions.loading = false;
            VXETable.modal.message({ content: '保存成功！', status: 'success' });
          }, 300);
        }
      };

      // 刪除按鈕
      const removeRowEvent = async (row: any) => {
        const type = await VXETable.modal.confirm('您确定要删除该紀錄?');
        const $grid = xGrid.value;
        if ($grid) {
          if (type === 'confirm') {
            context.emit('delete-item', cloneDeep(row));
            await $grid.remove(row);
          }
        }
      };

      // 勾選後下方取消按鈕
      function clearCheckboxRow() {
        const $grid = xGrid.value;
        if ($grid) $grid.clearCheckboxRow();
      }

      // 離開隊伍按鈕
      function leaveTeamBtn(row) {
        console.log('子層leaveTeamBtn', row);
        context.emit(
          'leave-team',
          cloneDeep(row),
          // cloneDeep(column),
          cloneDeep(tablePage),
          // props.buttonName,
        );
      }

      //樹狀表格-展開所有單元格
      function allTreeExpand() {
        const $grid = xGrid.value;
        if ($grid) $grid.setAllTreeExpand(props.isTreeExpand);
      }
      //筛选
      // function filterChangeEvent() {
      //   nextTick(() => {
      //     const keywords = cloneDeep(props.searchData);
      //     let list = cloneDeep(tableData.dataSource);
      //     if (keywords.length > 0) {
      //       for (const item of keywords) {
      //         if (item.formula === 'equal') {
      //           list = list.filter((x) => {
      //             return x[item.field] === item.value;
      //           });
      //         } else {
      //           list = list.filter((x) => {
      //             return x[item.field].indexOf(item.value) > -1;
      //           });
      //         }
      //       }
      //       reloadData(list);
      //     }
      //   });
      // }

      //重載table data
      // function reloadData(list) {
      //   const data = cloneDeep(list);
      //   const $grid = xGrid.value;

      //   tablePage.currentPage = 1;
      //   tablePage.total = list.length;
      //   tableData.data = data;

      //   if ($grid) {
      //     Promise.all([$grid.reloadData(data)]).then(() => {
      //       handlePageChange({
      //         currentPage: tablePage.currentPage,
      //         pageSize: tablePage.pageSize,
      //       });
      //     });
      //   }
      // }
      onMounted(() => {
        //列設置
        if (props.isToolbarCustom) {
          gridOptions.toolbarConfig = {
            custom: true,
          };
        }
        //自定义插槽模板
        if (props.isLeftToolbar) {
          if (!props.isToolbarCustom) {
            gridOptions.toolbarConfig = {
              slots: { buttons: 'left_toolbar' },
            };
          } else {
            gridOptions.toolbarConfig.slots = { buttons: 'left_toolbar' };
          }
        }
      });

      //排序
      function tableSort({ field, order }) {
        let list = cloneDeep(tableData.dataSource);
        if (order) {
          list = XEUtils.orderBy(list, [[field, order]]);
        }

        //設定顯示的數據
        const $grid = xGrid.value;
        if (tablePage.total != 0) {
          const data = list.slice(
            (tablePage.currentPage - 1) * tablePage.pageSize,
            tablePage.currentPage * tablePage.pageSize,
          );
          if ($grid) $grid.loadData(data);
        }
      }
      /*=========data=========*/

      return {
        t,
        xGrid,
        tableData,
        gridOptions,
        loadData,
        getSelectEvent,
        showDetail,
        tableSort,
        //filterChangeEvent,

        //分頁
        tablePage,
        handlePageChange,

        //動作列
        editRowEvent,
        cancelEditEvent,
        removeRowEvent,
        saveRowEvent,
        clearCheckboxRow,
        getTableData,
        leaveTeamBtn,
      };
    },
  });
</script>
<style>
  .vxe-pager .vxe-pager--btn-icon,
  .vxe-pager .vxe-pager--jump-icon {
    border-color: #606266;
  }
</style>
