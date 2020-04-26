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
  onLoad: function (options) {
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
  buyNow(){
    
    if (this.data.name =="套餐饭"){
      console.log("立即购买");
    }else{
      wx.showToast({
        title: "只有套餐支持立即下单",
        icon: "none",
        durantion: 2000
      })
    }
    
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