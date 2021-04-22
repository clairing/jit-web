<template>
  <div>
    <DxDataGrid :data-source="dataSource" :height=600 key-expr="tpid" :show-borders="true" :focused-row-enabled="true"
      :column-auto-width="true" :column-hiding-enabled="true" :repaint-changes-only="true">
      <DxPaging :page-size="10" />
      <!-- :selection="{ mode: 'single' }" :focused-row-index="0"      @selection-changed="onSelectionChanged" -->
      <DxPaging :page-size="10" />
      <DxPager :show-page-size-selector="true" :show-info="true" :allowed-page-sizes="pageSizes" />
      <!-- <DxColumn data-field="job_name" caption="任务类型" :allow-filtering='false' /> -->
      <DxColumn data-field="need_download" caption="是否需要下载" data-type="boolean">
      </DxColumn>
      <DxColumn data-field="need_callback" caption="是否需要回执" data-type="boolean">
      </DxColumn>
      <DxColumn data-field="need_notice" caption="是否需要通知" data-type="boolean">
      </DxColumn>
      <DxColumn data-field="download_path" caption="下载地址" :visible="false" />
      <DxColumn data-field="callback_path" caption="回执地址" :visible="false" />
      <DxColumn data-field="callback_params" caption="回执参数" :visible="false" />
      <DxColumn data-field="notice_siteemail" caption="站内信" :visible="false" />
      <DxColumn data-field="notice_email" caption="邮件" :visible="false" />
      <DxColumn data-field="notice_phone" caption="短信" :visible="false" />
      <DxColumn data-field="src" caption="来源" />
      <DxColumn data-field="interval" caption="任务名" :allow-filtering='false' />
      <DxColumn data-field="description" caption="任务描述" />
      <DxColumn data-field="job_progress" caption="进度" />
      <DxColumn data-field="creation_time" caption="任务下派时间" :allow-editing="false" format="yyyy-MM-dd HH:mm:ss" />
      <DxColumn data-field="start_time" caption="任务开始时间" :allow-editing="false" format="yyyy-MM-dd hh:mm:ss" />
      <DxColumn data-field="end_time" caption="任务完成时间" :allow-editing="false" format="yyyy-MM-dd hh:mm:ss" />
      <DxColumn data-field="" caption="执行记录" :allow-filtering='false' cell-template="taskTemplate" />
      <DxColumn data-field="" caption="查看结果" :allow-filtering='false' cell-template="taskTemplate" />
      <DxFilterRow :visible="true"></DxFilterRow>
      <template #taskTemplate="{data}">
        <div class="task-a" @click="toggleTaskDetailVisble(data.key)">查看</div>
      </template>
    </DxDataGrid>
    <!-- 必须用v-model:visbel,否则点击多次 -->
    <Popup :width="800" :height="300" :show-title="true" :close-on-outside-click="true"
      v-model:visible="taskDetailVisible" position="ceter" title="任务详情">
      <TimeTaskDetail :jodid="tpid" :type="type"></TimeTaskDetail>
    </Popup>
  </div>
</template>
{{statusValue}}
<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxPager,
  DxFilterRow
} from 'devextreme-vue/data-grid'
import { DxPopup as Popup } from 'devextreme-vue/popup'
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
import { ref, computed } from 'vue'
import TimeTaskDetail from '../components/TimeTaskDetail.vue'
var dataSource = data.data;
export default {
  name: "TaskQuery2",
  setup() {
    const status = [{ value: "pending", text: "等待处理", editable: false }, { value: "inprocess", text: "处理中", editable: true }, { value: "pause", text: "暂停", editable: true }, { value: "complele", text: "任务完成", editable: false }, { value: "error", text: "异常", editable: false }]
    const taskDetailVisible = ref(false);
    const tpid = ref(0)
    const type = ref("")
    const statusId = ref(1)
    const popoverVisible = ref(false)
    const statusValue = ref("")


    const statusText = computed(() => {
      return status.filter(item => item.editable).map(item => item.value)
    })

    const toggleTaskDetailVisble = function (key, value) {
      tpid.value = key
      type.value = value
      console.log(value);
      taskDetailVisible.value = !taskDetailVisible.value
    }

    const handelStatus = function (key, value) {
      statusId.value = key
      statusValue.value = value
      popoverVisible.value = true
    }

    return {
      dataSource,
      status,
      tpid,
      type,
      statusId,
      pageSizes: [5, 10, 20],
      taskDetailVisible,
      popoverVisible,
      statusText,
      statusValue,

      toggleTaskDetailVisble,
      handelStatus,
      // onSelectionChanged,
    }
  },
  components: {
    DxDataGrid,

    DxColumn,

    DxPaging,
    DxPager,
    Popup,
    DxFilterRow,
    TimeTaskDetail
  }
}
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
</style>>
