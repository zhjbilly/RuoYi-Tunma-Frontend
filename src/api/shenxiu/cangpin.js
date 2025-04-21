import request from '@/utils/request'

// 查询藏品信息列表
export function listCangpin(query) {
  return request({
    url: '/shenxiu/cangpin/list',
    method: 'get',
    params: query
  })
}

// 查询藏品信息详细
export function getCangpin(id) {
  return request({
    url: '/shenxiu/cangpin/' + id,
    method: 'get'
  })
}

// 新增藏品信息
export function addCangpin(data) {
  return request({
    url: '/shenxiu/cangpin',
    method: 'post',
    data: data
  })
}

// 修改藏品信息
export function updateCangpin(data) {
  return request({
    url: '/shenxiu/cangpin',
    method: 'put',
    data: data
  })
}

// 删除藏品信息
export function delCangpin(id) {
  return request({
    url: '/shenxiu/cangpin/' + id,
    method: 'delete'
  })
}

export function physicalInterface(url) {
  return request({
    url: url,
    method: 'get'
  })
}
