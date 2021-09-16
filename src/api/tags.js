import request from './index'
const PATH = '/tags'

function getList(params) {
  return request({
    url: `${PATH}/getList`,
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

export default {
  getList,
  getAllList,
  add,
  edit,
  remove
}
