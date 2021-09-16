import request from './index'
const PATH = '/article'

function getList(params) {
  return request({
    url: `${PATH}/getList`,
    method: 'get',
    params
  })
}

function getInfo(params) {
  return request({
    url: `${PATH}/getInfo`,
    method: 'get',
    params
  })
}

function add(data) {
  return request({
    url: `${PATH}/add`,
    method: 'post',
    data
  })
}

function edit(data) {
  return request({
    url: `${PATH}/edit`,
    method: 'post',
    data
  })
}

function remove(data) {
  return request({
    url: `${PATH}/delete`,
    method: 'post',
    data
  })
}

function getHomeInfo(params) {
  return request({
    url: `${PATH}/getHomeInfo`,
    method: 'get',
    params
  })
}
export default {
  getList,
  getInfo,
  add,
  edit,
  getHomeInfo,
  remove
}
