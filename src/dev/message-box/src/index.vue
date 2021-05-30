<template>
  <div class="container">
    <DxPopup
      v-model="popupVisible"
      :drag-enabled="false"
      :close-on-outside-click="true"
      :show-close-button="false"
      :show-title="true"
      :width="600"
      :height="280"
      container=".dx-viewport"
      title="Information"
    >
      <DxPosition at="bottom" my="center" v-model:of="positionOf" />
      <DxToolbarItem widget="dxButton" toolbar="bottom" location="before" :options="{}" />
      <div>111111111111111111</div>
    </DxPopup>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  // nextTick,
  // onMounted,
  // onBeforeUnmount,
  // computed,
  // watch,
  // reactive,
  // ref,
  // toRefs,
  // PropType,
} from 'vue'
import { DxPopup, DxPosition, DxToolbarItem } from 'devextreme-vue/popup';
// import notify from 'devextreme/ui/notify';
export default defineComponent({
  name: 'ElMessageBox',
  setup() {
    return {
      popupVisible: true,
      positionOf: ''
    }
  },
  components: {
    DxPopup,
    DxPosition,
    DxToolbarItem
  }
})
</script>

<style lang="scss" scoped>
</style>
