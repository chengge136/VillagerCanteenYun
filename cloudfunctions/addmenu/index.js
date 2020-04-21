// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('menu').add({
    data: {
      name: event.name,
      price: event.price,
      img: event.img,
      type:2
    }
  })
    .then(console.log)
    .catch(console.error)

}

