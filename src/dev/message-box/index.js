
import { confirm } from 'devextreme/ui/dialog';
import { alert } from "devextreme/ui/dialog"
import { custom } from 'devextreme/ui/dialog';

// var _alert= alert("")


const _MessageBox = {}
_MessageBox.install = app => {
  app.config.globalProperties.$alert = alert
  app.config.globalProperties.$confirm = confirm
  app.config.globalProperties.$custom = custom
}

export default _MessageBox
