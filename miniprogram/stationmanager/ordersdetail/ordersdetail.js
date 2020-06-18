// users/orderDetail/orderDetail.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    phone: '',
    addr: '',
    count: '',
    total: '',
    selecteduserstr: '',
    selectedmenustr: '',
    comment: '',
    ctime: '',
    isapproved: false,
    id: '',
    subtype: 0,
    _id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _id = options._id;
    var that = this;
    that.setData({
      _id: _id,
    });
    const _ = db.command;
    db.collection('batchorders').where({
      _id: _.eq(_id)
    })
      .get().then(res => {
        console.log("red.data:", res.data[0]);
        that.setData({
          username: res.data[0].username,
          phone: res.data[0].phone,
          addr: res.data[0].addr,
          count: res.data[0].count,
          total: res.data[0].total,
          selecteduserstr: res.data[0].selecteduserstr,
          selectedmenustr: res.data[0].selectedmenustr,
          comment: res.data[0].comment,  
          ctime: app.formatDate(new Date(res.data[0].ctime)),
          isapproved: res.data[0].isapproved,
          id: res.data[0].ctime,
          subtype: res.data[0].subtype
        })

      })

  },
  cancelorder: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消订单？',
      success(res) {
        if (res.confirm) {
          
          app.returnbatchBalance(that.data.addr, that.data.selecteduserstr, that.data.total) ;
          app.cancelbatch(that.data._id);

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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