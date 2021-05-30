import request from '@/utils/request'
const url = "http://192.168.1.106:8050/api/timedtask/"

// 定时任务恢复任务
export function resumejob(data) {
  return request({
    url: url + "resumejob",
    method: "post",
    data
  })
}
// 定时任务暂停任务
export function stopjob(data) {
  return request({
    url: url + "stopjob",
    method: "post",
    data
  })
}

const url2 = "http://192.168.1.106:8050/api/activetask/"
//api/activetask/updatetaskstatus
export function updatetaskstatus(data) {
  return request({
    url: url2 + "updatetaskstatus",
    method: "post",
    data
  })
}
