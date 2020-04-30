// users/orderDetail/orderDetail.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    addr: '',
    notlike: '',
    comment: '',
    phone: '',
    total: '',
    ctime: '',
    username:'',
    isapproved: false,
    menus:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _id = options._id;
    console.log('id',_id)
    var that = this;
    const _ = db.command;

    db.collection('order').where({
      _id: _.eq(_id)
    })
      .get().then(res => {
        console.log("red.data:",res.data[0]);
        
        //分割菜单
        var menus = [];
        var items = res.data[0].menus.split(";");
        for (var i = 0; i < items.length-1; i++) {
          var item = items[i].split("-");
          menus.push({
            name: item[0],
            price: item[1],
            number: item[2]
          })
        }

        that.setData({
          addr: res.data[0].addr,
          menus: menus,
          notlike: res.data[0].notlike,
          comment: res.data[0].comment,
          phone: res.data[0].phone,
          total: res.data[0].total,
          ctime:app.formatDate(new Date(res.data[0].ctime)),
          isapproved: res.data[0].isapproved,
          id: res.data[0].ctime,
          username: res.data[0].username
        })




        

      })

  },
  cancelorder: function () {
    console.log('cancel')
    wx.showModal({
      title: '提示',
      content: '确认取消订单？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
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