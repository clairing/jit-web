
<template>
  <div>

    <DxDataGrid id="tasks" :data-source="dataSource" @content-ready="onContentReady" ref="dataGrid"
      @init-new-row="onInitNewRow" @editor-preparing="onEditingStart" @cell-prepared="onCellPrepared"
      :show-borders="true" :height="500" :column-auto-width="true" :word-wrap-enabled="false" key-expr="dmid"
      :show-column-lines="true" :show-row-lines="true" :row-alternation-enabled="true" :focused-row-enabled="false"
      :column-hiding-enabled="false" :column-fixing="{ enabled: true }" :allow-column-resizing="true"
      :allow-column-reordering="true">
      <DxSearchPanel :visible="true" :width="250" />
      <DxHeaderFilter :visible="true" />
      <DxSelection mode="single" />
      <DxEditing :allow-adding="true" :allow-deleting="true" :allow-updating="true" mode="single" />
      <DxColumnChooser :enabled="true" />
      <DxColumn :width="120" data-field="dm_code" caption="开通编码" />
      <DxColumn :width="120" data-field="tenant_id" caption="租户" />
      <DxColumn :width="200" data-field="org_id" caption="组织" />
      <DxColumn :width="140" data-field="identify_mark" caption="识别标记" />
      <DxColumn :min-width="120" data-field="service_type" caption="服务类型">
        <DxLookup :data-source="use_types" value-expr="value" display-expr="text" />
      </DxColumn>
      <DxColumn data-field="charge_type" caption="收费类型" width="120">
        <DxLookup :data-source="expense_types" value-expr="value" display-expr="text" />
      </DxColumn>
      <DxColumn data-field="expire_date" caption="到期时间" width="80" data-type="date" format="yyyy-MM-dd" />
      <DxColumn data-field="expire_date_maxcount" caption="剩余次数" width="80" />
      <!-- <DxColumn data-field="expire_date_surcount" caption="时间收费剩余次数" /> -->
      <DxColumn data-field="status" caption="启用" width="150" cell-template="statusTemplate" :allow-editing="false" />
      <DxColumn data-field caption="开通记录" width="80" cell-template="logTemplate" />
      <DxColumn data-field caption="调用日志" width="80" cell-template="useTemplate" />
      <DxColumn data-field caption="跳转" width="80" cell-template="detailTemplate" />
      <DxFilterRow :visible="true"></DxFilterRow>
      <template #logTemplate="{ data}">
        <a class="command-a" @click="AuthLogData(data.data)">查看</a>
      </template>
      <template #useTemplate="{data}">
        <a class="command-a" @click="InvokeLogData(data.data)">查看</a>
      </template>
      <template #detailTemplate="{ data }">
        <a class="command-a" @click="showDetailData(data.key)">查看</a>
      </template>
      <template #statusTemplate="{ data }">
        <DxSwitch v-model:value="data.value" switched-off-text="停用" switched-on-text="启用" :width="80"
          @value-changed="handelSwitchChange(data.key, data.value)" />
      </template>
    </DxDataGrid>

    <DxPopup :width="900" :height="400" :show-title="true" :close-on-outside-click="true" v-model:visible="logVisible"
      position="center" title="日志记录">
      <LogDetail :paramaid="selData.dm_code" type="tenant" />
    </DxPopup>

    <DxPopup :width="900" :height="400" :show-title="true" :close-on-outside-click="true"
      v-model:visible="invokeVisible" position="center" title="调用记录">
      <InvokeCord :paramaid="selData.org_id" :operate="selData.operate" :tenant="selData.tenant_id" />
    </DxPopup>
  </div>
</template>
<script>

import {
  DxDataGrid,
  DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxLookup,
  DxEditing,
  DxFilterRow
} from 'devextreme-vue/data-grid'
import DxSwitch from 'devextreme-vue/switch'
import { DxPopup } from 'devextreme-vue/popup'
import LogDetail from '@/views/service/components/LogDetail.vue'
import InvokeCord from '@/views/service/components/InvokeCord.vue'
import { ref, getCurrentInstance, watch, reactive, nextTick } from "vue"
import { useRouter } from 'vue-router';
import { createStore } from "devextreme-aspnet-data-nojquery"
import notify from 'devextreme/ui/notify'
import { tOperate } from '@/api/service' //暂停开始接口


