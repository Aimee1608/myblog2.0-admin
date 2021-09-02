import request from './index'
const PATH = '/user'

export function login(data) {
  return request({
    url: `${PATH}/login`,
    method: 'get'
  })
}

export function getInfo() {
  return request({
    url: `${PATH}/getUserInfo`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: `${PATH}/logout`,
    method: 'get'
  })
}

export function getUserList(params) {
  return request({
    url: `${PATH}/getUserList`,
    method: 'get',
    params
  })
}

export function getUserListPage(params) {
  return request({
    url: `${PATH}/getList`,
    method: 'get',
    params
  })
}

export function editStatus(data) {
  return request({
    url: `${PATH}/editRole`,
    method: 'post',
    data
  })
}
