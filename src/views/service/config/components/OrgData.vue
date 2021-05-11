<!--数据服务配置-->
<template>
  <div>
    <div>
      <DxDataGrid
        :data-source="dataSource"
        :height="500"
        key-expr="id"
        @toolbar-preparing="onToolbarPreparing($event)"
        :show-column-lines="true"
        :show-row-lines="true"
        :show-borders="true"
        :row-alternation-enabled="true"
        :focused-row-enabled="true"
        :column-auto-width="true"
        :column-hiding-enabled="false"
        :repaint-changes-only="true"
        @editing-start="editingStart"
        :grouping="{ autoExpandAll: true }"
        :group-panel="{ visible: false }"
        @content-ready="onContentReady"
        :scrolling="{
          showScrollbar: 'always',
          useNative: false
        }"
        :column-resizing-mode="'widget'"
      >
        <DxPaging :page-size="10" />
        <DxFilterRow :visible="true" />
        <DxPager :show-page-size-selector="true" :show-info="true" :allowed-page-sizes="pageSizes" />

        <DxEditing mode="popup" :allow-adding="true" :allow-deleting="true" :allow-updating="true">
          <DxPopup :show-title="true" :width="500" :height="475" :title="'数据服务编辑'" />
          <DxForm>
            <DxItem :col-count="1" :col-span="2" item-type="group">
              <DxItem data-field="type" />
              <DxItem data-field="code" />
              <DxItem data-field="service_name" />
              <DxItem
                data-field="description"
                editor-type="dxTextArea"
                :editor-options="{ height: 100 }"
              />
            </DxItem>
          </DxForm>
        </DxEditing>
        <DxColumn data-field="type" caption="类型">
          <DxLookup value-expr="value" display-expr="text" :data-source="types" />
        </DxColumn>
        <DxColumn data-field="code" caption="编码" />
        <DxColumn data-field="service_name" caption="服务名" />
        <DxColumn data-field="description" caption="描述" :width="'30%'" />
        <DxColumn data-field caption="收费类型" />
        <DxColumn data-field caption="到期时间" />
        <DxColumn data-field caption="剩余次数" />
        <DxColumn data-field caption="查看" :width="120" cell-template="detailTemplate" />
        <template #detailTemplate="{ data }">
          <a class="command-a" @click="showDetailData(data)">查看</a>
        </template>

        <template #tooolBarTemplate>
          <div class="informer">
            <span class="name">组织开通数据服务查询</span>
          </div>
        </template>
      </DxDataGrid>
    </div>
    <div>
      {{ org_id }}
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
  DxEditing,
  DxPopup,
  DxLookup,
  DxForm,
} from 'devextreme-vue/data-grid'
import { DxTextArea } from 'devextreme-vue/text-area';
import { DxItem } from 'devextreme-vue/form'
import { ref, watch, reactive } from "vue"
const dataSource = [{
  id: "1",
  type: "synchronous",
  code: "13",
  service_name: "14",
  description: "15",
  status: true
},
{
  id: "2",
  type: "request",
  code: "13",
  service_name: "14",
  description: "15",
  status: false
},
]
const types = [{ value: "synchronous", text: "同步" }, { value: "request", text: "请求" }]
export default {
  props: {
    org_id: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const logvisible = ref(true)
    const type = ref("")
    const typeText = ref("")
    const childVisible = ref(false)
    let tempData = reactive({
      tenantDataVisible: false,
      cid: 0
    })
    watch(type, (newVal) => {
      typeText.value = types.filter(item => item.value == newVal)[0]?.text ?? ""
    })

    function handelSwitchChange(key, value) {
      console.log(value);
      console.log(key)
    }
    //显示日志信息
    function showLogData(key) {
      logvisible.value = true
      console.log(key);

    }
    // 展示子服务
    function showDetailData(data) {
      tempData.tenantDataVisible = true
      tempData.cid = data.key
      emit("func", tempData)
    }

    function onToolbarPreparing(e) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        template: 'tooolBarTemplate'
      })
    }
    function onContentReady() {
      document.querySelector(".dx-datagrid-headers .dx-datagrid-table .dx-header-row .dx-command-edit").innerText = "操作"
      document.querySelector(".dx-freespace-row").style.height = 0
    }
    return {
      dataSource,
      logvisible,
      childVisible,
      types,
      type,
      typeText,


      showLogData,
      showDetailData,
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
    DxEditing,
    DxPopup,
    DxForm,
    DxItem,
    DxLookup,
    // eslint-disable-next-line vue/no-unused-components
    DxTextArea
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
