const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  email: state => state.user.email,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  routes: state => state.permission.routes,
  // addRoutes: state => state.permission.addRoutes,
  changes: state => state.datagrid.changes,
}
export default getters
