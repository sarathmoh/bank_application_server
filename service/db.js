//database connection
//import mongoose
const mongoose=require('mongoose')


//connection string to connect db with server

mongoose.connect('mongodb://localhost:27017/bankServer',{
    useNewUrlParser:true
})

//create a model
const Bank= mongoose.model('Bank',{
    acno: Number,
    uname: String,
    password: String,
    balance: Number,
     transaction: [] 
})


module.exports={
    Bank
}