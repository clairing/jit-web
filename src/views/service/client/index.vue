<!--客户端信息-->
<template>
  <div>
    <div>
      <DxDataGrid :data-source="''" :height="500" key-expr="dssid" @toolbar-preparing="onToolbarPreparing($event)"
        :show-column-lines="true" :show-row-lines="true" :show-borders="true" :row-alternation-enabled="true"
        :focused-row-enabled="true" :column-auto-width="true" :column-hiding-enabled="false"
        :repaint-changes-only="true" :grouping="{ autoExpandAll: true }" :group-panel="{ visible: false }"
        @content-ready="onContentReady" :scrolling="{ showScrollbar: 'always', useNative: false }"
        :column-resizing-mode="'widget'">
        <DxPaging :page-size="10" />
        <DxFilterRow :visible="true" />
        <DxPager :show-page-size-selector="true" :show-info="true" :allowed-page-sizes="pageSizes" />

        <DxColumn data-field="teanant_id" caption="租户"></DxColumn>
        <DxColumn data-field="code_id" caption="组织" />
        <DxColumn data-field="outside_ip" caption="外网ip地址" />
        <DxColumn data-field="inside_ip" caption="内网ip地址" />
        <DxColumn data-field="mac_address" caption="Mac地址" />
        <DxColumn data-field="host_name" caption="主机名" />
        <DxColumn data-field='connection_count' caption="连接次数" />
        <DxColumn data-field='last_connection_time' caption="最后连接时间" />
        <DxColumn data-field='last_disconnection_time' caption="上次断开时间" />
        <DxColumn data-field="status" caption="状态" />
        <DxColumn caption="详情" :width="120" cell-template="detailTemplate" />

        <template #detailTemplate="{ data }">
          <a class="command-a" @click="showDetailData(data)">查看</a>
        </template>

        <template #tooolBarTemplate>
          <div class="informer">
            <span class="name">客户端信息</span>
          </div>
        </template>
      </DxDataGrid>
    </div>
    <div></div>
  </div>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxPager,
  DxFilterRow,
} from 'devextreme-vue/data-grid';
import { DxTextArea } from 'devextreme-vue/text-area';
import { ref, watch, getCurrentInstance } from 'vue';
import { createStore } from "devextreme-aspnet-data-nojquery"

const dataSource = [];
const types = [
  { value: '同步', text: '同步' },
  { value: '请求', text: '请求' },
];
export default {
  props: {
    org_id: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const logvisible = ref(true);
    const type = ref('');
    const typeText = ref('');
    watch(type, (newVal) => {
      typeText.value =
        types.filter((item) => item.value == newVal)[0]?.text ?? '';
    });
    const internalInstance = getCurrentInstance()
    let $url = internalInstance.appContext.config.globalProperties.$appInfo.$http
    const url = `${$url}/api/clientinfo`;
    LoadDataSource()

    function LoadDataSource() {
      dataSource.value = createStore({
        key: "dssid",
        loadUrl: `${url}/get`,
        onBeforeSend: (method, ajaxOptions) => {
          ajaxOptions.xhrFields = { withCredentials: false }
        }
      })
    }
    //显示日志信息
    function showLogData(key) {
      logvisible.value = true;
      console.log(key);
    }
    function onToolbarPreparing(e) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        template: 'tooolBarTemplate',
      });
    }
    function onContentReady() {
      document.querySelector('.dx-freespace-row').style.height = 0;
    }
    return {
      dataSource,
      logvisible,
      pageSizes: [10.20, 50],

      showLogData,
      onToolbarPreparing,
      onContentReady,
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxPager,

    DxFilterRow,
    // eslint-disable-next-line vue/no-unused-components
    DxTextArea,
  },
};
</script>

<style scoped>
.informer .name {
  font-size: 15px;
  font-weight: bold;
  color: #01abef;
}
</style>
