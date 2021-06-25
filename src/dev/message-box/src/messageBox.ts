import { createVNode, render } from "vue";
import Msg from '@/dev/message-box/src/index.vue'
import type {
  Action,
  Callback,
  MessageBoxState,
  ElMessageBox,
  MessageBoxData,
} from './message-box.type'

function MessageBox(options);

function MessageBox(options) {
  const container = document.createElement("div");
  // container.className = `__default__container__message__`;
  //创建虚拟节点
  const vm = createVNode(Msg, options);
  //渲染虚拟节点
  render(vm, container);
  // document.body.appendChild(container);
  document.body.appendChild(container.firstElementChild);

}
MessageBox.alert = (options) => {
  MessageBox(Object.assign(
    {
      title: "title",
      closeOnClickModal: true,
    },
    options,
    {
      boxType: 'alert',
    },
  ))
}
export default MessageBox
