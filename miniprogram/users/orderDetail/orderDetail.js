// users/orderDetail/orderDetail.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id:'',
    id:'',
    addr: '',
    notlike: '',
    comment: '',
    phone: '',
    total: '',
    ctime: '',
    username:'',
    isapproved: false,
    refundclick: false,
    reason:'',
    menus:[],
    subtype:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _id = options._id;
    var that = this;
    that.setData({
      _id: _id
    });
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
          username: res.data[0].username,
          subtype: res.data[0].subtype
        })
        
      })

  },
  cancelorder: function () {
    var that=this;
    console.log('cancel')
    wx.showModal({
      title: '提示',
      content: '确认取消订单？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.cancel(that.data._id);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //退回订单
  refund(){
    if(!this.data.refundclick){
      this.setData({
        refundclick: true
      })
    }else{
      this.setData({
        refundclick: false
      })
    }
    
  },
  reasonIn: function (event) {
    var that = this;
    that.setData({
      reason: event.detail
    })
  },
  submitrefund(){
    if (this.data.reason!=''){
      console.log('reason:', this.data.reason);
      app.refund(this.data._id, this.data.reason)
    }else{
      wx.showToast({
        title: '请输入退款理由'
      })
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