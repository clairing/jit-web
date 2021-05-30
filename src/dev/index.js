import ElMessageBox from './message-box';
export { default as ElMessageBox } from './message-box';
const version = '1.0.0';

const version$1 = version;

const defaultInstallOpt = {
  size: '',
  zIndex: 2000,
};
const components = [

];
const plugins = [
  ElMessageBox
];
const install = (app, opt) => {
  const option = Object.assign(defaultInstallOpt, opt);

  app.config.globalProperties.$ELEMENT = option;
  components.forEach(component => {
    app.component(component.name, component);
  });
  plugins.forEach(plugin => {
    app.use(plugin);
  });
};
var index = {
  version: version$1,
  install,
};

export default index;
export { install, version$1 as version };
