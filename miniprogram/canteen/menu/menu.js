// canteen/menu/menu.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    menulists: [],
    pricelunch:'',
    desclunch:',',
    pricedinner: '',
    descdinner: ','
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    db.collection('menu').where(
      {
        type: _.eq(2)
      }
    ).get({
      success: function (res) {
        that.setData({
          menulists: res.data
        })
      }
    })

    db.collection('menu').where(
      {
        type: _.eq(1)
      }
    ).get({
      success: function (res) {
        console.log(res.data)
        for (var index in res.data) {
          if (res.data[index].name =="套餐饭午饭"){
            that.setData({
              pricelunch: res.data[index].price,
              desclunch: res.data[index].desc
            })
          } else if (res.data[index].name == "套餐饭晚饭"){
            that.setData({
              pricedinner: res.data[index].price,
              descdinner: res.data[index].desc
            })
          }
          
        }
        
      }
    })

  },
  onClickLeft() {
    wx.reLaunch({
      url: '../canteenIndex/canteenIndex',
    })
  },
  onClickRight() {
    wx.navigateTo({
      url: '../addmenu/addmenu',
    })
  },
  
  inputPriceL: function(event) {
    var that = this;
    that.setData({
      pricelunch: event.detail
    })
  },
  inputDescL: function (event) {
    var that = this;
    that.setData({
      desclunch: event.detail
    })
  },
  inputPriceD: function (event) {
    var that = this;
    that.setData({
      pricedinner: event.detail
    })
  },
  inputDescD: function (event) {
    var that = this;
    that.setData({
      descdinner: event.detail
    })
  },
  lunchupdate(){
    var that = this;
    if (that.data.pricelunch != '' && that.data.desclunch != ''){
      wx.showModal({
        title: '提示',
        content: '确认提交修改？',
        success(res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'modifytcmenu',
              data: {
                name: "套餐饭午饭",
                price: that.data.pricelunch,
                desc: that.data.desclunch
              },
              success: res => {
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 2000,
                })
              },
              fail: err => {
                // handle error
                console.log(err)
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  dinnerupdate(){
    var that = this;
    if (that.data.pricedinner != '' && that.data.descdinner != '') {
      wx.showModal({
        title: '提示',
        content: '确认提交修改？',
        success(res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'modifytcmenu',
              data: {
                name: "套餐饭晚饭",
                price: that.data.pricedinner,
                desc: that.data.descdinner
              },
              success: res => {
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 2000,
                  
                })
              },
              fail: err => {
                // handle error
                console.log(err)
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
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