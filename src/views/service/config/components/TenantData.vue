
<template>
  <div>
    <DxTreeList
      id="tasks"
      :data-source="dataSource"
      @content-ready="onContentReady"
      @editor-preparing="onEditorPreparing"
      @init-new-row="onInitNewRow"
      @cell-prepared="onCellPrepared"
      :show-borders="true"
      :height="500"
      :column-auto-width="true"
      :word-wrap-enabled="true"
      key-expr="id"
      parent-id-expr="parent_id"
      :show-column-lines="true"
      :show-row-lines="true"
      :selection="{ mode: 'none' }"
      :data-structure="'plain'"
      :row-alternation-enabled="true"
      :scrolling="{ mode: 'standard' }"
      :auto-expand-all="true"
    >
      <DxSearchPanel :visible="true" :width="250" />
      <DxHeaderFilter :visible="true" />
      <DxSelection mode="single" />
      <DxEditing :allow-adding="true" :allow-deleting="true" :allow-updating="true" mode="single" />
      <DxColumnChooser :enabled="true" />

      <DxColumn :width="120" data-field="tenant_name" caption="租户" />
      <DxColumn :width="200" data-field="org_name" caption="组织" />
      <DxColumn :width="140" data-field="mark" caption="识别标记" />
      <DxColumn :min-width="120" data-field="service_type" caption="服务类型">
        <DxLookup :data-source="use_types" value-expr="value" display-expr="text" />
      </DxColumn>
      <DxColumn data-field="expense_type" caption="收费类型" />
      <DxColumn data-field="expire_time" caption="到期时间" />
      <DxColumn data-field="count" caption="次数" />
      <DxColumn data-field="status" caption="启用" cell-template="statusTemplate" />

      <DxColumn data-field caption="日志" width="120" cell-template="logTemplate" />
      <DxColumn data-field caption="详情" width="120" cell-template="detailTemplate" />
      <template #logTemplate="{ data }">
        <a class="command-a" @click="showLogData(data.key)">查看</a>
      </template>
      <template #detailTemplate="{ data }">
        <a class="command-a" @click="showDetailData(data)">查看</a>
      </template>
      <template #statusTemplate="{ data }">
        <DxSwitch
          v-model:value="data.value"
          switched-off-text="停用"
          switched-on-text="启用"
          :width="80"
          @value-changed="handelSwitchChange(data.key, data.value)"
        />
      </template>
    </DxTreeList>
    
    <DxPopup
      :width="900"
      :height="400"
      :show-title="true"
      :close-on-outside-click="true"
      v-model:visible="logVisible"
      position="center"
      title="日志记录"
    >
      <LogDetail />
    </DxPopup>
  </div>
</template>
<script>

import {
  DxTreeList,
  DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxLookup,
  DxEditing
} from 'devextreme-vue/tree-list'
import DxSwitch from 'devextreme-vue/switch'
import { DxPopup } from 'devextreme-vue/popup'
import LogDetail from '@/views/service/components/LogDetail.vue'
import { ref } from "vue"
import { tasks } from './data.js'
const use_types = [{ value: "synchronous", text: "先用后付" }, { value: "request", text: "先付后用" }]
import { nextTick } from 'vue'
export default {
  props: {
    cid: {
      type: Number,
      default: 0
    }
  },
  setup() {
    const logVisible = ref(false)
    //1、要解决问题的：父元素的id为O，则编辑添加的时候，禁用某些cell, 
    //2、子级去掉新增
    function onCellPrepared(e) {
      // var fieldName = (e.dataField || "-") + "|";
      if (e.row != null) {
        e.cellElement.style.backGroundColor = "#f00"
        if (e.data.parent_id != 0) {
          var el = e.cellElement.querySelector(".dx-link-add") ?? null;
          nextTick(function() {
            if (el) { el.parentNode.removeChild(el) }
          });
        }

        // if ("tenant_name|count|".indexOf(fieldName) > -1) {
        //   e.cellElement.style.background = "red";
        // }
      }
    }
    function onContentReady() {
      // document.querySelector(".dx-treelist-headers .dx-treelist-table .dx-header-row .dx-command-edit").innerText = "操作"
      document.querySelector(".dx-freespace-row").style.height = 0
    }
    function onEditorPreparing(e) {
      if (e.row != null) {
        var fieldName = (e.dataField || "-") + "|";
        if ("id|tenant_name|org_name|mark|service_type|expense_type|expire_time|count|statuss|".indexOf(fieldName) > -1) {
          if (e.row.data.mm_pid == 0) {
            // if ("tenant_name|".indexOf(fieldName) > -1) {
            //   e.editorOptions.disabled = true;
            // } else { e.editorOptions.disabled = false; }
          }
          else {
            if ("tenant_name|count|".indexOf(fieldName) > -1) {
              e.editorOptions.disabled = true;
            } else { e.editorOptions.disabled = false; }
          }
        }
      }
    }
    function onInitNewRow(e) {
      console.log(e);
    }
    // 暂时详情数据
    function showLogData() {
      logVisible.value = true
    }
    function handelSwitchChange(key, value) {
      console.log(key, value);
    }
    return {
      dataSource: tasks,
      use_types,
      logVisible,

      onContentReady,
      onCellPrepared,
      onEditorPreparing,
      onInitNewRow,
      handelSwitchChange,
      showLogData
    }


  },
  components: {
    DxTreeList,
    DxColumn,
    DxColumnChooser,
    DxHeaderFilter,
    DxSearchPanel,
    DxSelection,
    DxLookup,
    DxEditing,
    DxSwitch,
    DxPopup,
    LogDetail

  }
}
</script>
<style>
#tasks {
  max-height: 540px;
}
#tasks .dx-treelist-rowsview td {
  vertical-align: middle;
}
</style>
