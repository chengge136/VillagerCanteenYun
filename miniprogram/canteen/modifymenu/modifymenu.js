// canteen/addmenu/addmenu.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    imagePath: '',
    name: '',
    price: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('id:' + options.id)
    var id = options.id;
    var that = this;
    const _ = db.command;
    db.collection('menu').where({
        _id: _.eq(id)
      })
      .get().then(res => {
        console.log(res.data[0]);
        that.setData({
          name: res.data[0].name,
          price: res.data[0].price,
          imagePath: res.data[0].img,
          id: options.id
        })
      })
  },
  couldmodify(){

  },
  removeitem:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '从菜单删除 ' + that.data.name + ' ？',
      success(res) {
        if (res.confirm) {
          console.log('id', that.data.id)
          wx.cloud.callFunction({
            name: 'removemenu',
            data: {
              id: that.data.id
            },
            success: res => {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000,
                success: function () {
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../menu/menu'
                    })
                  }, 1000) //延迟时间
                }
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
  },
  modifyprice: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '修改价格为 ' + that.data.price + ' 元？',
      success(res) {
        if (res.confirm) {
          console.log('id', that.data.id)
          wx.cloud.callFunction({
            name: 'modifyprice',
            data: {
              id: that.data.id,
              price: parseInt(that.data.price)
            },
            success: res => {
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 2000,
                success: function () {
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../menu/menu'
                    })
                  }, 1000) //延迟时间
                }
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

  },
  inputPrice: function(event) {
    var that = this;
    that.setData({
      price: event.detail
    })
  },

  //图片点击事件
  imgYu: function(event) {
    console.log(event)
    var imgArr = [];
    var src = event.currentTarget.dataset.src; //获取data-src
    imgArr[0] = src;
    //var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgArr
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})