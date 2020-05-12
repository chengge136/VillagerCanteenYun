// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('batchorders').add({
    data: {
      approvedid: event.approvedid,
      username: event.username,
      phone: event.phone,
      addr: event.addr,
      count: event.count,
      total: event.total,
      selecteduserstr: event.selecteduserstr,
      comment: event.comment,
      ctime: event.ctime,
      isapproved: event.isapproved,
      subtype: event.subtype
    }
  })
    .then(console.log)
    .catch(console.error)

}

