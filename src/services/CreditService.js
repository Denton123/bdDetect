import BaseService from './BaseService'

export default class PatientService extends BaseService {
  login(type, params) {
    return this.postApi('/login/' + type, params)
  }

  forgetPwdValidate(params) {
    return this.postApi("/forgetPwdValidate", params, '/reception/api/credit')
  }

  forgetPwdChange(params) {
    return this.postApi("/changePwd", params, '/reception/api/credit')
  }

  logout(params) {
    return this.postApi('/logout', params, '/reception/api/credit')
  }

  orderList(step, params) {
    return this.getApi(`/orderList/${step}`, params, '/reception/api/credit')
  }

  getSmsCode(params) {
    return this.getApi('/getSmsCode', params, '/reception/api/credit')
  }

  getCpSmsCode(params) {
    return this.getApi('/cp/getSmsCode', params, '/reception/api/credit')
  }

  getBindSmsCode(pn) {
    return this.getApi('/wx/getSmsCode?phoneNum=' + pn, {}, '/reception/api/credit')
  }

  getOrderInfo(oid, params) {
    return this.getApi('/getOrderInfo/' + oid, params, '/reception/api/credit')
  }

  orderDetail(oid) {
    return this.getApi("/orderDetail/" + oid, {}, '/reception/api/credit')
  }

  creditRefuse(orderID) {
    return this.postApi(`/refuse/${orderID}`, {}, '/reception/api/credit')
  }

  creditAccept(orderID) {
    return this.postApi(`/accept/${orderID}`, {}, '/reception/api/credit')
  }
}