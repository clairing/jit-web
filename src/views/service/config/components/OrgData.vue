<!--数据服务配置-->
<template>
  <div>
    <div>
      <DxDataGrid :data-source="dataSource" :height="500" key-expr="id" @toolbar-preparing="onToolbarPreparing($event)"
        ref="dataGrid" :show-column-lines="true" :show-row-lines="true" :show-borders="true"
        :row-alternation-enabled="true" :focused-row-enabled="true" :column-auto-width="true"
        :column-hiding-enabled="false" :repaint-changes-only="true" :grouping="{ autoExpandAll: true }"
        :group-panel="{ visible: false }" @content-ready="onContentReady" :scrolling="{
          showScrollbar: 'always',
          useNative: false
        }" :column-resizing-mode="'widget'">
        <DxPaging :page-size="10" />
        <DxFilterRow :visible="true" />
        <DxPager :show-page-size-selector="true" :show-info="true" :allowed-page-sizes="pageSizes" />

        <DxColumn data-field="ds_type" caption="类型"></DxColumn>
        <DxColumn data-field="ds_code" caption="编码" />
        <DxColumn data-field="ds_name" caption="服务名" />
        <DxColumn data-field="description" caption="描述" :width="'30%'" />
        <DxColumn data-field="charge_type" caption="收费类型" />
        <DxColumn data-field="expire_date" caption="到期时间" />
        <DxColumn data-field="expire_date_surcount" caption="剩余次数" />
        <DxColumn data-field caption="开通记录" width="80" cell-template="logTemplate" />
        <DxColumn data-field caption="调用日志" width="80" cell-template="useTemplate" />
        <template #logTemplate="{ data}">
          <a class="command-a" @click="AuthLogData(data.key)">查看</a>
        </template>
        <template #useTemplate="{data}">
          <a class="command-a" @click="InvokeLogData(data.key)">查看</a>
        </template>
        <template #tooolBarTemplate>
          <div class="informer">
            <span class="name">组织开通数据服务查询</span>
          </div>
        </template>
      </DxDataGrid>
      <DxPopup :width="900" :height="400" :show-title="true" :close-on-outside-click="true" v-model:visible="logVisible"
        position="center" title="日志记录">
        <LogDetail :paramaid="selData.dm_code" type="tenant" />
      </DxPopup>

      <DxPopup :width="900" :height="400" :show-title="true" :close-on-outside-click="true"
        v-model:visible="invokeVisible" position="center" title="调用记录">
        <InvokeCord :paramaid="selData.org_id" :operate="selData.operate" :tenant_id="selData.tenant_id" />
      </DxPopup>
    </div>
    <div>
      <!-- 企业 -->
    </div>
  </div>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxPager,
  DxFilterRow,
} from 'devextreme-vue/data-grid'
import { DxTextArea } from 'devextreme-vue/text-area'
import { ref, getCurrentInstance, watch, reactive } from "vue"
import { createStore } from "devextreme-aspnet-data-nojquery"
import { DxPopup } from 'devextreme-vue/popup'
import LogDetail from '@/views/service/components/LogDetail.vue'
import InvokeCord from '@/views/service/components/InvokeCord.vue'
export default {
  props: {
    paramaid: {
      type: Number,
      default: 0
    },
    tenant_id: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const type = ref(""),
      typeText = ref(""),
      childVisible = ref(false),
      dataGrid = ref(),
      params = reactive({ "paramaid": "53", "tenant": "247" }),
      selData = reactive({ org_id: 0, tenant_id: 0, operate: "organ", dm_code: "" }),//展示日志信息dm_code
      logVisible = ref(false),
      invokeVisible = ref(false);

    const dataSource = ref(null)
    const { proxy } = getCurrentInstance()
    let $url = proxy.$appInfo.apiUrl
    const url = `${$url}/api/grantrecord/organdata`;
    function LoadDataSource() {
      dataSource.value = createStore({
        key: "dmid",
        loadUrl: `${url}`,
        loadParams: { "paramaid": "53", "tenant": "247" },
        onBeforeSend: (method, ajaxOptions) => {
          ajaxOptions.xhrFields = { withCredentials: false }
        }
      })
      console.log(params);
    }
    LoadDataSource()
    watch(() => props.dsid, (newVal, oldVal) => {
      params.dsCode = newVal || oldVal
      LoadDataSource()
    })
    function handelSwitchChange(key, value) {
      console.log(value);
      console.log(key)
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
    function onToolbarPreparing(e) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        template: 'tooolBarTemplate'
      })
    }
    function onContentReady() {
      // document.querySelector(".dx-datagrid-headers .dx-datagrid-table .dx-header-row .dx-command-edit").innerText = "操作"
      document.querySelector(".dx-freespace-row").style.height = 0
    }
    return {
      dataGrid,
      dataSource,
      invokeVisible,
      childVisible,
      logVisible,
      selData,

      type,
      typeText,
      pageSizes: [10, 20, 50],
      AuthLogData,
      InvokeLogData,
      handelSwitchChange,
      onToolbarPreparing,
      onContentReady

    }
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxPager,
    DxFilterRow,
    // eslint-disable-next-line vue/no-unused-components
    DxTextArea,
    DxPopup,
    InvokeCord,
    LogDetail
  }
}
</script>

<style scoped>
.informer .name {
  font-size: 15px;
  font-weight: bold;
  color: #01abef;
}
</style>
