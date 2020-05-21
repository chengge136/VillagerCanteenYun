// canteen/canteenIndex/canteenIndex.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    timedate:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    var userDetail = wx.getStorageSync('userDetail');
    that.setData({
      address: userDetail.address,
      timedate:app.getcurrentDate()
    });
    db.collection('menu').get({
      success: function (res) {
        var menulists = [];
        for (var i = 0; i < res.data.length; i++) {
          menulists.push({
            name: res.data[i].name,
          })
        }
        wx.setStorage({
          key: 'menus',
          data: menulists,
          success: function (res) {
            console.log('setStorage of menus: ',menulists.length)
          }
        })

      }
    })


  },
  menu(){
    wx.navigateTo({
      url: '../menu/menu',
    })
  },
  verifylist(){
    wx.navigateTo({
      url: '../newOrder/newOrder',
    })
  },
  approvedlists(){
    wx.navigateTo({
      url: '../orderslist/orderslist',
    })
  },
  refundlists(){
    wx.navigateTo({
      url: '../refundlists/refundlists',
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