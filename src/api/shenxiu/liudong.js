import request from '@/utils/request'

// 查询藏品流动信息列表
export function listLiudong(query) {
  return request({
    url: '/shenxiu/liudong/list',
    method: 'get',
    params: query
  })
}

// 查询藏品流动信息详细
export function getLiudong(id) {
  return request({
    url: '/shenxiu/liudong/' + id,
    method: 'get'
  })
}

// 新增藏品流动信息
export function addLiudong(data) {
  return request({
    url: '/shenxiu/liudong',
    method: 'post',
    data: data
  })
}

// 修改藏品流动信息
export function updateLiudong(data) {
  return request({
    url: '/shenxiu/liudong',
    method: 'put',
    data: data
  })
}

// 删除藏品流动信息
export function delLiudong(id) {
  return request({
    url: '/shenxiu/liudong/' + id,
    method: 'delete'
  })
}

export function physicalInterface(url) {
  return request({
    url: url,
    method: 'get'
  })
}
