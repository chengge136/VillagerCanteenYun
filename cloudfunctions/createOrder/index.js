// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('order').add({
    data: {
      username: event.username,
      addr: event.addr,
      about: event.about,
      menus: event.menus,
      notlike: event.notlike,
      comment: event.comment,
      phone: event.phone,
      total: event.total,
      ctime: event.ctime,
      isapproved: event.isapproved,
      subtype: event.subtype
    }
  })
    .then(console.log)
    .catch(console.error)

}

