//SERVER CREATION

//IMPORT EXPRESS
const express=require('express');

//import cors

const cors=require('cors')

//data service
const dataService=require('./service/data.service')

//CREATE SERVER APP USING EXPRESS
const app=express()

//use cors

app.use(cors({
    origin:'http://localhost:4200'
}))

//to parse json data
app.use(express.json())

//RESOLVING API CALL
//GET-TO READ DATA
app.get('/',(req,res)=>{
    res.send("GET REQUEST");
}) 

//POST-TO CREATE DATA
app.post('/',(req,res)=>{
    res.send("POST REQUEST");
})

//PUT-TO UPDATE/MODIFY DATA
app.put('/',(req,res)=>{
    res.send("PUT REQUEST");
})

//PATCH-TO UPDATE/MODIFY SPECIFIC DATA
app.patch('/',(req,res)=>{
    res.send("PATCH REQUEST");
})

//DELETE-TO CREATE DATA
app.delete('/',(req,res)=>{
    res.send("DELETE REQUEST");
})

//BANK SERVER
//router specific middleware

const jwtMiddleWare=(req,res,next)=>{
   try {
       const token=req.headers["x-access-token"]        
   const data= jwt.verify(token,'supersecret123456789')
   req.currentAcno=data.currentAcno
   next()
   }
   catch{
       res.status(401).json({
           status:false,
           message:"Please login!!!"
       })
   }

}

//applicaton specific middleware
//logMiddleWare

const logMiddleWare=(req,res,next)=>{
    console.log("application specific middleware excecuted");
    next()

}
app.use(logMiddleWare)

//json webtoker import

const jwt= require('jsonwebtoken')




//REGISTER API

app.post('/register',(req,res)=>{
    
    dataService.register(req.body.uname,req.body.acno,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})


//login

app.post('/login',(req,res)=>{
    dataService.login(req.body.acno,req.body.pswd)
    .then(result=>{ res.status(result.statusCode).json(result)
    })
})

//deposit

app.post('/deposit',jwtMiddleWare,(req,res)=>{
    dataService.deposit(req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{res.status(result.statusCode).json(result)
})
})
app.post('/withdraw',jwtMiddleWare,(req,res)=>{
    dataService.withdraw(req,req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{res.status(result.statusCode).json(result)
})
})

app.post('/transactions',jwtMiddleWare,(req,res)=>{
    dataService.transactions(req.body.acno)
    .then(result=>{res.status(result.statusCode).json(result)
})
})


//ondelete API call
app.delete('/onDelete/:acno',jwtMiddleWare,(req,res)=>{
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})


//SET PORT NUMBER
app.listen(process.env.PORT,()=>{
    console.log("server started AT server");
})
