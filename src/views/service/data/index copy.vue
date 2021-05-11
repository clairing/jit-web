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
        <DxColumn data-field="type" caption="类型" :width="120">
          <DxLookup value-expr="value" display-expr="text" :data-source="types" />
        </DxColumn>
        <DxColumn data-field="code" caption="编码" :width="100" />
        <DxColumn data-field="service_name" caption="服务名" :width="120" />
        <DxColumn data-field="status" caption="状态" cell-template="statusTemplate" :width="140" />
        <DxColumn data-field="description" caption="描述" :width="300" />
        <DxColumn data-field caption="详情" width="120" cell-template="detailTemplate" />
        <DxColumn data-field caption=" 日志" width="120" cell-template="logTemplate" />
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
            width="80px"
            @value-changed="handelSwitchChange(data.key, data.value)"
          />
        </template>

        <template #tooolBarTemplate>
          <div class="informer">
            <span class="name">数据服务主项</span>
          </div>
        </template>
      </DxDataGrid>
    </div>
    <div>
      <DxDataGrid
        :data-source="dataSource"
        :height="600"
        width="100%"
        key-expr="id"
        v-model:visible="childVisible"
        @toolbar-preparing="onToolbarPreparing($event, type)"
        :show-borders="true"
        :row-alternation-enabled="true"
        :focused-row-enabled="true"
        :column-auto-width="true"
        :column-hiding-enabled="true"
        :repaint-changes-only="true"
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
          <DxPopup :show-title="true" :width="600" :height="475" :title="'数据服务编辑'" />
          <DxForm>
            <DxItem :col-count="1" :col-span="2" item-type="group">
              <DxItem data-field="code" />
              <DxItem data-field="service_name" />
              <DxItem data-field="api_url" :visible="type === 'request'" />
              <DxItem
                data-field="description"
                editor-type="dxTextArea"
                :editor-options="{ height: 100 }"
              />
            </DxItem>
          </DxForm>
        </DxEditing>
        <DxColumn data-field="code" caption="服务编码" />
        <DxColumn data-field="service_name" caption="服务名" />
        <DxColumn data-field="api_url" caption="API地址" :visible="type === 'request'" />
        <DxColumn data-field="description" caption="描述" width="30%" />
        <DxColumn data-field="status" caption="状态" cell-template="statusTemplate" />
        <template #statusTemplate="{ data }">
          <DxSwitch
            v-model:value="data.value"
            switched-off-text="停用"
            switched-on-text="启用"
            width="80px"
            @option-changed="handelSwitchChange(data.key, data.value)"
          />
        </template>
        <template #tooolBarTemplate>
          <div class="informer">
            <span class="name">数据服务子项{{ typeText ? "-" + typeText + "服务" : "" }}</span>
          </div>
        </template>
      </DxDataGrid>
    </div>
  </div>
</template>

<script>
import DxSwitch from 'devextreme-vue/switch';
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
import { ref, watch } from "vue"
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
  setup() {
    const logvisible = ref(true)
    const type = ref("")
    const cid = ref(0)
    const typeText = ref("")
    const childVisible = ref(false)

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
      type.value = data.data.type
      childVisible.value = true
      cid.value = data.data.id
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
      cid,
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
