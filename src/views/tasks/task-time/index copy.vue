<!-- 定时任务  -->
<template>
  <div>
    <DxDataGrid
      ref="dataGrid"
      :data-source="dataSource"
      key-expr="jodid"
      @toolbar-preparing="onToolbarPreparing"
      @editing-start="editingStart"
      @selection-changed="onSelectionChanged"
    >
      <DxEditing
        mode="popup"
        :allow-adding="true"
        :allow-deleting="true"
        :allow-updating="true"
        :start-edit-action="'dbClick'"
        v-model:changes="changes"
        :select-text-on-edit-start="true"
      >
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
                <a
                  href="http://www.html580.com/tool/quartz/index.html"
                  target="_blank"
                  style="vertical-align: -webkit-baseline-middle;"
                >参考地址</a>
              </template>
            </DxSimpleItem>
          </DxItem>
          <DxItem :col-span="2" :col-count="2" data-field="description" />
          <DxItem data-field="task_way" :col-span="2" />
          <DxItem
            :col-count="1"
            :col-span="2"
            item-type="group"
            :visible="tempType == 'local'"
            caption="本地任务详情"
          >
            <DxItem data-field="task_ways.local_type" :col-span="2" />
            <DxItem data-field="task_ways.description" />
            <DxItem data-field="task_ways.local_path" :col-span="2" />
            <DxItem data-field="task_ways.local_params" :col-span="2" />
          </DxItem>
          <DxItem
            :col-count="1"
            :col-span="2"
            item-type="group"
            :visible="tempType == 'restful'"
            caption="Restful任务详情"
          >
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

      <DxColumn
        data-field
        caption="日志记录"
        :allow-filtering="false"
        cell-template="taskTemplate"
        :width="90"
      />
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
      <template #taskTemplate="{ data }">
        <div class="task-a text-center" @click="toggleTaskDetailVisble(data.key)">
          <a>查看</a>
        </div>
      </template>
      <template #statusTemplate="{ data }">
        <div :class="'status text-' + data.value">{{ data.text }}</div>
      </template>
    </DxDataGrid>
    <!---日志记录-->
    <Popup
      :width="900"
      :height="400"
      :show-title="true"
      :close-on-outside-click="true"
      v-model:visible="taskDetailVisible"
      position="center"
      title="执行记录"
    >
      <LogDetail :paramaid="selData.jobid" type="time" />
    </Popup>
  </div>
</template>

<script>
import DxDataGrid from '@/dev/DxDataGrid.vue'
import { DxColumn, DxLookup, DxPopup, DxEditing, DxForm } from 'devextreme-vue/data-grid'
import { DxItem, DxSimpleItem } from 'devextreme-vue/form'
import { DxPopup as Popup } from 'devextreme-vue/popup'
import { createStore } from "devextreme-aspnet-data-nojquery"
import { computed, reactive, ref, watch, onMounted } from 'vue'
import LogDetail from '../components/LogDetail.vue'
import notify from 'devextreme/ui/notify';
import { resumejob, stopjob } from '@/api/task'
import { getCurrentInstance } from 'vue'
export default {
  setup() {
    const statusArr = [{ value: "offline", text: "离线", editable: false }, { value: "normal", text: "正常", editable: true }, { value: "suspend", text: "暂停", editable: true }, { value: "abnormal", text: "异常", editable: false }]
    const task_ways = [{ value: "local", text: "本地任务" }, { value: "restful", text: "Restful任务" }]
    const local_types = [{ value: "dll", text: "dll" }, { value: "exe", text: "exe" }]
    const taskDetailVisible = ref(false);
    var selData = reactive({ jobid: null })
    const type = ref("")
    const statusId = ref(0)
    const editRowKey = ref(0);//编辑的key
    const height = ref(0)//dataGrid的高度
    const popoverVisible = ref(false)
    const colorPriority = ref(statusArr[0].value)
    const params = reactive({ "tenant": 'aaa' })
    // const store = useStore()
    // console.log(store);
    const changes = ref([])
    const tempType = ref("")
    const statusValue = ref("")
    const dataGrid = ref();// dataGrid 表格数据实例
    const internalInstance = getCurrentInstance()
    let $url = internalInstance.appContext.config.globalProperties.$appInfo.$http
    const url = `${$url}/api/timedtask`;
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
            onValueChanged: function(data) {
              params.tenant = data.value;
              // 执行刷新
              dataGrid.value.instance.refresh()
              dataGrid.value.instance.clearSelection()
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
              handelStatus("normal")
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
            handelStatus("suspend")
          },
        },
      }
      )
    }

    onMounted(
      window.onresize = function() {
        height.value = window.innerHeight - 150
      }
    )


    function toggleTaskDetailVisble(key, value = "local") {
      selData.jobid = key
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
    // 处理编辑时的任务方式
    function editingStart(res) {
      tempType.value = res.data.task_way
    }
    // 
    function handelStatus(type) {
      let fn = type === "normal" ? resumejob : stopjob
      if (!selData.jobid) {
        return notify({
          message: "请先选中后一条数据后再操作",
          position: {
            my: 'center center',
            at: 'center center'
          },
          width: 200
        }, 'error', 2000);
      }
      if ((type === "normal" && ["offline", "suspend"].indexOf(selData.status) < 0)) {
        return notify({
          message: "非离线状态或暂停不可执行恢复操作",
          position: {
            my: 'center center',
            at: 'center center'
          },
          width: 200
        }, 'error', 2000);
      }
      if (type === "suspend" && selData.status !== 'normal') {
        return notify({
          message: "非正常状态不可执行暂停操作",
          position: {
            my: 'center center',
            at: 'center center'
          },
          width: 200
        }, 'error', 2000);
      }
      var formData = new FormData()
      formData.append("key", selData.jobid)
      fn(formData).then((res) => {
        notify({
          message: res.message,
          position: {
            my: 'center center',
            at: 'center center'
          },
          width: 200
        }, 'success', 2000);
        dataGrid.value.instance.refresh()
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


    watch(getTaskType, (newVal) => {
      tempType.value = newVal
    })
    // 选中的data
    const onSelectionChanged = function({ selectedRowsData }) {
      selData = selectedRowsData[0];
    }


    return {
      dataGrid,//dataGrid 实例
      dataSource,
      task_ways,
      statusId,
      type,
      statusArr,
      pageSizes: [5, 10, 20],
      taskDetailVisible,
      popoverVisible,
      editRowKey,
      selData,
      height,

      changes,
      tempType,
      local_types,
      colorPriority,
      statusText,
      statusValue,
      radioTemplate,

      editingStart,
      toggleTaskDetailVisble,
      onSelectionChanged,
      onToolbarPreparing,
    }
  },
  components: {
    DxDataGrid,
    DxPopup,
    DxItem,
    DxSimpleItem,
    DxColumn,
    DxLookup,
    DxEditing,
    DxForm,
    Popup,
    // DxTextArea,
    // DPopup,
    LogDetail
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
.status {
  text-align: center;
}
.text-normal {
  color: #5cb85c;
}
.text-suspend {
  color: #eb6c55;
}
.text-error {
  color: #f70a02;
}
</style>>