const use_types = [{ value: "先用后付", text: "先用后付" }, { value: "先付后用", text: "先付后用" }]
const expense_types = [{ value: "按时间收费", text: "按时间收费" }, { value: "按次数收费", text: "按次数收费" }]
export default {
  props: {
    dsid: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    // TreeList 实例
    const dataGrid = ref(),
      params = reactive({ "dsCode": "", "tenant_id": "" }),
      selData = reactive({ org_id: 0, tenant_id: 0, operate: "organ", dm_code: "" }),//sel_data 
      logVisible = ref(false),
      invokeVisible = ref(false),
      dataSource = ref(null),
      router = useRouter(),
      { proxy } = getCurrentInstance(),
      $url = proxy.$appInfo.apiUrl,
      url = `${$url}/api/grantrecord`;

    watch(() => props.dsid, (newVal, oldVal) => {
      params.dsCode = newVal || oldVal
      LoadDataSource()
    })
    function LoadDataSource() {
      dataSource.value = createStore({
        key: "dmid",
        loadUrl: `${url}/get`,
        loadParams: params,
        insertUrl: `${url}/post`,
        updateUrl: `${url}/put`,
        deleteUrl: `${url}/delete`,
        onBeforeSend: (method, ajaxOptions) => {
          ajaxOptions.xhrFields = { withCredentials: false }
        }, onInserting(data) {
          data.ds_code = props.dsid// 新增之前,添加关联主键
        }
      })
      console.log(params);
    }
    //1、要解决问题的：父元素的id为O，则编辑添加的时候，禁用某些cell, 
    //2、子级去掉新增
    function onCellPrepared(e) {
      // var fieldName = (e.dataField || "-") + "|";
      if (e.row != null) {
        e.cellElement.style.backGroundColor = "#f00"
        if (e.data.parent_id != 0) {
          var el = e.cellElement.querySelector(".dx-link-add") ?? null;
          nextTick(function () {
            if (el) { el.parentNode.removeChild(el) }
          });
        }
      }
    }

    function onContentReady() {
      // document.querySelector(".dx-treelist-headers .dx-treelist-table .dx-header-row .dx-command-edit").innerText = "操作"
      document.querySelector(".dx-freespace-row").style.height = 0
    }
    // 编辑的时候禁用字段
    function onEditingStart(e) {
      if (!e.row?.isNewRow) {
        var fieldName = (e.name || "-") + "|";
        if ("dm_code|tenant_id|org_id|service_type|charge_type|status|".indexOf(fieldName) > -1) {
          e.editorOptions.disabled = true
        }
      }
    }
    // 新增数据
    function onInitNewRow(e) {
      console.log(e);
    }
    //开通记录
    function AuthLogData(data) {
      logVisible.value = true
      selData.value.dm_code = data.dm_code
    }
    // 调用日志
    function InvokeLogData(data) {
      invokeVisible.value = true
      selData.tenant_id = data.tenant_id
      selData.org_id = data.org_id
      console.log(selData);
    }
    function handelSwitchChange(key, value) {
      var formData = { "type": value ? "start" : 'stop', "id": key };
      tOperate(formData).then((res) => {
        notify({
          message: res.message,
          position: {
            my: 'center center',
            at: 'center center'
          },
          width: 200
        }, 'success', 2000);
        dataGrid.value.instance.refresh()
        dataGrid.value.instance.clearSelection()
        console.log(dataGrid.value);
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
    // 详情跳转页面
    function showDetailData(column) {
      // 关闭租户数据服务弹窗
      // emit("emitData", { "type": column.data.type, "chVisible": false, "cid": column.data.id })
      // 跳转至企业数据服务界面
      router.push({ name: "ServiceOrgService", params: { org_id: column.data.org_id, tenant_id: column.data.tenant_id } })
    }
    return {
      dataGrid,
      dataSource,
      use_types,
      expense_types,
      logVisible,
      selData,
      invokeVisible,

      onContentReady,
      onCellPrepared,
      onEditingStart,
      onInitNewRow,
      handelSwitchChange,
      AuthLogData,
      InvokeLogData,
      showDetailData

    }


  },
  components: {
    DxDataGrid,
    DxColumn,
    DxColumnChooser,
    DxHeaderFilter,
    DxSearchPanel,
    DxSelection,
    DxLookup,
    DxEditing,
    DxSwitch,
    DxPopup,
    DxFilterRow,
    LogDetail,
    InvokeCord


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
