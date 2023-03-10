const {UserDetails,CinemaHall,MovieCollection} =require('../model/mongooseModel')
const bcrypt = require('bcryptjs');
const JoiDate =require( "@joi/date");
const joi = require("joi").extend(JoiDate);

const jwt = require('jsonwebtoken');


const movieSchema =joi.object({
         name: joi.string().max(16).required(),
        cast:joi.array().items(joi.object({name:joi.string(),profession:joi.string()}),).required() ,
        crew: joi.array().items(joi.object({name:joi.string(),profession:joi.string()}),).required() ,
        rating: joi.number().max(10).required(),
        launguage:joi.string().max(16).required(),
        genere:joi.string().max(16).required(),
        certified:joi.string().max(6).required(),
        length:joi.string().max(16).required(),
        released_on: joi.date().raw(),



})

const cinemaHallSchema =joi.object({
    name: joi.string().max(16).required(),
    screen: joi.object({name:joi.string(),movie:joi.string(),seatBooked:joi.array(),seatHolded:joi.array()}).required(),
    address: joi.array().items(joi.object({city:joi.string(),place:joi.string()})) 
      



})

exports.verify=(req,res,next)=>{

    // console.log(JSON.stringify(req.headers['auth']));

    const token = req.headers['token']


    if(!token){
       return res.end("Access Denied")
    }
    try {
        jwt.verify(token,process.env.ADMIN_KEY, (err) => {

            if (err) {
              return res.status(401).send(
               err
              );
            }
            else
             {

              next()
            return;
            
                }
           
          });
        }
        catch(error){
            res.status(500).send(error)
        }
    


    

}

exports.addMovies= async (req,res)=>{
    console.log(req.data);

    const moviecollection = new MovieCollection({
        name: req.body.name,
        cast: req.body.cast,
        crew:req.body.crew,
        rating: req.body.rating,
        launguage:req.body.launguage,
        genere:req.body.genere,
        certified:req.body.certified,
        length:req.body.length,
        released_on: req.body.released_on,


    })


    try{

        
        const {error} = await movieSchema.validateAsync(req.body)
      
        // Save Tutorial in the database
       if(error){
       
              return res.status(400).send(error);
              
    
       } 
    
    
       else{
        console.log('data adding');
        
        
        await moviecollection.save()
        .then(data => {

          MovieCollection.find().then((newdata)=>{

            res.status(200).send(newdata)

          })


        }).catch(err=>{
            res.status(401).send(err)
        })
    };      
           
    
    }
    catch(error){
    res.status(500).send(error)
    }

 



}



exports.showmovies = (req, res) => {
    
  
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


exports.deleteMovie = (req, res) => {
    const id = req.params.id;
  
    MovieCollection.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete MovieCollection with id=${id}. Maybe MovieCollection was not found!`
          });
        } else {
            MovieCollection.find().then(newdata=>{
              console.log(newdata);
              res.status(200).send(newdata);
            })
            
          

        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  };





  exports.updateMovies = (req, res) => {

    MovieCollection.findOneAndUpdate({"_id":req.body._id}, {$set:{"name":req.body.name,"cast":req.body.cast,"crew":req.body.crew,"rating":req.body.rating,"genere":req.body.genere,
    "certified":req.body.certified,"length":req.body.length,"released_on":req.body.released_on}}, {returnDocument: "after"})
      .then(() => {
        MovieCollection.find().then((data)=>{
          res.send(data);
        })
       

      })
      .catch(err => {
        res.status(500).send(err);
      });
  };









exports.addCinemaHall= async (req,res)=>{
  

    const CinemaHallcollection = new CinemaHall({
        name: req.body.name,
        screen: req.body.screen,
        address:req.body.address,
       


    })


    try{

        
        const {error} = await cinemaHallSchema.validateAsync(req.body)
     
        
       if(error){
        console.log('error')
              return res.status(400).send(error);
              
    
       } 
    
    
       else{
      
        
        await CinemaHallcollection.save()
        .then(() => {
          CinemaHall.find().then((data)=>{
            res.send(data);
          })
         

        }).catch(err=>{
            res.status(401).send(err)
        })
    };      
           
    
    }
    catch(error){
    res.status(500).send(error)
    }

 



}


exports.deleteCinemahall = async (req, res) => {
    const id = req.params.id;

    await CinemaHall.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
            res.status(404).send({
              message: `Cannot delete CinemaHall with id=${id}. Maybe CinemaHall was not found!`
            });
          } else {
            CinemaHall.find().then((newdata)=>{
              res.send(newdata);
            })
          }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  };


  exports.showCinemahall = (req, res) => {
    

  
  
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
  };

  exports.updateCinemahall = (req, res) => {
    console.log(req.body._id);
    CinemaHall.findOneAndUpdate({"_id":req.body._id}, {$set:{"name":req.body.name,"screen":req.body.screen,"address":req.body.address}}, {returnDocument: "after"})
      .then(() => {
        CinemaHall.find().then((data)=>{
          res.send(data);
        })
       

      })
      .catch(err => {
        res.status(500).send(err);
      });
  };






  

exports.showUser = (req, res) => {
    
  
  UserDetails.find()
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `no user exist!`
        });
      } else {
          
        res.status(200).send(data);
        
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
};




exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  await UserDetails.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
          res.status(404).send({
            message: `Cannot delete user with id=${id}. Maybe user was not found!`
          });
        } else {
          UserDetails.find().then((newdata)=>{
            res.send(newdata);
          })
        }
    })
    .catch(err => {
      res.status(500).send(err);
    });
};



exports.updateUser = (req, res) => {
  
  UserDetails.findOneAndUpdate({"_id":req.body._id}, {$set:{"username":req.body.username,"email":req.body.email,"age":req.body.age}}, {returnDocument: "after"})
    .then(() => {
      UserDetails.find().then((data)=>{
        res.send(data);
      })
     

    })
    .catch(err => {
      res.status(500).send(err);
    });
};
