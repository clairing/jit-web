<template>
  <MainServer :canEditing="true" @emitData="emitData" :reload="false" />
  <DxPopup v-model:visible="tempData.chVisible" title="子服务" :show-title="true">
    <SubServer :ds_type="tempData.ds_type" :dsid="tempData.dsid" />
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
      dsid: "",
      ds_type: ""
    })
    function emitData(data) {
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
