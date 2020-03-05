import BaseService from './BaseService'

export default class SalesService extends BaseService {
    login(type, params) {
        return this.postApi('/sales/login/' + type, params)
    }

    forgetPwdValidate(params) {
        return this.postApi("/sales/forgetPwdValidate", params)
    }

    forgetPwdChange(params) {
        return this.postApi("/sales/changePwd", params)
    }

    getSmsCode(params) {
        return this.getApi('/sales/getSmsCode', params)
    }

    getCpSmsCode(params) {
        return this.getApi('/sales/cp/getSmsCode', params)
    }

    logout(params) {
        return this.postApi('/v1/sales/logout', params)
    }

    getAccountImages() {
        return this.getApi('/v1/sales/getAccountImages')
    }

    setAccountImage(params) {
        return this.postApi('/v1/sales/setAccountImage', params)
    }

    changeName(params) {
        return this.postApi('/v1/sales/changeName', params)
    }

    changePwd(params) {
        return this.postApi("/v1/sales/changePwd", params)
    }

    projects(params) {
        return this.getApi("/projects", params, '/reception/api/sales')
    }

    getProjectItem(id, params) {
        return this.getApi('/getProjectItem/' + id, params, '/reception/api/sales')
    }

    getOpts(params) {
        return this.getApi("/opts", params, '/reception/api/sales')
    }

    getCreditorOpts(params) {
        return this.getApi('/creditorOpts', params, '/reception/api/sales')
    }

    getPaymentInfo(orderID) {
        return this.getApi(`/paymentInfo/${orderID}`, {}, '/reception/api/sales')
    }

    GetInfoByPhoneNum(phoneNum) {
        return this.getApi('/getInfoByPhoneNum/' + phoneNum, {}, '/reception/api/sales')
    }

    GetInfoByOrderID(orderID) {
        return this.getApi('/getInfoByOrderID/' + orderID, {}, '/reception/api/sales')
    }

    submitOrder(params) {
        return this.postApi('/submitOrder', params, '/reception/api/sales')
    }

    submitPayType(orderID, params) {
        return this.postApi(`/submitPayType/${orderID}`, params, '/reception/api/sales')
    }

    supplyOrder(orderID, params) {
        return this.postApi(`/supplyOrder/${orderID}`, params, '/reception/api/sales')
    }
    supplySave(orderID, params) {
        return this.postApi(`/saveOrderInfo/${orderID}`, params, '/reception/api/sales')

    }

    cancelOrder(orderID, params) {
        return this.postApi(`/cancelOrder/${orderID}`, params, '/reception/api/sales')
    }

    offlineRefund(orderID) {
        return this.postApi(`/offlineRefund/${orderID}`, {}, '/reception/api/sales')
    }

    orderList(params) {
        return this.getApi('/orderList', params, '/reception/api/sales')
    }

    getOrderInfo(oid, params) {
        return this.getApi('/getOrderInfo/' + oid, params, '/reception/api/sales')
    }

    confirmPayment(orderID, params) {
        return this.postApi(`/confirmPayment/${orderID}`, params, '/reception/api/sales')
    }

    confirmBaseInfo(orderID, params) {
        return this.postApi(`/confirmBaseInfo/${orderID}`, params, '/reception/api/sales')
    }

    confirmSampleInfo(orderID, params) {
        return this.postApi(`/confirmSampleInfo/${orderID}`, params, '/reception/api/sales')
    }
    getSampleList(phoneNum, params) {
        return this.getApi('/getSampleList/' + phoneNum, params, '/reception/api/sales')
    }
    getOrderList(status, params) {
        return this.getApi(`/orderList/${status}`, params, '/reception/api/sales')
    }
    deleteImage(orderID, id) {
        return this.deleteApi(`/upload/delete/${orderID}/${id}`, '/reception/api/sales')
    }
}