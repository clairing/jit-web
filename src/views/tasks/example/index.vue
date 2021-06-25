<template>
  <div>
    <data-grid class="dx-card wide-card" :data-source="dataSourceConfig" :page-size="6">
      <!-- <dx-paging :page-size="10" />
      <dx-pager :show-page-size-selector="true" :show-info="true" />-->
      <!-- <dx-filter-row :visible="true" /> -->

      <dx-column data-field="Task_ID" :width="90" :hiding-priority="2" />

      <dx-column data-field="Subject" caption="任务" :width="190" :hiding-priority="8" :allow-filtering="true" />

      <dx-column data-field="Task_Status" caption="Status" :hiding-priority="6" />

      <dx-column data-field="Task_Priority" caption="Priority" :hiding-priority="5">
        <dx-lookup display-expr="name" value-expr="value" :data-source="priorities" />
      </dx-column>

      <dx-column data-field="ResponsibleEmployee.Employee_Full_Name" caption="Assigned To" :allow-sorting="false"
        :hiding-priority="7" />

      <dx-column data-field="Task_Start_Date" caption="Start Date" data-type="date" :hiding-priority="3" />

      <dx-column data-field="Task_Due_Date" caption="日期" data-type="date" :hiding-priority="4" />

      <dx-column data-field="Task_Priority" caption="Priority" name="Priority" :hiding-priority="1" />

      <dx-column data-field="Task_Completion" caption="Completion" :hiding-priority="0" />

    </data-grid>
  </div>
</template>

<script>
import "devextreme/data/odata/store";
import DataGrid from '@/dev/DxDataGrid.vue'
import {
  DxColumn,
  DxLookup,

} from "devextreme-vue/data-grid";

const priorities = [
  { name: "High", value: 4 },
  { name: "Urgent", value: 3 },
  { name: "Normal", value: 2 },
  { name: "Low", value: 1 }
];

export default {
  name: "Example",
  setup() {
    const dataSourceConfig = {
      store: {
        type: "odata",
        key: "Task_ID",
        url: "https://js.devexpress.com/Demos/DevAV/odata/Tasks"
      },
      expand: "ResponsibleEmployee",
      select: [
        "Task_ID",
        "Task_Subject",
        "Task_Start_Date",
        "Task_Due_Date",
        "Task_Status",
        "Task_Priority",
        "Task_Completion",
        "ResponsibleEmployee/Employee_Full_Name"
      ]
    };
    return {
      dataSourceConfig,
      priorities
    };
  },
  components: {
    DataGrid,
    DxColumn,
    // DxFilterRow,
    DxLookup,
    // DxPager,
    // DxPaging
  }
};
</script>
