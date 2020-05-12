//app.js
var app = getApp();
// 初始化 cloud
wx.cloud.init();
//1、引用数据库
const db = wx.cloud.database({
  //这个是环境ID,不是环境名称
  env: 'yxk-kappa-hlb24'
})
  
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'yxk-kappa-hlb24',
        traceUser: true,
      })
    }

    this.globalData = {}
  },
  // 更改账户余额,根据手机号查询更改账户余额
  test(openid,newblance) {

  },
  // 时间戳转为日期时间
  formatDate: function (now) {

    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  },
  getDate: function (now) {

    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    return year + "-" + month + "-" + date;
  },
  modifyBalance: function (newbalance) {
    var userInfo = wx.getStorageSync('userInfo');
    console.log('modifyBalance - openid', userInfo.openid)
    console.log('modifyBalance - newbalance', newbalance)
    wx.cloud.callFunction({
      name: 'modifyBalance',
      data: {
        openid: userInfo.openid,
        newbalance: newbalance
      },
      complete: res => {
        console.log('update balance success: ', res);
      }
    })
  },
  modifybatchBalance: function (selectedIds, sum) {
    wx.cloud.callFunction({
      name: 'modifybatchBalance',
      data: {
        selectedIds: selectedIds,
        sum: sum
      },
      complete: res => {
        console.log('batch update balance success: ', res);
      }
    })
  },
  refund: function (_id, reason) {
    wx.cloud.callFunction({
      name: 'refund',
      data: {
        _id: _id,
        reason: reason
      },
      complete: res => {
        console.log('refund success: ', res);
        wx.navigateBack({
          delta: 1
        })

      }
    })
  },
  cancel: function (_id) {
    wx.cloud.callFunction({
      name: 'cancel',
      data: {
        _id: _id
      },
      complete: res => {
        console.log('cancel success: ', res);
        wx.navigateBack({
          delta: 1
        })

      }
    })
  },
  createOrder: function (about, menus, comment, total){
    var userDetail = wx.getStorageSync('userDetail');
    wx.cloud.callFunction({
      name: 'createOrder',
      data: {
        approvedid:'',
        username: userDetail.name,
        addr: userDetail.address,
        about: about,
        menus: menus,
        notlike: userDetail.notlike,
        comment: comment,
        phone: userDetail.phone,
        total: total,
        ctime: new Date().getTime(),
        isapproved:false,
        subtype:0
      },
      complete: res => {
        console.log('createOrder success: ', res);
        wx.redirectTo({
          url: '../userOrders/userOrders',
        })
      }
    })
  },
  createbatchOrder: function (count, total, selecteduserstr, comment) {
    var userDetail = wx.getStorageSync('userDetail');
    wx.cloud.callFunction({
      name: 'createbatchOrder',
      data: {
        approvedid: '',
        username: userDetail.name,
        phone: userDetail.phone,
        addr: userDetail.address,
        count: count,
        total: total,
        selecteduserstr: selecteduserstr,
        comment: comment,
        ctime: new Date().getTime(),
        isapproved: false,
        subtype: 0
      },
      complete: res => {
        console.log('createbatchOrder success: ', res);
        wx.redirectTo({
          url: '../stationIndex/stationIndex',
        })
      }
    })
  }
})
