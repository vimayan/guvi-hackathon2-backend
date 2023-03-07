const {UserDetails,CinemaHall,MovieCollection} =require('../model/mongooseModel')
const bcrypt = require('bcryptjs')
const joi = require("joi")
const jwt = require('jsonwebtoken')

const registerSchema =joi.object({
    email: joi.string().min(6).required(),
        username: joi.string().min(3).max(16).required(),
        password: joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(8).required(),
        age: joi.number().required()
})

exports.createUser = async (req, res) => {
   
    const email = req.body.email;
    const user= await UserDetails.findOne({email:email})
    if(user){
            return res.end('email already exist')
            }
    
    const hashpassword= await bcrypt.hash(req.body.password,10)

    const Userdetails = new UserDetails({
        email: req.body.email,
        username: req.body.username,
        password: hashpassword,
        age:req.body.age
    })
try{
    const {error} = await registerSchema.validateAsync(req.body)
  
    // Save Tutorial in the database
   if(error){
          return res.status(400).send(error.details[0].message);

   } 


   else{
    
    await Userdetails.save()      
       return res.end('user registerd successfully')  
        }


}
catch(error){
res.status(500).send(error)
}
};



const loginSchema =joi.object({
    email: joi.string().min(6).required(),
    password: joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(8).required()
}).with('username','password')

exports.loginUser=async (req,res)=>{

const email = req.body.email

    const user= await UserDetails.findOne({email: email})
    if(!user){
        return res.end('email id not exist please register');
     }
    const validpassword = await bcrypt.compare(req.body.password,user.password)
if(!validpassword){
   return res.end('please enter valid password')
}
else{
    const useraccess=user.isadmin?true:false
    const userkey= await user.isadmin?process.env.SECRET_KEY:process.env.ADMIN_KEY

    const token = jwt.sign({email:req.body.email},userkey)
   return res.json({token:token,username:user.username,admin:useraccess})
}

}


exports.showMovies = async (req, res) => {
    
  
    MovieCollection.find()
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `no cinemahall exist!`
          });
        } else {
            
          res.status(200).send(data);
          
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });


   
  };


  exports.showCinemaHall = async (req, res) => {

  CinemaHall.find()
  .then(data => {
    if (!data) {
      res.status(404).send({
        message: `no cinemahall exist!`
      });
    } else {
        
      res.status(200).send(data);
      
    }
  })
  .catch(err => {
    res.status(500).send(err);
  });
}




exports.ticketPayment = (req,res)=>{

  const id = req.body.id;
   const seatBooked = req.body.userSelected


CinemaHall.findOneAndUpdate({"_id": id},   {$addToSet: {'screen.seatBooked':seatBooked }}, {returnDocument: "after"})
.then((data)=>{
  res.send(data.screen.seatBooked)
})


}

