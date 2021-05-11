<template>
  <MainServer :canEditing="true" @emitData="emitData" />
  <DxPopup v-model:visible="logVisible" title="日志记录" :show-title="true">
    <SubServer :type="tempData.type" :cid="tempData.cid" />
  </DxPopup>
</template>

<script>

import MainServer from '@/views/service/components/MainServer'
import SubServer from '@/views/service/components/SubServer'

import { DxPopup } from 'devextreme-vue/popup';
import { reactive } from "vue"
// import { reactive } from 'vue'
export default {
  setup() {
    let tempData = reactive({
      chVisible: false,
      cid: 0,
      type: 0
    })
    function emitData(data) {
      console.log(data);
      Object.assign(tempData, data)
    }
    return {
      tempData,
      emitData
    }
  },
  components: {
    DxPopup,

    MainServer,
    SubServer,

  }
}
</script>

<style>
</style>
