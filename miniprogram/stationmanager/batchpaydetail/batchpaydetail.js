// users/orderDetail/orderDetail.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addr: '',
    count: 0,
    ctime: '',
    income: 0,
    phone: '',
    updatedby: '',
    user_names: '',
    total:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _id = options._id;
    var that = this;
    const _ = db.command;
    db.collection('user_batchpay_record').where({
      _id: _.eq(_id)
    })
      .get().then(res => {
        console.log("red.data:", res.data[0]);
        that.setData({
          addr: res.data[0].addr,
          count: res.data[0].count,
          ctime: app.formatDate(new Date(res.data[0].ctime)),
          income: res.data[0].income,
          phone: res.data[0].phone,
          updatedby: res.data[0].updatedby,
          user_names: res.data[0].user_names,
          total: res.data[0].income * res.data[0].count
        })

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