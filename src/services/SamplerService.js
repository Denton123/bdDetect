import BaseService from './BaseService'

export default class PatientService extends BaseService {
  login (type, params) {
    return this.postApi('/sampler/login/' + type, params)
  }

  getSign(url) {
    return this.getApi('/wx/getSign', {url: url})
  }

  forgetPwdValidate(params) {
    return this.postApi("/sampler/forgetPwdValidate", params)
  }

  forgetPwdChange(params) {
    return this.postApi("/sampler/changePwd", params)
  }

  logout(params) {
    return this.postApi('/v1/sampler/logout', params)
  }

  orderList(step, params) {
    return this.getApi(`/orderList/${step}`, params, '/reception/api/sampler')
  }

  getOrderInfo(oid, params) {
    return this.getApi('/getOrderInfo/' + oid, params, '/reception/api/sampler')
  }

  getSampleBindList(orderID) {
    return this.getApi(`/samplerList/${orderID}`, {},'/reception/api/sampler')
  }

  addSample(orderID, samples) {
    return this.postApi(`/addSampler/${orderID}`, samples, '/reception/api/sampler')
  }

  getSmsCode(params) {
    return this.getApi('/getSmsCode', params, '/reception/api/sampler')
  }

  getCpSmsCode(params) {
    return this.getApi('/cp/getSmsCode', params, '/reception/api/sampler')
  }

  getBindSmsCode(pn) {
    return this.getApi('/wx/getSmsCode?phoneNum=' + pn,{}, '/reception/api/sampler')
  }

  orderDetail(oid) {
    return this.getApi("/orderDetail/" + oid, {},'/reception/api/sampler')
  }

  editSample(sampleId, params) {
    return this.postApi(`/editSample/${sampleId}`, params, '/reception/api/sampler')
  }
  deleteSample(sampleId, params) {
    return this.postApi(`/deleteSample/${sampleId}`, params,'/reception/api/sampler')
  }
}
