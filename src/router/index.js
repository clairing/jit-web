// import auth from "@/utils/auth";
import { createRouter, createWebHashHistory } from "vue-router";
import store from '@/store'
import Home from "@/views/home/index.vue";
import defaultLayout from "@/layouts/side-nav-inner-toolbar";
import simpleLayout from "@/layouts/single-card";
import { getToken } from '@/utils/js-cookie';
import notify from 'devextreme/ui/notify';
function loadView(view, page = "index") {
  return () => import(/* webpackChunkName: "login" */ `@/views/${view}/${page}.vue`)
}

export const constantRoutes = [
  {
    path: "/home",
    name: "home",
    meta: {
      requiresAuth: true,
      layout: defaultLayout
    },
    component: Home
  },
  {
    path: "/login",
    name: "login",
    meta: {
      layout: simpleLayout,
      title: "Sign In"
    },
    component: loadView("login")
  },
  {
    path: "/reset-password",
    name: "reset-password",
    meta: {
      layout: simpleLayout,
      title: "Reset Password",
      description: "Please enter the email address that you used to register, and we will send you a link to reset your password via Email."
    },
    component: loadView("reset-password")
  },
  {
    path: "/create-account",
    name: "create-account",
    meta: {
      layout: simpleLayout,
      title: "Sign Up"
    },
    component: loadView("create-account"),
  },
  {
    path: "/change-password/:recoveryCode",
    name: "change-password",
    meta: {
      layout: simpleLayout,
      title: "Change Password"
    },
    component: loadView("change-password")
  },
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/recovery",
    redirect: "/home",
  },
  {
    path: "/404",
    meta: {
      layout: defaultLayout
    },
    component: loadView("404")
  },
  {
    // path: "/:pathMatch(.*)*",

    path: '/:pathMatch(.*)', name: 'bad-not-found', redirect: "/home"
  }
]


export const asyncRoutes = [{
  path: "/profile",
  name: "profile",
  meta: {
    layout: defaultLayout
  },
  // component: loadView("profile")
  component: () => import(`@/views/profile/index.vue`)
},
{
  path: "/tasks",
  name: "tasks",
  meta: {
    layout: defaultLayout
  },
  // component: loadView("task")
  component: () => import(`@/views/task/index.vue`)
}]

const initRouter = () => createRouter({
  routes: constantRoutes,
  history: createWebHashHistory(),
  scrollBehavior: () => ({
    top: 0
  }),
})
const router = initRouter()



notify("Warning message", "warning", 500);
const whiteList = ['/login', './create-account', '/reset-password', "/reset-password"];
router.beforeEach(async (to, from, next) => {
  // console.log(11);
  const hasToken = getToken()
  if (hasToken) {
    if (to.name === "login") {
      next({ name: "home" });
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;
      if (hasRoles) {
        next()
      } else {
        try {
          // const { roles } = 
          await store.dispatch("user/getInfo")
          // console.log(roles);
          const accessRoutes = await store.dispatch("permission/generateRoutes");
          router.addRoute(...accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          store.dispatch("user/resetToken")
          next(`/login?redirect=${to.fullPath}`)
        }
      }
    }

  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({
        name: "login",
        query: { redirect: to.fullPath }
      });
    }
  }
});

export function resetRouter() {
  const newRouter = initRouter()
  router.mathcer = newRouter.mathcer
}
export default router;
