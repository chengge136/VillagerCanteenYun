// users/userOrders/userOrders.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    neworder:[],
    neworderLength:0,
    completedorders: [],
    ordersLength: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    var userDetail = wx.getStorageSync('userDetail');
    console.log('phone：', userDetail.phone)

    db.collection('order').where(
      {
        //新订单
        isapproved: _.eq(false),
        phone: _.eq(userDetail.phone)
      }
    ).get({
      success: function (res) {
        console.log(res.data[0])
        console.log(res.data.length)

        res.data[0].ctime = app.formatDate(new Date(res.data[0].ctime));
        that.setData({
          neworder: res.data[0],
          neworderLength:res.data.length
        })
      }
    })

    db.collection('order').where(
      {
        //完成订单
        isapproved: _.eq(true),
        phone: _.eq(userDetail.phone)
      }
    ).get({
      success: function (res) {
        console.log(res.data[0])
        for (var index in res.data) {
          res.data[index].ctime = app.formatDate(new Date(res.data[index].ctime));
        }
        that.setData({
          completedorders: res.data,
          ordersLength:res.data.length
        })
      }
    })

  },
  testLink(){
    wx.navigateTo({
      url: '../orderDetail/orderDetail',
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})