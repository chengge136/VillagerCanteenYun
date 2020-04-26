// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('wx_user').add({
    data: {
      openid: event.openid,
      nickName: event.nickName,
      avatarUrl: event.avatarUrl,
      name: event.name,
      address: event.address,
      phone: event.phone,
      notlike: event.notlike,
      password: event.password,
      sfzid: event.sfzid,
      balance: event.balance,
      ctime: event.ctime
    }
  })
    .then(console.log)
    .catch(console.error)

}

