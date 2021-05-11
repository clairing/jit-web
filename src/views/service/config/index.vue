
<!-- 数据服务企业配置 -->
<template>
  <MainServer @emitData="emitData"></MainServer>
  <DxPopup v-model:visible="tempData.chVisible" :show-title="true" title="数据服务-租户">
    <TenantData :cid="tempData.cid" />
  </DxPopup>
  <!-- <OrgData :cid="tempData.org_id"></OrgData> -->
</template>

<script>
import MainServer from '@/views/service/components/MainServer'
import TenantData from './components/TenantData.vue'
import { DxPopup } from 'devextreme-vue/popup';
// import OrgData from './components/org-data.vue'

import { reactive } from 'vue'
export default {
  setup() {
    let tempData = reactive({
      chVisible: false,
      cid: 0,
      org_id: 0
    })
    function emitData(data) {
      console.log(data);
      Object.assign(tempData, data);
    }
    return {
      tempData,
      emitData
    }
  },
  components: {
    MainServer,
    TenantData,
    DxPopup,
    // OrgData
  }
}
</script>

<style>
</style>
