<!--组织级别数据服务 -->
<template>
  <OrgData :paramaid="org_id" :tenant="tenant_id" />
  {{org_id}}
</template>
<script>
import OrgData from '../config/components/OrgData'
// import { useRoute } from 'vue-router'
// import { ref } from "vue"
export default {
  props: {
    org_id: {
      type: Number,
      default: 0
    },
    tenant_id: {
      type: Number,
      default: 0
    }
  },
  setup() {
    // const route = useRoute()
    // const org_id = ref(route.params.org_id || 0)
    // return {
    //   org_id
    // }
  },
  components: {
    OrgData
  }
}
</script>
