import request from './index'
const PATH = '/comment'

function getList(params) {
  return request({
    url: `${PATH}/getAdminList`,
    method: 'get',
    params
  })
}

function getAllList(params) {
  return request({
    url: `${PATH}/getAllList`,
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

export default {
  getList,
  getAllList,
  getInfo,
  add,
  edit
}