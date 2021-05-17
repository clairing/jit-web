<template>
  <div>
    <DxDataGrid :data-source="dataSource" :height="600" ref="dataGrid" key-expr="tpid" :show-column-lines="true"
      :show-row-lines="true" :show-borders="true" :row-alternation-enabled="true" :focused-row-enabled="true"
      :column-auto-width="true" :column-hiding-enabled="true" :repaint-changes-only="true" :grouping="{
        autoExpandAll: false,
      }" :group-panel="{ visible: false }" @content-ready="onContentReady" @toolbar-preparing="onToolbarPreparing"
      :scrolling="{
        showScrollbar: 'always',
        useNative: false,
      }" :column-resizing-mode="'widget'" :column-fixing="{ enabled: true }">
      <DxPaging :page-size="10" />
      <DxEditing mode="popup" :allow-adding="true" :allow-deleting="true" :allow-updating="true">
        <DxPopup :show-title="true" :width="800" :height="625" :title="'调度任务信息'" />
        <DxForm>
          <DxItem data-field="tenant" :col-count="1" :col-span="2" />
          <DxItem :col-count="1" :col-span="2" item-type="group">
            <DxItem data-field="need_download" />
          </DxItem>
          <DxItem :col-count="1" :col-span="2" item-type="group">
            <DxSimpleItem>
              <template #default>
                <div class="line"></div>
              </template>
            </DxSimpleItem>
          </DxItem>
          <DxItem :col-count="2" :col-span="2" item-type="group">
            <DxItem data-field="need_callback" />
            <DxItem data-field="callback_path" />
            <DxItem data-field="callback_params" :col-span="2" />
          </DxItem>
          <DxItem :col-count="1" :col-span="2" item-type="group">
            <DxSimpleItem>
              <template #default>
                <div class="line"></div>
              </template>
            </DxSimpleItem>
          </DxItem>
          <DxItem :col-count="2" :col-span="2" item-type="group">
            <DxItem data-field="need_notice" />
            <DxItem data-field="notice_email" />
            <DxItem data-field="notice_phone" />
            <DxItem data-field="notice_siteemail" />
          </DxItem>
          <DxItem :col-count="1" :col-span="2" item-type="group">
            <DxSimpleItem>
              <template #default>
                <div class="line"></div>
              </template>
            </DxSimpleItem>
          </DxItem>
          <DxItem data-field="src" />
          <DxItem data-field="interval" />
          <DxItem data-field="description" />
          <DxItem data-field="status" />
          <DxItem data-field="job_progress" />
          <DxItem data-field="creation_time" />
          <DxItem data-field="start_time" />
          <DxItem data-field="end_time" />
        </DxForm>
      </DxEditing>
      <!-- :selection="{ mode: 'single' }" :focused-row-index="0"      @selection-changed="onSelectionChanged" -->
      <DxPaging :page-size="10" />
      <DxPager :show-page-size-selector="true" :show-info="true" :allowed-page-sizes="pageSizes" />
      <!-- <DxColumn data-field="job_name" caption="任务类型" :allow-filtering='false' /> -->
      <DxColumn data-field="need_download" caption="下载" data-type="boolean" width="100"
        header-cell-template="headerCellTemplate"></DxColumn>
      <DxColumn data-field="need_callback" caption="回执" width="100" data-type="boolean"
        header-cell-template="headerCellTemplate"></DxColumn>
      <DxColumn data-field="need_notice" caption="通知" width="100" data-type="boolean"
        header-cell-template="headerCellTemplate"></DxColumn>
      <DxColumn data-field="status" :width="150" caption="状态" :allow-editing="false" cell-template="statusTemplate">
        <DxLookup value-expr="value" display-expr="text" :data-source="status" />
      </DxColumn>
      <DxColumn data-field="tenant" caption="租户" :visible="false" />
      <DxColumn data-field="download_path" caption="下载地址" :visible="false" />
      <DxColumn data-field="callback_path" caption="回执地址" :visible="false" />
      <DxColumn data-field="callback_params" caption="回执参数" :visible="false" />
      <DxColumn data-field="notice_siteemail" caption="站内信" :visible="false" />
      <DxColumn data-field="notice_email" caption="邮件" :visible="false" />
      <DxColumn data-field="notice_phone" caption="短信" :visible="false" />
      <DxColumn data-field="src" caption="来源" />
      <DxColumn data-field="interval" caption="任务名" :allow-filtering="false" />
      <DxColumn data-field="description" caption="任务描述" width="15%" />
      <DxColumn data-field="job_progress" caption="进度" />
      <DxColumn data-field="creation_time" caption="任务下派时间" :allow-editing="false" format="yyyy-MM-dd HH:mm:ss" />
      <DxColumn data-field="start_time" caption="任务开始时间" :allow-editing="false" format="yyyy-MM-dd hh:mm:ss" />
      <DxColumn data-field="end_time" caption="任务完成时间" :allow-editing="false" format="yyyy-MM-dd hh:mm:ss" />
      <DxColumn data-field caption="执行记录" :allow-filtering="false" cell-template="logTemplate" />
      <DxColumn data-field caption="查看结果" :allow-filtering="false" cell-template="downloadResultTemplate" width="120" />
      <DxFilterRow :visible="true"></DxFilterRow>
      <!-- 查看结果 -->
      <!-- 当需要下载的时候，才可以查看 -->
      <template #downloadResultTemplate="{ data }">
        <div class="task-a text-center" @click="toggleTaskDetailVisble(data.key)" v-if="data.data.need_download">查看
        </div>
      </template>
      <!-- 查询日志 -->
      <template #logTemplate="{ data }">
        <div class="task-a text-center" @click="toggleTaskDetailVisble(data.key)">查看
        </div>
      </template>
      <!-- 状态结果 -->
      <template #statusTemplate="{ data }">
        <div class="task-a text-center" :id="'tmp' + data.key" @click="handelStatus(data.key, data.value)">
          {{ data.text }}</div>
      </template>
      <!-- 头部标题模板 -->
      <template #headerCellTemplate="{ data }">
        <div class="text-center" :title="
            data.column.name == 'need_download'
              ? '是否需要下载'
              : data.column.name == 'need_callback'
                ? '是否需要回执'
                : '是否需要通知'
          ">
          {{
            data.column.name == 'need_download'
              ? '下载'
              : data.column.name == 'need_callback'
                ? '回执'
                : '通知'
          }}
        </div>
      </template>
    </DxDataGrid>
    <!-- 必须用v-model:visbel,否则点击多次 -->
    <Popup :width="800" :height="300" :show-title="true" :close-on-outside-click="true"
      v-model:visible="taskDetailVisible" position="center" title="任务详情">
      <TimeTaskDetail :jodid="tpid" :type="type"></TimeTaskDetail>
    </Popup>
    <DxPopover :width="200" v-model:visible="popoverVisible" :target="'#tmp' + statusId" position="top"
      :close-on-outside-click="true">
      <div class="dx-field">
        <div class="dx-field-value">
          <div id="radio-group-with-template">
            <div>
              <DxRadioGroup :items="statusText" v-model:value="statusValue" :itemTemplate="radioTemplate"
                @valueChanged="handelRadioChange" />
            </div>
          </div>
        </div>
      </div>
    </DxPopover>
  </div>
