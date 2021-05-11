<!--数据服务主项以及子项目-->
<template>
  <div>
    <div>
      <DxDataGrid
        :data-source="dataSource"
        :height="500"
        width="100%"
        key-expr="id"
        @toolbar-preparing="onToolbarPreparing($event)"
        :show-column-lines="true"
        :show-row-lines="true"
        :show-borders="true"
        :row-alternation-enabled="true"
        :focused-row-enabled="true"
        :column-auto-width="true"
        :column-hiding-enabled="false"
        :column-fixing="{ enabled: true }"
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

        <DxEditing
          mode="popup"
          :allow-adding="canEditing"
          :allow-deleting="canEditing"
          :allow-updating="canEditing"
        >
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
        <DxColumn data-field="type" caption="类型" :width="120">
          <DxLookup value-expr="value" display-expr="text" :data-source="types" />
        </DxColumn>
        <DxColumn data-field="code" caption="编码" :width="100" />
        <DxColumn data-field="service_name" caption="服务名" :width="120" />
        <DxColumn data-field="status" caption="状态" cell-template="statusTemplate" :width="140" />
        <DxColumn data-field="description" caption="描述" />
        <DxColumn data-field caption="详情" width="120" cell-template="detailTemplate" />
        <DxColumn
          data-field
          caption=" 日志"
          width="120"
          cell-template="logTemplate"
          :visible="canEditing"
        />
        <template #statusTemplate="{ data }">
          <DxSwitch
            v-model:value="data.value"
            switched-off-text="停用"
            switched-on-text="启用"
            width="80px"
            @value-changed="handelSwitchChange(data.key, data.value)"
          />
        </template>

        <template #detailTemplate="{ data }">
          <a class="command-a" @click="showDetailData(data)">查看</a>
        </template>

        <template #logTemplate="{ data }">
          <a class="command-a" @click="showLogData(data.key)">查看</a>
        </template>

        <template #tooolBarTemplate>
          <div class="informer">
            <span class="name">数据服务主项</span>
          </div>
        </template>
      </DxDataGrid>
    </div>

    <Popup
      :width="900"
      :height="400"
      :show-title="true"
      :close-on-outside-click="true"
      v-model:visible="logVisible"
      position="center"
      title="日志记录"
    >
      <LogDetail></LogDetail>
    </Popup>
  </div>
</template>

<script>
import DxSwitch from 'devextreme-vue/switch'
import { DxPopup as Popup } from 'devextreme-vue/popup'
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
import { ref } from "vue"
import LogDetail from './LogDetail.vue'

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
    canEditing: {
      default: false,
      type: Boolean
    }
  },
  setup(props, { emit }) {
    const logVisible = ref(false)
    const typeText = ref("")
    function handelSwitchChange(key, value) {
      console.log(value);
      console.log(key)
    }
    //显示日志信息
    function showLogData(key) {
      logVisible.value = true
      console.log(key);

    }
    // 展示子服务
    function showDetailData(data) {
      emit("emitData", { "type": data.data.type, "chVisible": true, "cid": data.data.id })
    }

    function onToolbarPreparing(e) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        template: 'tooolBarTemplate'
      })
    }
    function onContentReady() {
      const el = document.querySelector(".dx-datagrid-headers .dx-datagrid-table .dx-header-row .dx-command-edit")
      if (el) el.innerText = "操作"
      document.querySelector(".dx-freespace-row").style.height = 0
    }
    return {
      dataSource,
      logVisible,
      types,
      typeText,
      pageSizes: [5, 10, 20],


      showLogData,
      showDetailData,
      handelSwitchChange,
      onToolbarPreparing,
      onContentReady

    }
  },
  components: {
    DxSwitch,
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
    Popup,
    // eslint-disable-next-line vue/no-unused-components
    DxTextArea,
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
