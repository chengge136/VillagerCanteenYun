// canteen/newOrder/newOrder.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordercount:0,
    total:0,
    menulists:[],
    tclist:[],
    isempty: null,
    istcempty: null,
    noonquantity: 0,
    dinnerquantity: 0,
    tcquantity: 0,
    tctotal: 0,
    tcuser: 0,
    timedate:'',
    activelunch: '',
    activedinner: '',
    lunchorders: [],
    dinnerorders:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var menulists=[];
    const _ = db.command;
    //1，获取菜单名
    var menus = wx.getStorageSync('menus');
    
    for (var i = 0; i < menus.length; i++) {
      menulists.push({
        name: menus[i].name,
        count: 0
      })
    };
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getneworder',
      data: {
        isapproved: false,
        subtype:0
      }
    }).then(res => {
      // 返回所有还没通过的新订单
      var menulist = res.result.data;
      var ordercount = res.result.data.length;
      var total = 0;
      if (ordercount > 0) {
        for (var i = 0; i < ordercount; i++) {
          total += menulist[i].total;
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
          menulists: menulists
        })
      } else {
        that.setData({
          isempty: true
        })
      }
    }).catch(err => {
      // handle error
    })

    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getnewbatchorder',
      data: {
        isapproved: false,
        status:0
      }
    }).then(res => {
      // 返回所有还没通过的新订单
      var tclist = res.result.data;
      console.log('tclist',tclist);
      var tcquantity = tclist.length;
      var tctotal = 0;
      var tcuser = 0;
      var noonquantity=0;
      var dinnerquantity=0;

      if (tcquantity > 0) {
        console.log('tcquantity', tcquantity);
        //处理每一条订单的菜品字段、
        for (var i = 0; i < tcquantity; i++) {
          tctotal += tclist[i].total;
          tcuser += parseInt(tclist[i].count);
          if(tclist[i].tctype==0){
            noonquantity += tclist[i].count;
          }else{
            dinnerquantity += tclist[i].count;
          }
        }
        that.setData({
          istcempty: false,
          tclist:tclist,
          noonquantity: noonquantity,
          dinnerquantity: dinnerquantity,
          tcquantity: tcquantity,
          tctotal: tctotal,
          tcuser: tcuser
        })
        var lunchorders=[];
        var dinnerorders=[];
        for (var index in tclist) {
          if(tclist[index].tctype==0){
            lunchorders.push(tclist[index]);   
          }else{
            dinnerorders.push(tclist[index]);   
          }
        }
        console.log('lunchorders',lunchorders);
        console.log('dinnerorders',dinnerorders);

        that.setData({
          lunchorders:lunchorders,
          dinnerorders:dinnerorders
        });
        
        
      } else {
        that.setData({
          istcempty: true
        })
      }
    }).catch(err => {
      // handle error
    })




                 
  },
  activeLunch(event) {
    this.setData({
      activelunch: event.detail,
    });
  },
  activeDinner(event) {
    this.setData({
      activedinner: event.detail,
    });
  },
  approve: function () {
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确认通过审核？',
      success(res) {
        if (res.confirm) {
          that.approvefunction();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  tcapprove(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认通过审核？',
      success(res) {
        if (res.confirm) {
          that.tcapprovefunction();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  approvefunction(){
    var that = this;
    var approvedtime = new Date().getTime();
    //生成审批订单 approvedlists
    wx.cloud.callFunction({
      name: 'createapprovedlists',
      data: {
        approvedid: approvedtime,
        ordercount: that.data.ordercount,
        usercount: that.data.ordercount,
        total: that.data.total,
        menulists: that.data.menulists,
        ctime: approvedtime,
        type:0
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        // handle error
        console.log(err)
      }
    })
    //审批订单
    wx.cloud.callFunction({
      name: 'approve',
      data: {
        approvedid: approvedtime
      },
      success: res => {
        wx.showToast({
          title: '审批通过',
          icon: 'success',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              //要延时执行的代码
              wx.redirectTo({
                url: '../orderslist/orderslist'
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
  },
  tcapprovefunction(){
    var that = this;
    var approvedtime = new Date().getTime();
    //生成审批订单 approvedlists
    var tcmenulists=[];
    tcmenulists.push({ "count": that.data.noonquantity, "name": "套餐饭午餐" });
    tcmenulists.push({ "count": that.data.dinnerquantity, "name": "套餐饭晚餐" });

    //console.log(tcmenulists)

    wx.cloud.callFunction({
      name: 'createapprovedlists',
      data: {
        approvedid: approvedtime,
        ordercount: that.data.tcquantity,
        total: that.data.tctotal,
        usercount: that.data.tcuser,
        menulists: tcmenulists,
        ctime: approvedtime,
        type: 1
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        // handle error
        console.log(err)
      }
    })
    //审批订单
    wx.cloud.callFunction({
      name: 'tcapprove',
      data: {
        approvedid: approvedtime
      },
      success: res => {
        wx.showToast({
          title: '审批通过',
          icon: 'success',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              //要延时执行的代码
              wx.redirectTo({
                url: '../orderslist/orderslist'
              })
            }, 1000) //延迟时间
          }
        })
      },
      fail: err => {
        console.log(err)
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    that.setData({
      timedate: Y + '年' + M + '月' + D + '日'
    })

   
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