</template>
{{ statusValue }}
<script>
import {
  DxDataGrid,
  DxColumn,
  DxLookup,
  DxPopup,
  DxPaging,
  DxPager,
  DxEditing,
  DxForm,
  DxFilterRow,
} from 'devextreme-vue/data-grid';
import { DxItem, DxSimpleItem } from 'devextreme-vue/form';
import { DxPopup as Popup } from 'devextreme-vue/popup';
import { DxPopover } from 'devextreme-vue/popover';
import DxRadioGroup from 'devextreme-vue/radio-group';
// import { createStore } from "devextreme-aspnet-data-nojquery"
// // const url = "https:"
// const dataSource = createStore({
//   key: "jodid",
//   loadUrl: `/time-task.json`,
//   onBeforeSend: (method, ajaxOptions) => {
//     ajaxOptions.xhrFields = { withCredentials: true };
//   }
// })
import { data } from './time-task';
import { ref, computed, onMounted, reactive } from 'vue';
import TimeTaskDetail from '../components/TimeTaskDetail.vue';

export default {
  setup() {
    const status = [
      { value: 'pending', text: '等待处理', editable: false },
      { value: 'inprocess', text: '处理中', editable: true },
      { value: 'pause', text: '暂停', editable: true },
      { value: 'complele', text: '任务完成', editable: false },
      { value: 'error', text: '异常', editable: false },
    ];
    const taskDetailVisible = ref(false);
    let params = reactive({ tenant: "", bdate: '', edate: '', status: '' });
    const tpid = ref(0);
    const type = ref('');
    const statusId = ref(1);
    const popoverVisible = ref(false);
    const statusValue = ref('');
    // const gridRefName = ref("dataGrid")
    const dataGrid = ref();
    var dataSource = ref(data.data);
    const statusText = computed(() => {
      return status.filter((item) => item.editable).map((item) => item.value);
    });

    // 头部工具栏
    function onToolbarPreparing(e) {
      e.toolbarOptions.items.unshift(
        {
          location: 'before',
          widget: 'dxSelectBox',
          options: {
            width: 200,
            searchEnabled: true,
            // items: status,
            displayExpr: 'text',
            valueExpr: 'value',
            placeholder: '请选择租户',
            value: 'status',
            onValueChanged: function (data) {
              params.tenant = data.value;
              refreshDataGrid();
              console.log(e.value);
            },
          },
        },
        {
          location: 'before',
          widget: 'dxDateBox',
          options: {
            type: 'date',
            // value: new Date(),
            placeholder: '开始时间',
            displayFormat: 'yyyy-MM-dd',
            onValueChanged: function (data) {
              console.log(data.value);
              params.bdate = dateFormat(data.value);
            },
          },
        },
        {
          location: 'before',
          widget: 'dxDateBox',
          options: {
            type: 'date',
            // value: new Date(),
            placeholder: '结束时间',
            displayFormat: 'yyyy-MM-dd',
            onValueChanged: function (data) {
              params.edate = dateFormat(data.value);
            },
          },
        },
        {
          location: 'before',
          widget: 'dxSelectBox',
          options: {
            width: 200,
            items: status,
            displayExpr: 'text',
            valueExpr: 'value',
            placeholder: '请选择状态',
            value: 'status',
            onValueChanged: function (data) {
              params.status = data.value;
              refreshDataGrid();
              console.log(e.value);
            },
          },
        },
        {
          location: 'before',
          widget: 'dxButton',
          options: {
            width: 86,
            type: 'default',
            icon: 'search',
            text: '查询',
            onClick: () => {
              console.log(params);
            },
          },
        }
      );
    }
    onMounted(() => {
      console.log(dataGrid.value); //当前dom元素
    });

    function dateFormat(date) {
      return (
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      );
    }
    // 根据下拉选择刷新dataGrid
    function refreshDataGrid() {
      // dataSource.value = []
      dataGrid.value.instance.refresh();
    }
    function radioTemplate(itemData, _, itemElement) {
      itemElement.innerText = status.filter(
        (item) => item.value == itemData
      )[0].text;
    }
    function toggleTaskDetailVisble(key, value) {
      tpid.value = key;
      type.value = value;
      console.log(value);
      taskDetailVisible.value = !taskDetailVisible.value;
    }

    function handelStatus(key, value) {
      statusId.value = key;
      statusValue.value = value;
      popoverVisible.value = true;
    }

    function handelRadioChange(e) {
      console.log(e.value);
      popoverVisible.value = false;
    }
    function onContentReady() {
      document.querySelector(
        '.dx-datagrid-headers .dx-datagrid-table .dx-header-row .dx-command-edit'
      ).innerText = '操作';
      document.querySelector('.dx-freespace-row').style.height = 0;
    }

    return {
      dataGrid,
      dataSource,
      status,
      tpid,
      type,
      statusId,
      pageSizes: [5, 10, 20],
      taskDetailVisible,
      popoverVisible,
      radioTemplate,
      statusText,
      statusValue,

      refreshDataGrid,
      toggleTaskDetailVisble,
      onToolbarPreparing,
      handelStatus,
      handelRadioChange,
      onContentReady,
      // onSelectionChanged,
    };
  },
  components: {
    DxDataGrid,
    DxPopup,
    DxEditing,
    DxColumn,
    DxLookup,
    DxPaging,
    DxPager,
    DxItem,
    DxSimpleItem,
    DxForm,
    DxRadioGroup,
    Popup,
    DxPopover,
    DxFilterRow,
    TimeTaskDetail,
  },
};
</script>

<style lang="scss" scoped>
.task-a {
  text-decoration: underline;
  cursor: pointer;
}
.dx-row-focused {
  .task-a {
    color: #fff;
  }
}
.dx-item .line {
  height: 1px;
  background: #ddd;
}
.dx-field-value:not(.dx-switch):not(.dx-checkbox):not(.dx-button) {
  width: 75%;
}
.text-center {
  min-width: 80px;
}
</style
>>
