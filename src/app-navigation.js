export default [
  {
    text: "Home",
    path: "/home",
    icon: "home"
  },
  {
    text: "任务管理",
    icon: "folder",
    items: [
      {
        text: "Profile",
        path: "/profile"
      },
      // {
      //   text: "TaskExample",
      //   path: "/tasks/example"
      // },
      {
        text: "定时任务",
        path: "/tasks/task-time"
      },
      {
        text: "调度任务",
        path: "/tasks/task-dispatch"
      },
      {
        text: "查询界面",
        path: "/tasks/task-query"
      }
    ]
  }, {
    text: "数据服务",
    icon: 'folder',
    items: [
      {
        text: "数据服务",
        path: "/service/data"
      },
      {
        text: "数据服务配置",
        path: "/service/config"
      },
      {
        text: "企业数据服务",
        path: "/service/orgservice"
      },
      {
        text: "数据同步服务",
        path: "/service/client"
      }
    ]
  }
]
