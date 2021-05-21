import request from '@/utils/request'
const url = "http://192.168.1.106:8050/api/timedtask/"

// 恢复任务
export function resumejob(data) {
  return request({
    url: url + "resumejob",
    method: "post",
    data
  })

}
