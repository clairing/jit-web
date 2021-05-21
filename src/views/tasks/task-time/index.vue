<!-- 定时任务  -->
<template>
  <div>
    <DxDataGrid ref="dataGrid" :data-source="dataSource" :height="500" key-expr="jodid" :show-column-lines="true"
      :show-row-lines="true" :show-borders="true" :row-alternation-enabled="true" :focused-row-enabled="true"
      :column-auto-width="true" :column-hiding-enabled="false" :column-fixing="{ enabled: true }"
      :repaint-changes-only="true" @toolbar-preparing="onToolbarPreparing" @content-ready="onContentReady"
      @editing-start="editingStart" :grouping="{ autoExpandAll: true }" :group-panel="{ visible: false }" :scrolling="{
        showScrollbar: 'always',
        useNative: false
      }" :column-resizing-mode="'widget'">
      <DxPaging :page-size="10" />
      <DxEditing mode="popup" :allow-adding="true" :allow-deleting="true" :allow-updating="true"
        :start-edit-action="'dbClick'" v-model:changes="changes" :select-text-on-edit-start="true">
        <DxPopup :show-title="true" :width="800" :height="675" :title="'定时任务信息'" />
        <DxForm>
          <DxItem data-field="tenant" :col-span="2" />
          <DxItem data-field="appid" :col-span="2" />
          <DxItem :col-count="1" :col-span="2" item-type="group">
            <DxItem data-field="job_name" />
            <DxItem data-field="job_group" />
          </DxItem>
          <DxItem :col-count="2" :col-span="2" item-type="group">
            <DxItem data-field="interval" />
            <DxSimpleItem>
              <template #default>
                <a href="http://www.html580.com/tool/quartz/index.html" target="_blank"
                  style="vertical-align: -webkit-baseline-middle;">参考地址</a>
              </template>
            </DxSimpleItem>
          </DxItem>
          <DxItem :col-span="2" :col-count="2" data-field="description" />
          <DxItem data-field="task_way" :col-span="2" />
          <DxItem :col-count="1" :col-span="2" item-type="group" :visible="tempType == 'local'" caption="本地任务详情">
            <DxItem data-field="task_ways.local_type" :col-span="2" />
            <DxItem data-field="task_ways.description" />
            <DxItem data-field="task_ways.local_path" :col-span="2" />
            <DxItem data-field="task_ways.local_params" :col-span="2" />
          </DxItem>
          <DxItem :col-count="1" :col-span="2" item-type="group" :visible="tempType == 'restful'" caption="Restful任务详情">
            <DxItem data-field="task_ways.restful_apiurl" :col-span="2" />
            <DxItem data-field="task_ways.restful_header" :col-span="2" />
            <DxItem data-field="task_ways.description" :col-span="2" />
            <DxItem data-field="task_ways.restful_params" :col-span="2" />
            <DxItem data-field="task_ways.restful_method" :col-span="2" />
          </DxItem>
        </DxForm>
      </DxEditing>

      <DxPager :show-page-size-selector="true" :show-info="true" :allowed-page-sizes="pageSizes" />
      <DxColumn data-field="job_name" caption="作业名称" :allow-filtering="false" :width="150" />
      <DxColumn data-field="job_group" caption="作业组" />
      <DxColumn data-field="task_way" caption="任务方式">
        <DxLookup :data-source="task_ways" value-expr="value" display-expr="text" />
      </DxColumn>
      <DxColumn data-field="interval" caption="间隔" :allow-filtering="false" :width="150" />
      <DxColumn data-field="status" caption="状态" cell-template="statusTemplate">
        <DxLookup value-expr="value" display-expr="text" :data-source="statusArr" />
      </DxColumn>
      <DxColumn data-field="tenant" caption="租户" :visible="false" />
      <DxColumn data-field="appid" caption="应用id" :visible="false" />
      <DxColumn data-field="description" caption="描述" />

      <DxColumn data-field caption="执行记录" :allow-filtering="false" cell-template="taskTemplate" />
      <DxColumn data-field="task_ways.local_type" caption="类型" :visible="false">
        <DxLookup value-expr="value" display-expr="text" :data-source="local_types" />
      </DxColumn>
      <DxColumn data-field="task_ways.local_path" caption="本地地址" :visible="false" />
      <DxColumn data-field="task_ways.local_params" caption="参数" :visible="false" />
      <DxColumn data-field="task_ways.restful_apiurl" caption="ApiUrl" :visible="false" />
      <DxColumn data-field="task_ways.restful_header" caption="header参数" :visible="false" />
      <DxColumn data-field="task_ways.restful_params" caption="参数" :visible="false" />
      <DxColumn data-field="task_ways.restful_method" caption="请求方式" :visible="false" />
      <DxColumn data-field="task_ways.description" caption="任务描述" :visible="false" />
      <DxFilterRow :visible="true"></DxFilterRow>
      <template #taskTemplate="{ data }">
        <div class="task-a text-center" @click="toggleTaskDetailVisble(data.key)">查看</div>
      </template>>
      <!-- 状态 -->
      <template #statusTemplate="{ data }">
        <div class="command-a text-center" :class="data.value" :id="'tmp' + data.key">
          <a @click="handelStatus(data.key, data.value)">{{ data.text }}</a>
        </div>
      </template>>
    </DxDataGrid>
    <!-- 必须用v-model:visibel,否则点击多次 -->
    <Popup :width="900" :height="400" :show-title="true" :close-on-outside-click="true"
      v-model:visible="taskDetailVisible" position="ceter" title="执行记录">
      <recordDetail :jodid="jodid" :type="type"></recordDetail>
    </Popup>

    <DxPopover :width="200" v-model:visible="popoverVisible" :target="'#tmp' + statusId" position="top"
      :id="'pop' + statusId">
      <div class="dx-field">
        <div class="dx-field-value">
          <div id="radio-group-with-template">
            <div :class="statusValue">
              <DxRadioGroup :items="statusText" v-model:value="statusValue" @valueChanged="changeSelectionPriority"
                :itemTemplate="radioTemplate" />
            </div>
          </div>
        </div>
      </div>
    </DxPopover>
  </div>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxLookup,
  DxPaging,
  DxPager,
  DxPopup,
  DxEditing,
  DxFilterRow,
  DxForm,
} from 'devextreme-vue/data-grid'
import { DxItem, DxSimpleItem } from 'devextreme-vue/form'
import { DxPopup as Popup } from 'devextreme-vue/popup'
import { DxPopover } from 'devextreme-vue/popover'
import DxRadioGroup from 'devextreme-vue/radio-group'
import { createStore } from "devextreme-aspnet-data-nojquery"
import { computed, reactive, ref, watch } from 'vue'
import RecordDetail from '../components/TimeTaskDetail.vue'
import notify from 'devextreme/ui/notify';
import request from '@/utils/request'
import { resumejob } from '@/api/task'
export default {
  setup() {

    const statusArr = [{ value: "offline", text: "离线", editable: false }, { value: "normal", text: "正常", editable: true }, { value: "pause", text: "暂停", editable: true }, { value: "error", text: "异常", editable: false }]
    const task_ways = [{ value: "local", text: "本地任务" }, { value: "restful", text: "Restful任务" }]
    const local_types = [{ value: "dll", text: "dll" }, { value: "exe", text: "exe" }]
    const taskDetailVisible = ref(false);
    const jobid = ref(0)
    const type = ref("")
    const statusId = ref(0)
    const editRowKey = ref(0);
    const popoverVisible = ref(false)
    const colorPriority = ref(statusArr[0].value)
    const params = reactive({ "tenant": 'aaa' })
    // const store = useStore()
    // console.log(store);
    const changes = ref([])
    const tempType = ref("")
    const statusValue = ref("")
    const dataGrid = ref();// dataGrid 表格数据实例
    const url = "http://192.168.1.106:8050/api/timedtask"
    const dataSource = createStore({
      key: "jobid",
      loadUrl: `${url}/get`,
      loadParams: params,
      insertUrl: `${url}/post`,
      updateUrl: `${url}/put`,
      deleteUrl: `${url}/delete`,
      onBeforeSend: (method, ajaxOptions) => {
        ajaxOptions.xhrFields = { withCredentials: false }
      }
    })
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
              // 执行刷新
              console.log(e.value);
              dataGrid.value.instance.refresh()
            },
          },
        },
        {
          location: 'before',
          widget: 'dxButton',
          options: {
            width: 120,
            type: 'success',
            icon: 'link',
            text: '恢复正常',
            onClick: () => {
              console.log(params);
            },
          },
        }, {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 120,
          type: 'default',
          icon: 'video',
          text: '暂停',
          onClick: () => {
            console.log(params);
          },
        },
      }
      )
    }
    // 初始化
    function onContentReady() {
      document.querySelector(".dx-datagrid-headers .dx-datagrid-table .dx-header-row .dx-command-edit").innerText = "操作"
      document.querySelector(".dx-freespace-row").style.height = 0
    }

    function toggleTaskDetailVisble(key, value = "local") {
      jobid.value = key
      type.value = value
      taskDetailVisible.value = !taskDetailVisible.value
    }

    const statusText = computed(() => {
      return statusArr.filter(item => item.editable).map(item => item.value)
    })
    const getTaskType = computed(() => {
      return changes.value[0]?.data?.task_way ?? null
    })

    // radio 模板
    function radioTemplate(itemData, _, itemElement) {
      itemElement.innerText = statusArr.filter(item => item.value == itemData)[0].text
    }
    function editingStart(res) {
      tempType.value = res.data.task_way
    }
    // 
    function handelStatus(key, value) {
      statusId.value = key
      popoverVisible.value = true
      statusValue.value = value

    }


    watch(getTaskType, (newVal) => {
      tempType.value = newVal
    })
    // 修改状态
    const onSelectionChanged = function ({ selectedRowsData }) {
      const data = selectedRowsData[0];
      jobid.value = data.jodid
      request
    }

    const changeSelectionPriority = function (e) {
      popoverVisible.value = false
      // statusValue.value = status.filter(item => item.val == val)
      status,
        console.log(e);
      resumejob({ "key": jobid }).then((response) => {
        const { data } = response
        console.log(data);
        notify({
          message: data.message,
          position: {
            my: 'center center',
            at: 'center center'
          },
          width: 200
        }, 'success', 2000);

      }).catch(error => {
        notify({
          message: error.message,
          position: {
            my: 'center center',
            at: 'center center'
          },
          width: 200
        }, 'error', 2000);
      })
    }
    return {
      dataSource,
      task_ways,
      jobid,
      statusId,
      type,
      statusArr,
      pageSizes: [5, 10, 20],
      taskDetailVisible,
      popoverVisible,
      editRowKey,

      changes,
      tempType,
      local_types,
      colorPriority,
      statusText,
      statusValue,
      radioTemplate,
      onContentReady,
      editingStart,
      toggleTaskDetailVisble,
      onSelectionChanged,
      onToolbarPreparing,
      changeSelectionPriority,
      handelStatus,
    }
  },
  components: {
    DxDataGrid,
    DxPopup,
    DxItem,
    DxSimpleItem,
    DxColumn,
    DxLookup,
    DxPaging,
    DxPager,
    DxEditing,
    DxFilterRow,
    DxForm,
    Popup,
    DxPopover,
    DxRadioGroup,
    // DxTextArea,
    // DPopup,
    RecordDetail
  }
}
</script>

<style lang="scss" scoped>
.task-a {
  a {
    display: block;
    width: 100%;
    cursor: pointer;
  }
}
.dx-row-focused {
  .task-a {
    color: #fff;
  }
  a {
    color: #fff;
  }
}
.text-center {
  text-align: center;
}
.dx-field-value-static,
.dx-field-value:not(.dx-switch):not(.dx-checkbox):not(.dx-button) {
  width: 75%;
}
</style>>
