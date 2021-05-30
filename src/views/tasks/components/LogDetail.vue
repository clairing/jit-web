<template>
  <div>
    <DxDataGrid
      :show-border="true"
      :data-source="dataSource"
      :height="300"
      key-expr="rid"
      :show-column-lines="true"
      :show-row-lines="true"
      :show-borders="true"
      :row-alternation-enabled="true"
      :column-auto-width="true"
      :column-hiding-enabled="false"
      :column-fixing="{ enabled: true }"
      :repaint-changes-only="true"
      @toolbar-preparing="onToolbarPreparing"
      @content-ready="onContentReady"
      @editing-start="editingStart"
      :grouping="{ autoExpandAll: true }"
      :group-panel="{ visible: false }"
      :scrolling="{
        showScrollbar: 'always',
        useNative: false
      }"
      :column-resizing-mode="'widget'"
    >
      <DxPaging :page-size="10" />
      <DxPager :show-page-size-selector="true" :show-info="true" :allowed-page-sizes="pageSizes" />
      <DxColumn data-field="creation_time" caption="执行时间"></DxColumn>
      <DxColumn data-field="end_time" caption="结束时间"></DxColumn>
      <DxColumn data-field="note" caption="备注"></DxColumn>
      <DxColumn data-field="result" caption="结果" :visible="type == 'dispatch'"></DxColumn>
    </DxDataGrid>
  </div>
</template>s

<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxPager
} from 'devextreme-vue/data-grid'
import { reactive, watch, getCurrentInstance, ref } from 'vue'
import { createStore } from "devextreme-aspnet-data-nojquery"

export default {
  props: {
    // 传递的参数
    paramaid: {
      type: String,
      default: "73239085be4a4138aa88b7326378bb0a"
    },
    // 日志类型 type:"time": 定时任务  dispatch :"派发任务"
    type: {
      type: String,
      default: "time"
    }
  },
  setup(props) {
    console.log(props.paramaid, props.type);
    const params = reactive({ paramaid: "" })
    const dataSource = ref(null)
    // 获取当前vue实例
    const internalInstance = getCurrentInstance()
    let $http = internalInstance.appContext.config.globalProperties.$appInfo.$http
    let apiUrl = ""
    switch (props.type) {
      case "time":
        apiUrl = `${$http}/api/timedtask`;
        break
      case "dispatch":
        apiUrl = `${$http}/api/activetask`;
        break
      default:
        apiUrl = ""
        break
    }
    watch(() => props.paramaid, (newVal, oldVal) => {
      params.paramaid = newVal || oldVal
      loadLogs()
    })
    function loadLogs() {
      dataSource.value = createStore({
        key: "rid",
        loadUrl: `${apiUrl}/gettaskrecord`,
        loadParams: params,
        onBeforeSend: (method, ajaxOptions) => {
          ajaxOptions.xhrFields = { withCredentials: false }
        },
        // onLoaded(res) {
        //   console.log(res);
        // }
      })
    }
    return {
      dataSource,
      pageSizes: [5, 10, 20]
    }
  },
  components: {
    DxColumn,
    DxDataGrid,
    DxPaging,
    DxPager
  }
}
</script>

<style scoped>
</style>
