<template>
  <div>
    <!-- <DxDataGrid v-bind="$attrs" :height=600 :show-column-lines="true" :show-row-lines="true" :show-borders="true"
      :row-alternation-enabled="true" :focused-row-enabled="true" :column-auto-width="true"
      :column-hiding-enabled="true" :repaint-changes-only="true" @content-ready="onContentReady">

      <slot />
    </DxDataGrid> -->
    <DxDataGrid v-bind="$attrs">
      <!-- <template #default>
        <slot />
      </template> -->
      <slot />
    </DxDataGrid>
  </div>
</template>

<script>
import {
  DxDataGrid
} from 'devextreme-vue/data-grid'
export default {
  inheritAttrs: false,
  setup(props, { attrs }) {
    console.log(attrs);
    function onContentReady() {
      document.querySelector(".dx-datagrid-headers .dx-datagrid-table .dx-header-row .dx-command-edit").innerText = "操作"
    }
    return {
      onContentReady
    }
  },
  components: {
    DxDataGrid
  }
}
</script>

<style>
</style>
