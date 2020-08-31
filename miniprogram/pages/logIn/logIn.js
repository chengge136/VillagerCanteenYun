// pages/authorized/authorized.js
import Notify from '../../vant/notify/notify';
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    openid: '',
    avatarUrl: '',
    phone: '',
    pwd: ''
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    console.log('login page of the nickName:', userInfo.nickName)
    this.setData({
      openid: userInfo.openid,
      avatarUrl:userInfo.avatarUrl
    })
  },
  register() {
    wx.navigateTo({
      url: '../register/register',
    })
  },
  submit: function (e) {
    var that = this;
    that.setData({ disabled: true });
    const _ = db.command;
    console.log(that.data.phone);
    db.collection('wx_user').where({
      phone: _.eq(that.data.phone)
    })
      .get().then(res => {
        if (res.data.length == 0) {
          Notify({ type: 'warning', duration: 4000, message: '账户不存在，请先注册\n本页注册只针对普通用户\n其他用户有管理员分配' });
          that.setData({ disabled: false });
        } else {
          if (that.data.phone == res.data[0].phone && that.data.pwd == res.data[0].password) {
            var userDetail = [];
            userDetail.push({
              name: res.data[0].name,
              address: res.data[0].address,
              notlike: res.data[0].notlike,
              phone: res.data[0].phone,
              balance: res.data[0].balance,
              avatarUrl: that.data.avatarUrl,
              usertype: res.data[0].usertype
            })

            wx.setStorage({
              key: 'userDetail',
              data: userDetail[0],
              success: function (res) {
                var userDetail = wx.getStorageSync('userDetail');
                console.log('用户类型:', userDetail.usertype);
                if (userDetail.usertype == '0') {
                  wx.redirectTo({
                    url: '../../users/userIndex/userIndex'
                  })
                }else if (userDetail.usertype=='1'){
                  wx.redirectTo({
                    url: '../../stationmanager/stationIndex/stationIndex'
                  })
                } else if (userDetail.usertype == '2'){
                  wx.redirectTo({
                    url: '../../canteen/canteenIndex/canteenIndex'
                  })
                } else if (userDetail.usertype == '3'){
                  wx.redirectTo({
                    url: '../../finance/financeIndex/financeIndex'
                  })
                } else if (userDetail.usertype == '4') {
                  wx.redirectTo({
                    url: '../../manager/managerindex/managerindex'
                  })
                }
                
              }
            })
          }
          else {
            Notify({ type: 'warning', duration: 2000, message: '账户密码不对！' });
            that.setData({ disabled: false });
          }
        }

      })


  },
  noinput: function (e) {
    this.setData({ phone: e.detail.value });
    this.setData({ noinput: true });
    if (this.data.noinput == true && this.data.pwdinput == true) {
      this.setData({ disabled: false });
    }

  },
  pwdinput: function (e) {
    this.setData({ pwd: e.detail.value });
    this.setData({ pwdinput: true });
    if (this.data.noinput == true && this.data.pwdinput == true) {
      this.setData({ disabled: false });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.no == '' || this.data.pwd == '') {
      this.setData({ disabled: true });
    } else {
      this.setData({ disabled: false });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})