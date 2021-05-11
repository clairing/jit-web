<template>
  <div>
    <DxDataGrid :show-border="true" :data-source="TaskData" :height=300 key-expr="rid" :show-borders="false">
      <DxColumn data-field="creation_time" caption="执行时间"></DxColumn>
      <DxColumn data-field="end_time" caption="结束时间"></DxColumn>
      <DxColumn data-field="note" caption="备注"></DxColumn>
      <DxColumn data-field="result" caption="结果"></DxColumn>
    </DxDataGrid>
  </div>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
} from 'devextreme-vue/data-grid'
// import { createStore } from 'devextreme-aspnet-data-nojquery';
// const taskData = createStore({
//   key: 'Value',
//   loadUrl: `${url}/CustomersLookup`,
//   onBeforeSend: (method, ajaxOptions) => {
//     ajaxOptions.xhrFields = { withCredentials: true };
//   }
// });
var TaskData =
  [{ rid: 1, "jodid": 1, "creation_time": "2019-09-11", "end_time": "2099-02-11", "note": "ssd" },
  { rid: 2, "jodid": 1, "creation_time": "2019-09-11", "end_time": "2099-02-11", "note": "ssd" }]
export default {
  props: {
    jodid: {
      type: Number,
      default: 0
    }
  },
  setup() {
    // console.log(props);
    // const iconClass = computed(() => { console.log(1) })
    return {
      TaskData
    }
  },
  components: {
    DxColumn, DxDataGrid
  }
}
</script>

<style scoped>
</style>
