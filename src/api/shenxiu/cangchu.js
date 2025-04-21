import request from '@/utils/request'

// 查询仓储信息列表
export function listCangchu(query) {
  return request({
    url: '/shenxiu/cangchu/list',
    method: 'get',
    params: query
  })
}

// 查询仓储信息详细
export function getCangchu(id) {
  return request({
    url: '/shenxiu/cangchu/' + id,
    method: 'get'
  })
}

// 新增仓储信息
export function addCangchu(data) {
  return request({
    url: '/shenxiu/cangchu',
    method: 'post',
    data: data
  })
}

// 修改仓储信息
export function updateCangchu(data) {
  return request({
    url: '/shenxiu/cangchu',
    method: 'put',
    data: data
  })
}

// 删除仓储信息
export function delCangchu(id) {
  return request({
    url: '/shenxiu/cangchu/' + id,
    method: 'delete'
  })
}

export function physicalInterface(url) {
  return request({
    url: url,
    method: 'get'
  })
}
