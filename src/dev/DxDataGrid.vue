<template>
  <div>
    <DxDataGrid
      v-bind="$attrs"
      :height="height"
      :show-column-lines="true"
      :show-row-lines="true"
      :show-borders="true"
      :row-alternation-enabled="true"
      :focused-row-enabled="false"
      :column-auto-width="true"
      :column-hiding-enabled="false"
      :column-fixing="{ enabled: true }"
      :repaint-changes-only="true"
      :grouping="{ autoExpandAll: true }"
      :group-panel="{ visible: false }"
      :scrolling="{
        showScrollbar: 'always',
        useNative: false
      }"
      :column-resizing-mode="'widget'"
      :selection="{ mode: 'single' }"
    >
      <template #default>
        <DxPaging :page-size="pageSize" />
        <DxPager :show-page-size-selector="true" :show-info="true" :allowed-page-sizes="pageSizes" />
        <DxFilterRow :visible="true"></DxFilterRow>
        <slot></slot>
      </template>
    </DxDataGrid>
  </div>
</template>

<script>
import {
  DxDataGrid,
  DxPaging,
  DxPager,
  DxFilterRow,
} from 'devextreme-vue/data-grid'
import { onMounted, ref } from 'vue'
export default {
  // inheritAttrs: true,
  emits: ['input'],
  props: {
    pageSize: {
      type: Number,
      default: 1
    },
  },
  setup(props, attrs) {
    console.log(attrs);
    const height = ref(0);
    function onContentReady() {
      // document.querySelector(".dx-datagrid-headers .dx-datagrid-table .dx-header-row .dx-command-edit").innerText = "操作"
    }
    onMounted(
      window.onresize = function() {
        height.value = window.innerHeight - 150
      }
    )
    return {
      height,
      pageSizes: [5, 10, 20, 50, 100],
      onContentReady
    }
  },
  components: {
    DxDataGrid,
    DxPaging,
    DxPager,
    DxFilterRow,
  }
}
</script>

<style>
</style>
