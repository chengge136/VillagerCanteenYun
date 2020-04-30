// canteen/addmenu/addmenu.js
var app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    imagePath: '',
    name: '',
    price: 0,
    disabled:false,
    balance:0,
    phone:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('id:' + options.id)
    var id = options.id;
    var that = this;
    var userDetail = wx.getStorageSync('userDetail');

    that.setData({
      balance: userDetail.balance,
      phone: userDetail.phone
    })

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
  cusServer() {
    wx.showToast({
      title: '暂不支持',
      icon: 'none',
      duration: 2000,

    })
  },
  userCart(){
    wx.redirectTo({
      url: '../userCart/userCart'
    })
  },

  addToCart: function (event) {

    //将购物车数据添加到缓存
    var that = this
    //获取缓存中的已添加购物车信息
    var cartItems = wx.getStorageSync('cartItems') || []
    console.info("缓存数据：" + cartItems);
    //判断购物车缓存中是否已存在该货品
    var exist = cartItems.find(function (ele) {
      return ele.id === that.data.id
    })
    console.log(exist)
    if (exist) {
      //如果存在，则增加该货品的购买数量
      exist.quantity = parseInt(exist.quantity) + 1
    } else {
      //如果不存在，传入该货品信息
      cartItems.push({
        id: that.data.id,
        quantity: 1,
        price: that.data.price,
        name: that.data.name,
        imagePath: that.data.imagePath
      })
    }
    //加入购物车数据，存入缓存
    wx.setStorage({
      key: 'cartItems',
      data: cartItems,
      success: function (res) {
        //添加购物车的消息提示框
        wx.showToast({
          title: "添加购物车",
          icon: "success",
          durantion: 2000
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000) //延迟时间
      }
    })
  },
  buyNow() {
    var that = this;

    const _ = db.command;
    db.collection('order').where({
      phone: _.eq(that.data.phone),
      isapproved: _.eq(false)
    }).count({
      success: function (res) {
        console.log('已经提交了', res.total)
        if (res.total > 0) {
          wx.showModal({
            title: '提示',
            content: '已经提交了订单，请勿重复提交',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else if (that.data.name == "套餐饭") {
          var total = that.data.price;
          var newbalance = that.data.balance - total;
          wx.showModal({
            title: '提示',
            content: '确认只提交套餐订单？',
            success(res) {
              if (res.confirm) {
                that.setData({ disabled: true });
                console.log("生成订单，还剩下余额：", newbalance)
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
                    app.modifyBalance(newbalance);
                    var menus = that.data.name + '-' + that.data.price + '-1;'
                    app.createOrder(that.data.name, menus, '略', total);
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showToast({
            title: "只有套餐支持立即下单",
            icon: "none",
            durantion: 2000
          })
        }
      }
    })
  },
  //图片点击事件
  imgYu: function (event) {
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