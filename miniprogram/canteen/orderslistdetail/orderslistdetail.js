// canteen/orderslistdetail/orderslistdetail.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordercount: 0,
    total: 0,
    approvedid:0,
    menulists: [],
    menulist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('approvedid:' + options.approvedid);
    var approvedid = parseInt(options.approvedid)
    that.setData({
      approvedid: approvedid
    })
    var menulists = [];
    const _ = db.command;
    //1，获取菜单名
    var menus = wx.getStorageSync('menus');

    for (var i = 0; i < menus.length; i++) {
      menulists.push({
        name: menus[i].name,
        count: 0
      })
    }
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getorderbyid',
      data: {
        approvedid: approvedid
      }
    }).then(res => {
      // 返回所有还没通过的新订单
      var menulist = res.result.data;
      var ordercount = res.result.data.length;
      var total = 0;
      if (ordercount > 0) {
        for (var i = 0; i < ordercount; i++) {
          total += parseInt(menulist[i].total);
          //处理每一条订单的菜品字段
          var items = menulist[i].menus.split(";");
          for (var j = 0; j < items.length - 1; j++) {
            var item = items[j].split("-");
            for (var k = 0; k < menulists.length; k++) {
              if (item[0] == menulists[k].name) {
                menulists[k].count += parseInt(item[2]);
              }
            }
          }
        }
        that.setData({
          total: total,
          isempty: false,
          ordercount: ordercount,
          menulists: menulists,
          menulist: menulist
        })

      } else {
        that.setData({
          isempty: true
        })
      }


    }).catch(err => {
      // handle error
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