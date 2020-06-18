// users/userCart/userCart.js
const db = wx.cloud.database();
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    carts: [], //数据 
    isempty: null,
    totalMoney: 0,
    balance:0,
    comment:'',
    about:'',
    menus:'',
    phone:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var userDetail = wx.getStorageSync('userDetail');
    console.log('用户余额有：', userDetail.balance)
    that.setData({
      balance: userDetail.balance,
      phone: userDetail.phone
    })
  },
  inputComment: function (e) {
    var that = this;
    console.log('comment',e.detail.value)
    that.setData({
      comment: e.detail.value
    })
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
        isempty: false,
        totalMoney: sum * 100
      });
    }
  },
  add: function (event){
    var that=this;
    console.log("add",event.currentTarget.dataset.id);
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
      content: '确认不要 ' + goodname+' 了吗？',
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
    console.log('菜品样式有：',arr.length)
    // 有数据的话，就遍历数据，计算总金额 和 总数量  
    if (arr.length > 0) {
      var sum=0;
      var about='';
      var menus='';
      for (var i = 0; i < arr.length; i++) {
        sum += arr[i].price * arr[i].quantity
        about += arr[i].name+' '
        menus += arr[i].name +'-'+ arr[i].price +'-'+ arr[i].quantity+';'
      };
      // 更新数据  
      this.setData({
        carts: arr,
        isempty: false,
        totalMoney: sum*100,
        about: about,
        menus: menus
      });
      console.log('about', about)
      console.log('menus', menus)

    } else {
      this.setData({
        isempty: true,
      });
    }
  },
  Submit(){

    var that = this
    var total = that.data.totalMoney * 0.01;
    var newbalance = that.data.balance - total;

    if (newbalance < 0) {
      console.log("账户余额不足，请先充值！")
      that.setData({ disabled: true });
      wx.showToast({
        title: '账户余额不足，请先充值！',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确认提交订单了吗？',
        success(res) {
          if (res.confirm) {
            that.setData({ disabled: true });
            wx.removeStorageSync('cartItems'); //下单后清空购物车
            // 1,扣款,存入新的余额信息，更改缓存
            var userDetail = wx.getStorageSync('userDetail');
            console.log('当前余额：', userDetail.balance)
            userDetail.balance = newbalance;
            wx.setStorage({
              key: 'userDetail',
              data: userDetail,
              success: function (res) {
                var userDetail = wx.getStorageSync('userDetail');
                console.log('userDetail:', userDetail);
                //2，更改数据库 --> a：修改账户余额，b：新增订单数据
                app.modifyBalance(-total);
                app.createOrder(that.data.about, that.data.menus, that.data.comment, total);
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