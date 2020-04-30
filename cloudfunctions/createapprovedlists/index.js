// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('approvedlists').add({
    data: {
      approvedid: event.approvedid,
      ordercount: event.ordercount,
      total: event.total,
      menulists: event.menulists,
      ctime: event.ctime
    }
  })
    .then(console.log)
    .catch(console.error)

}

