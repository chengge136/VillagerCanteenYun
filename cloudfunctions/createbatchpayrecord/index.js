// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('user_batchpay_record').add({
    data: {
      income: event.income,
      ctime: event.ctime,
      updatedby: event.updatedby,
      addr: event.addr,
      phone: event.phone,
      count: event.count,
      paydetails: event.paydetails

    }
  })
    .then(console.log)
    .catch(console.error)

}

