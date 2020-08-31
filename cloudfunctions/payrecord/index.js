// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('user_pay_record').add({
    data: {
      name:event.name,
      phone: event.phone,
      income: event.income,
      comment:event.comment,
      updatedby:event.updatedby,
      type:event.type,
      ctime:new Date().getTime()
    }
  })
    .then(console.log)
    .catch(console.error)

}

