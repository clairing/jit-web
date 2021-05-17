<!--组织级别数据服务 -->
<template>
  <OrgData :org_id="org_id" />
  {{org_id}}
</template>
<script>
import OrgData from '../config/components/OrgData'
import { useRoute } from 'vue-router'
import { ref } from "vue"
export default {
  setup() {
    const route = useRoute()
    const org_id = ref(route.params.org_id || 0)
    return {
      org_id
    }
  },
  components: {
    OrgData
  }
}
</script>
