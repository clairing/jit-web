
import { createVNode, render } from "vue";
import Msg from '@/dev/message-box/src/index.vue'
export default {
  install: (app, options) => {
    console.log(options);
    app.config.globalProperties.$message = () => {
      // 创建div
      const container = document.createElement("div");
      // container.className = ``;
      //创建虚拟节点
      const vm = createVNode(Msg, options);
      //渲染虚拟节点
      render(vm, container);
      document.body.appendChild(container);
    }
  }
}
