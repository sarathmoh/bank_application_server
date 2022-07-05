//json webtoker import

const jwt = require('jsonwebtoken')

//import db
const db = require('./db')



database = {
  1000: { acno: 1000, uname: "neer", password: 1000, balance: 5000, transaction: [] },
  1001: { acno: 1001, uname: "june", password: 1001, balance: 4000, transaction: [] },
  1002: { acno: 1002, uname: "may", password: 1002, balance: 3000, transaction: [] }
}



//register - index.js will give uname ,acno,password
const register = (uname, acno, password) => {

  //asynchronous
  return db.Bank.findOne({ acno })
    .then(user => {
      if (user) {
        //already exist
        return {
          statusCode: 404,
          status: false,
          message: "account number already  exist.."

        }
      }
      else {
        const newUser = new db.Bank({
          acno,
          uname,
          password,
          balance: 0,
          transaction: []
        })
        newUser.save()
        return {
          statusCode: 201,
          status: true,
          message: "successfully registered..Please login"
        }
      }


    })
}

//login
const login = (acno, pswd) => {

  return db.Bank.findOne({ acno,password:pswd})
    .then(user => {
      if (user) {
        currentUser = user.uname
        currentAcno = acno
        //token generate

        const token = jwt.sign(
          { currentAcno: acno },process.env.TOKEN_SECRET)


        return {
          statusCode: 200,
          status: true,
          message: "Login succesfull",
          token,
          currentAcno,
          currentUser
        }
      }
      else {
        return {
          statusCode: 404,
          status: false,
          message: "invalid credential..!"
        }
      }
    })



}

//deposit
const deposit = (acno, pswd, amt) => {
  var amount = parseInt(amt)

return db.Bank.findOne({acno,password:pswd,amt})
.then(user=>{
  if(user){
    user.balance += amount
    user.transaction.push({
        type: "credit",
        amount: amount
      })
      user.save()
      return {

        statusCode: 200,
        status: true,
        message: amount + " successfully deposited.. and new balance is:" + user.balance
      }

  }
  else {
    return {
      statusCode: 404,
      status: false,
      message: "invalid credential..!"
    }
  }
  
})

}
  


//withdrawal

const withdraw = (req, acno, pswd, amt) => {
  var amount = parseInt(amt)

  return db.Bank.findOne({acno,password:pswd,amt})
  .then(user=>{
    if (req.currentAcno != acno) {
      return {
        statusCode: 404,
        status: false,
        message: "Operation denied!!!"
      }
    }

    if(user){
      if (user.balance>amount) {
        user.balance-= amount
        user.transaction.push({
          type: "debit",
          amount: amount
        })
        user.save()

        return {
          statusCode: 201,
          status: true,
          message: amount + " successfully debited ,balance:" + user.balance
        }
      }
      else {

        return {
          statusCode: 404,
          status: false,
          message: "insufficient balance"
        }
      }

    }
    else {
      return {
        statusCode: 404,
        status: false,
        message: "invalid credential..!"
      }
    }
  })


  


 

}

//transaction history

const transactions = (acno) => {
  return db.Bank.findOne({acno})
  .then(user=>{
    if(user){
      return {
        statusCode: 201,
        status: true,
        transaction:user.transaction
  
      }

    }
    else {
      return {
        statusCode: 404,
        status: false,
        message: "user doesnot exist"
      }
  
    }
  })
  
  

}


//delete acc
         
const deleteAcc=(acno)=>{
  return db.Bank.deleteOne({acno})
  .then(user=>{
    if(!user){
      return{
        statusCode: 404,
        status: false,
        message: "operatin failed"
      }
    }
    else{
      return {
        statusCode: 201,
        status: true,
        message:"Account number" +acno+ "deleted successfully"
  
      }
    }
  })
}
//export

module.exports = {
  register,
  login,
  deposit,
  withdraw,
  transactions,
  deleteAcc
}