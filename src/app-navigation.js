export default [
  {
    text: "Home",
    path: "/home",
    icon: "home"
  },
  {
    text: "Examples",
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
  }
];
