// pages/register/register.js
const db = wx.cloud.database();
import Notify from '../../vant/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    nickName:'',
    avatarUrl:'',
    name: '',
    address: '',
    phone: '',
    notlike: '',
    password: '',
    passwordConfirm: '',
    disabled:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _ = db.command;
    let that=this;
    var userInfo = wx.getStorageSync('userInfo');
    var count = db.collection('wx_user').where({
      openid: _.eq(userInfo.openid)
    }).count({
      success: function (res) {
        if (res.total > 0) {
          wx.showModal({
            title: '提示',
            content: '你已经注册过了，请直接登录',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000) //延迟时间

              }
            }
          })
        }else{
          that.setData({
            nickName: userInfo.nickName,
            openid: userInfo.openid,
            avatarUrl: userInfo.avatarUrl
          })
        }
      }
    })
  },
  register(){

    var that=this;
    if (that.data.address == '' || that.data.phone == '' || that.data.password == ''){
      console.log('请填写完信息在提交！')
      Notify({ type: 'warning', duration: 3000, message: '信息不全\n请填写完再提交！' });
    }else if (!(that.data.password == that.data.passwordConfirm)){
      console.log('密码不一致！')
      Notify({ type: 'warning', duration: 3000, message: '两次密码不一致！' });
    }else{
      //提交注册
      that.insertUser();
      // console.log('time:',new Date().getTime())

    }
  },
  insertUser: function () {
    var that=this;
    that.setData({
      disabled:true
    });
    wx.cloud.callFunction({
      name: 'normalregister',
      data: {
        openid: that.data.openid,
        nickName: that.data.nickName,
        avatarUrl: that.data.avatarUrl,
        name: that.data.name,
        address: that.data.address,
        phone: that.data.phone,
        notlike: that.data.notlike,
        password: that.data.password,
        sfzid: '',
        age:0,
        active:true,
        balance: 100,
        ctime: new Date().getTime(),
        insertbyph:'',
        usertype:'0' //普通用户
      },
      complete: res => {
        console.log('test result: ', res);
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.redirectTo({
                url: '../logIn/logIn'
              })
            }, 1000)
          }
        })

      }
    })
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
  inputName: function (event) {
    var that = this;
    that.setData({
      name: event.detail
    })
  },
  inputPhone: function (event) {
    var that = this;
    that.setData({
      phone: event.detail
    })
  },
  inputAddress: function (event) {
    var that = this;
    that.setData({
      address: event.detail
    })
  },
  inputNotlike: function (event) {
    var that = this;
    that.setData({
      notlike: event.detail
    })
  },
  inputPWD: function (event) {
    var that = this;
    that.setData({
      password: event.detail
    })
  },
  inputREPWD: function (event) {
    var that = this;
    that.setData({
      passwordConfirm: event.detail
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})