const {admin,db,storage} = require("../../utils/admin")

const onUserDeleteAccount=(snap,context)=>{
    const {uid}= context.params
    let usersRef = db.collection("USERS").doc(uid)
    
}

module.exports={onUserDeleteAccount}