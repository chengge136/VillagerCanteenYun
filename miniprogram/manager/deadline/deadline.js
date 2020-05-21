// canteen/addmenu/addmenu.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cut_50:0,
    cut_60: 0,
    cut_70: 0,
    cut_80: 0,
    deadline:0,
    disabled:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    db.collection('discount').get().then(res => {
        console.log(res.data[0]);
        that.setData({
          cut_50: res.data[0].cut_50,
          cut_60: res.data[0].cut_60,
          cut_70: res.data[0].cut_70,
          cut_80: res.data[0].cut_80,
          deadline: res.data[0].deadline
        })
      })

  },
  save: function (fileId) {
    var that=this;
    if (that.data.cut_50=='' || 
      that.data.cut_60 == '' || 
      that.data.cut_70 == '' || 
      that.data.cut_80 == '' || 
      that.data.deadline == ''
    ){
      wx.showToast({
        title: '不能为空',
      })
    }else{




    wx.showModal({
      title: '提示',
      content: '确定要保存修改？',
      success(res) {
        if (res.confirm) {
          that.setData({
            disabled:true
          });
          wx.cloud.callFunction({
            name: 'discount',
            data: {
              cut_50: parseInt(that.data.cut_50),
              cut_60: parseInt(that.data.cut_60),
              cut_70: parseInt(that.data.cut_70),
              cut_80: parseInt(that.data.cut_80),
              deadline: parseInt(that.data.deadline),
            },
            success: res => {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    wx.navigateBack({
                      delta: 1
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

    }

  },

  inputcut_50: function (event) {
    var that = this;
    that.setData({
      cut_50: event.detail
    })
  },
  inputcut_60: function (event) {
    var that = this;
    that.setData({
      cut_60: event.detail
    })
  },
  inputcut_70: function (event) {
    var that = this;
    that.setData({
      cut_70: event.detail
    })
  },
  inputcut_80: function (event) {
    var that = this;
    that.setData({
      cut_80: event.detail
    })
  },
  deadlineset: function (event) {
    var that = this;
    that.setData({
      deadline: event.detail
    })
  },



})