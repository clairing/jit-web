<!-- 定时任务  -->
<template>
  <div>
    <DxDataGrid :data-source="dataSource" :height=600 key-expr="jodid" :show-borders="true" :focused-row-enabled="true"
      :column-auto-width="true" :column-hiding-enabled="true" :repaint-changes-only="true"
      @editing-start="editingStart">
      <!-- :selection="{ mode: 'single' }" :focused-row-index="0"   :remote-opertaton="true"  @toolbar-preparing="onToolbarPreparing($event)   @selection-changed="onSelectionChanged"  :selected-row-keys="selectedItemKeys" @selection-changed="selectionChanged"-->
      <DxPaging :page-size="10" />
      <DxEditing mode="popup" :allow-adding="true" :allow-deleting="true" :allow-updating="true"
        v-model:changes="changes">
        <DxPopup :show-title="true" :width="800" :height="675" :title="'定时任务信息'" />
        <DxForm>
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
          <!-- <DxItem :col-count="1" :col-span="2" item-type="group">
            <DxSimpleItem>
              <template>
                <p class="divider"></p>
              </template>
            </DxSimpleItem>
          </DxItem> -->
          <DxItem data-field="task_way" :col-span="2" />
          <DxItem :col-count="1" :col-span="2" item-type="group" :visible="tempType=='local'" caption="本地任务详情">
            <DxItem data-field="local_type" :col-span="2" />
            <DxItem data-field="local_path" :col-span="2" />
            <DxItem data-field="local_params" :col-span="2" />
          </DxItem>
          <DxItem :col-count="1" :col-span="2" item-type="group" :visible="tempType=='restful'" caption="Restful任务详情">
            <DxItem data-field="restful_apiurl" :col-span="2" />
            <DxItem data-field="restful_header" :col-span="2" />
            <DxItem data-field="restful_params" :col-span="2" />
            <DxItem data-field="restful_method" :col-span="2" />
          </DxItem>
        </DxForm>
        <!-- <DxForm>
      </DxForm> -->
        <!-- <div></div> -->
      </DxEditing>

      <DxPager :show-page-size-selector="true" :show-info="true" :allowed-page-sizes="pageSizes" />
      <DxColumn data-field="job_name" caption="作业名称" :allow-filtering='false' />
      <DxColumn data-field="job_group" caption="作业组" />
      <DxColumn data-field="interval" caption="间隔" :allow-filtering='false' />
      <DxColumn data-field="status" caption="状态" cell-template="statusTemplate">
        <DxLookup value-expr="value" display-expr="text" :data-source="status" />
      </DxColumn>

      <DxColumn data-field="description" caption="描述" />
      <DxColumn data-field="task_way" caption="任务方式">
        <DxLookup :data-source="task_ways" value-expr="value" display-expr="text" />
      </DxColumn>
      <DxColumn data-field="" caption="执行记录" :width="100" :allow-filtering='false' cell-template="taskTemplate" />
      <DxColumn data-field="local_type" caption="类型" :visible="false">
        <DxLookup value-expr="value" display-expr="text" :data-source="local_types" />
      </DxColumn>
      <DxColumn data-field="local_path" caption="本地地址" :visible="false" />
      <DxColumn data-field="local_params" caption="参数" :visible="false" />
      <DxColumn data-field="restful_apiurl" caption="APIuRL" :visible="false" />
      <DxColumn data-field="restful_header" caption="header参数" :visible="false" />
      <DxColumn data-field="restful_params" caption="参数" :visible="false" />
      <DxColumn data-field="restful_method" caption="请求方式" :visible="false" />
      <!-- <DxColumn data-field="level" caption="级别"></DxColumn>
      <DxColumn data-field="appid" caption="应用"></DxColumn>
      <DxColumn data-field="tenant" caption="租户"></DxColumn>
      <DxColumn data-field="cby_time" data-type="date" caption="创建时间"></DxColumn>
      <DxColumn data-field="exec_time" data-type="date" caption="最后执行时间"></DxColumn>
      <DxColumn data-field="exec_status" caption="最后执行状态"></DxColumn> -->
      <!-- <DxColumn data-filed="" caption=""></DxColumn> -->
      <DxFilterRow :visible="true"></DxFilterRow>
      <template #taskTemplate="{data}">
        <div class="task-a text-center" @click="toggleTaskDetailVisble(data.key)">查看</div>
      </template>>
      <template #statusTemplate="{data}">
        <div class="task-a text-center" :class="data.value?data.value:'offline'" :id="'tmp'+data.key"><a
            @click="handelStatus(data.key,data.value?data.value:'offline')"
            @mouseleave="popoverVisible=false">{{data.text?data.text:'离线'}}</a>
        </div>
      </template>>
    </DxDataGrid>
    <!-- 必须用v-model:visibel,否则点击多次 -->
    <Popup :width="900" :height="400" :show-title="true" :close-on-outside-click="true"
      v-model:visible="taskDetailVisible" position="ceter" title="执行记录">
      <recordDetail :jodid="jodid" :type="type"></recordDetail>
    </Popup>

    <DxPopover :width="200" v-model:visible="popoverVisible" :target="'#tmp'+statusId" position="top"
      :id="'pop'+statusId">
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
    {{statusValue}}
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
// import { DxTextArea } from 'devextreme-vue/text-area';
import { DxPopup as Popup } from 'devextreme-vue/popup'
import { DxPopover } from 'devextreme-vue/popover'
import DxRadioGroup from 'devextreme-vue/radio-group';
// import { useStore } from 'vuex';
// import { createStore } from "devextreme-aspnet-data-nojquery"
// // const url = "https:"
// const dataSource = createStore({
//   key: "jodid",
//   loadUrl: `/time-task.json`,
//   onBeforeSend: (method, ajaxOptions) => {
//     ajaxOptions.xhrFields = { withCredentials: true };
//   }
// })
import { data } from './time-task'
import { computed, ref, watch } from 'vue'
import RecordDetail from '../components/TimeTaskDetail.vue'
var dataSource = data.data;
export default {
  setup() {
    const status = [{ value: "offline", text: "离线", editable: false }, { value: "normal", text: "正常", editable: true }, { value: "pause", text: "暂停", editable: true }, { value: "error", text: "异常", editable: false }]
    const task_ways = [{ value: "local", text: "本地任务" }, { value: "restful", text: "Restful任务" }]
    const local_types = [{ value: "dll", text: "dll" }, { value: "exe", text: "exe" }]
    const taskDetailVisible = ref(false);
    const jodid = ref(0)
    const type = ref("")
    const statusId = ref(0)
    const editRowKey = ref(0);
    const popoverVisible = ref(false)
    const colorPriority = ref(status[0].value)

    // const store = useStore()
    // console.log(store);
    const changes = ref([])
    const tempType = ref("")
    const statusValue = ref("")
    // const changes = computed({
    //   get() {
    //     return store.getters.changes;
    //   },
    //   set(value) {
    //     return store.dispatch("datagrid/setChanges", value)
    //   }
    // })
    const toggleTaskDetailVisble = function (key, value = "local") {
      jodid.value = key
      type.value = value
      taskDetailVisible.value = !taskDetailVisible.value
    }

    const statusText = computed(() => {
      return status.filter(item => item.editable).map(item => item.value)
    })
    const getTaskType = computed(() => {
      console.log(changes.value[0]?.data.task_way ?? null);
      return changes.value[0]?.data.task_way ?? null
    })
    // radio 模板
    const radioTemplate = function (itemData, _, itemElement) {
      itemElement.innerText = status.filter(item => item.value == itemData)[0].text
    }
    const editingStart = function (res) {
      tempType.value = res.data.task_way
    }
    const handelStatus = function (key, value) {
      statusId.value = key
      popoverVisible.value = true
      console.log(value);
      statusValue.value = value
    }
    const onToolbarPreparing = function (e) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxSelectBox',
        options: {
          width: 200,
          items: status,
          displayExpr: 'text',
          valueExpr: 'value',
          value: 'CustomerStoreState',
          onValueChanged: function (e) {
            console.log(e.value); console.log(jodid.value); setTimeout(() => {
              this.reset()
            }, 1000);
          }
        }
      })
    }
    watch(getTaskType, (newVal) => {
      console.log(newVal);
      tempType.value = newVal
    })

    const onSelectionChanged = function ({ selectedRowsData }) {
      const data = selectedRowsData[0];
      jodid.value = data.jodid
    }
    const changeSelectionPriority = function (e) {
      var val = e.value;
      popoverVisible.value = false
      console.log(val);
      //  statusValue.value = status.filter(item => item.val == val)

    }

    return {
      dataSource,
      status,
      task_ways,
      jodid,
      statusId,
      type,
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


      editingStart,
      toggleTaskDetailVisble,
      onToolbarPreparing,
      onSelectionChanged,
      changeSelectionPriority,
      handelStatus
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
