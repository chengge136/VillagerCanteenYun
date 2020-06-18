// canteen/addmenu/addmenu.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cut_60: 0,
    cut_70: 0,
    cut_80: 0,
    disabled:false,
    array: ['18', '19', '20', '21','22','23','24'],
    index:1,
    active: false,
    ret_50: 0,
    ret_100: 0,
    ret_200: 0,
    ret_500: 0,
    ret_1000: 0


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    db.collection('discount').where({
      type: _.eq(0)
    }).get().then(res => {
        console.log(res.data[0]);
        that.setData({
          cut_60: res.data[0].cut_60,
          cut_70: res.data[0].cut_70,
          cut_80: res.data[0].cut_80,
          index: res.data[0].deadline
        })
      })

      db.collection('discount').where({
        type: _.eq(1)
      }).get().then(res => {
          console.log(res.data[0]);
          that.setData({
            ret_50: res.data[0].ret_50,
            ret_100: res.data[0].ret_100,
            ret_200: res.data[0].ret_200,
            ret_500: res.data[0].ret_500,
            ret_1000: res.data[0].ret_1000,
            active: res.data[0].active
          })
        })

  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  save: function () {
    var that=this;
    if (that.data.cut_60 > that.data.cut_70 || 
        that.data.cut_70 > that.data.cut_80
    ){
      wx.showToast({
        title: '请遵守减免规则',
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
          console.log('that.data.index',that.data.index);
          wx.cloud.callFunction({
            name: 'discount',
            data: {
              cut_60: that.data.cut_60,
              cut_70: that.data.cut_70,
              cut_80: that.data.cut_80,
              deadline: that.data.index
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
  saveret: function () {
    var that=this;
    if (that.data.ret_50 - that.data.ret_100>0 || 
        that.data.ret_100 - that.data.ret_200>0 ||
        that.data.ret_200 - that.data.ret_500>0 ||
        that.data.ret_500 - that.data.ret_1000>0
    ){
      wx.showToast({
        title: '请遵守余额赠送规则',
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
            name: 'balancegiv',
            data: {
              ret_50: parseInt(that.data.ret_50),
              ret_100: parseInt(that.data.ret_100),
              ret_200: parseInt(that.data.ret_200),
              ret_500: parseInt(that.data.ret_500),
              ret_1000: parseInt(that.data.ret_1000),
              active: that.data.active
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
  onChange({ detail }) {
    console.log(detail);
    this.setData({ active: detail });
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
  inputret_50:function (event) {
    var that = this;
    that.setData({
      ret_50: event.detail
    })
  },
  inputret_100:function (event) {
    var that = this;
    that.setData({
      ret_100: event.detail
    })
  },
  inputret_200:function (event) {
    var that = this;
    that.setData({
      ret_200: event.detail
    })
  },
  inputret_500:function (event) {
    var that = this;
    that.setData({
      ret_500: event.detail
    })
  },
  inputret_1000:function (event) {
    var that = this;
    that.setData({
      ret_1000: event.detail
    })
  },

})