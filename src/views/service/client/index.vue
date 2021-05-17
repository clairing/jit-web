<!--客户端信息-->
<template>
  <div>
    <div>
      <DxDataGrid :data-source="''" :height="500" key-expr="id" @toolbar-preparing="onToolbarPreparing($event)"
        :show-column-lines="true" :show-row-lines="true" :show-borders="true" :row-alternation-enabled="true"
        :focused-row-enabled="true" :column-auto-width="true" :column-hiding-enabled="false"
        :repaint-changes-only="true" :grouping="{ autoExpandAll: true }" :group-panel="{ visible: false }"
        @content-ready="onContentReady" :scrolling="{ showScrollbar: 'always', useNative: false }"
        :column-resizing-mode="'widget'">
        <DxPaging :page-size="10" />
        <DxFilterRow :visible="true" />
        <DxPager :show-page-size-selector="true" :show-info="true" :allowed-page-sizes="pageSizes" />

        <DxColumn data-field caption="租户"></DxColumn>
        <DxColumn data-field="code" caption="组织" />
        <DxColumn data-field="service_name" caption="外网ip地址" />
        <DxColumn data-field="description" caption="内网ip地址" />
        <DxColumn data-field caption="Mac地址" />
        <DxColumn data-field caption="主机名" />
        <DxColumn data-field caption="连接次数" />
        <DxColumn data-field caption="最后连接时间" />
        <DxColumn data-field caption="上次断开时间" />
        <DxColumn data-field caption="状态" />
        <DxColumn data-field caption :width="120" cell-template="detailTemplate" />

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
import { ref, watch } from 'vue';

const dataSource = [];
const types = [
  { value: 'synchronous', text: '同步' },
  { value: 'request', text: '请求' },
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
