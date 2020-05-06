// canteen/refundlists/refundlists.js
const db = wx.cloud.database();
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refundlists: [],
    refundlistslength:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;

    //新订单
    db.collection('order').where(
      {

        isapproved: _.eq(true),
        subtype: _.eq(1)
      }
    ).get({
      success: function (res) {
       
        for (var index in res.data) {
          res.data[index].ctime = app.formatDate(new Date(res.data[index].ctime));
          res.data[index].comment = res.data[index].comment.substr(0,5)+"...";
        }
        that.setData({
          refundlists: res.data,
          refundlistslength: res.data.length
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})