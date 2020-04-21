// users/userCart/userCart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [], //数据 
    iscart: false,
    hidden: null,
    isAllSelect: false,
    totalMoney: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  flash() {
    var arr = wx.getStorageSync('cartItems') || [];
    if (arr.length > 0) {
      var sum = 0
      for (var i = 0; i < arr.length; i++) {
        sum += arr[i].price * arr[i].quantity
      };
      // 更新数据  
      this.setData({
        carts: arr,
        iscart: true,
        hidden: false,
        totalMoney: sum * 100
      });
    }
  },
  add: function (event){
    var that=this;
    console.log("add")
    console.log(event.currentTarget.dataset.id);
    var cartItems = wx.getStorageSync('cartItems') || []
    var exist = cartItems.find(function (ele) {
      return ele.id === event.currentTarget.dataset.id
    })
    if (exist) {
      //如果存在，则增加该货品的购买数量
      exist.quantity += 1;
      console.log("现在的数量是:", exist.quantity)
      wx.setStorage({
        key: 'cartItems',
        data: cartItems,
        success: function (res) {  
          wx.showToast({
            title: "加一份",
            icon: "success",
            durantion: 2000
          })
          //刷新页面     
          that.flash();
        }
      })
    }

  },

  remove: function (event) {
    var that = this;
    var index=0;
    var goodname='';
    var arr = wx.getStorageSync('cartItems') || [];
    for (var i = 0; i < arr.length; i++) {
      // var index = arr[i].indexOf(event.currentTarget.dataset.id)           
      if (arr[i].id == event.currentTarget.dataset.id) {
        index=i;
        goodname = arr[i].name;
      }
    }
    console.log("remove")
    wx.showModal({
      title: '提示',
      content: '确认删除 ' + goodname+' 吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          
          if (arr.length==1){
            wx.removeStorageSync('cartItems')
            setTimeout(function () {
              wx.redirectTo({
                url: '../userIndex/userIndex'
              })
            }, 1000) //延迟时间
          }else{
            
            console.log('delete the number ', index)
            arr.splice(index, 1);
            //删除现有缓存
            wx.removeStorageSync('cartItems')
            //导入新的数据包
            wx.setStorage({
              key: 'cartItems',
              data: arr,
              success: function (res) {
                wx.showToast({
                  title: "删除成功",
                  icon: "success",
                  durantion: 2000
                })
                //刷新页面     
                 that.flash();
              }
            })

          }
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
    // 获取产品展示页保存的缓存数据（购物车的缓存数组，没有数据，则赋予一个空数组）  
    var arr = wx.getStorageSync('cartItems') || [];
    console.info("缓存数据：" + arr);
    // 有数据的话，就遍历数据，计算总金额 和 总数量  
    if (arr.length > 0) {
      var sum=0
      for (var i = 0; i < arr.length; i++) {
        sum += arr[i].price * arr[i].quantity
      };
      // 更新数据  
      this.setData({
        carts: arr,
        iscart: true,
        hidden: false,
        totalMoney: sum*100
      });
      console.log('合计：',sum)

      console.info("缓存数据：" + this.data.carts);
    } else {
      this.setData({
        iscart: false,
        hidden: true,
      });
    }
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