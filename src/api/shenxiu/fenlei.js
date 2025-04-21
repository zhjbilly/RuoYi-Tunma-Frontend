import request from '@/utils/request'

// 查询藏品分类信息列表
export function listFenlei(query) {
  return request({
    url: '/shenxiu/fenlei/list',
    method: 'get',
    params: query
  })
}

// 查询藏品分类信息详细
export function getFenlei(id) {
  return request({
    url: '/shenxiu/fenlei/' + id,
    method: 'get'
  })
}

// 新增藏品分类信息
export function addFenlei(data) {
  return request({
    url: '/shenxiu/fenlei',
    method: 'post',
    data: data
  })
}

// 修改藏品分类信息
export function updateFenlei(data) {
  return request({
    url: '/shenxiu/fenlei',
    method: 'put',
    data: data
  })
}

// 删除藏品分类信息
export function delFenlei(id) {
  return request({
    url: '/shenxiu/fenlei/' + id,
    method: 'delete'
  })
}

export function physicalInterface(url) {
  return request({
    url: url,
    method: 'get'
  })
}
