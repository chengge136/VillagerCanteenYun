// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  return await db.collection('order').where({
    isapproved: event.isapproved,
    subtype: event.subtype
  }).get()
}
