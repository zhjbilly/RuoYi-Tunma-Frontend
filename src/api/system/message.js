import request from '@/utils/request'

// 查询用户消息列表
export function listMessage(query) {
  return request({
    url: '/system/message/list',
    method: 'get',
    params: query
  })
}

// 查询用户消息详细
export function getMessage(id) {
  return request({
    url: '/system/message/' + id,
    method: 'get'
  })
}

// 新增用户消息
export function addMessage(data) {
  return request({
    url: '/system/message',
    method: 'post',
    data: data
  })
}

// 修改用户消息
export function updateMessage(data) {
  return request({
    url: '/system/message',
    method: 'put',
    data: data
  })
}

// 删除用户消息
export function delMessage(id) {
  return request({
    url: '/system/message/' + id,
    method: 'delete'
  })
}

export function physicalInterface(url) {
  return request({
    url: url,
    method: 'get'
  })
}

// 获取未读消息数量
export function getUnreadCount() {
  return request({
    url: '/system/message/unread/count',
    method: 'get'
  })
}

// 标记消息为已读
export function markAsRead(messageId) {
  return request({
    url: '/system/message/read/' + messageId,
    method: 'put'
  })
}

// 批量标记消息为已读
export function markAllAsRead() {
  return request({
    url: '/system/message/read/all',
    method: 'put'
  })
}
