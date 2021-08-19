
const sso = {
  urls: {
    login: 'https://service.100tal.com/sso/login/311568934',
    logout: 'http://api.service.100tal.com/sso/logout?path=http://api.service.100tal.com/sso/logout?path=https://service.100tal.com/sso/login/311568934',
    checkTicket: 'https://api.service.100tal.com/basic/get_ticket',
    getVerify: 'http://api.service.100tal.com/sso/verify',
    home: 'https://app.xesv5.com/log/#/home'
  },
  params: {
    app_id: '311568934',
    app_key: 'z9d7IDGKDSz4dUuR',
    version: '1.0'
  },
  jsonBase: 'https://editor.xesimg.com/tailor/logadmin/' // 应该区分测试环境和线上环境
}

export default {
  sso
}
