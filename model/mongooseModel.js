const mongoose = require('mongoose');


const personSchema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    username:{
          type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:18
    }
}
)





const movieschema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    cast:[{name:{
          type:String,
        required:true},
        profession:{
            type:String,
          },
        
    }],
    crew:[{name:{
        type:String,
      required:true},
      profession:{
        type:String,
      }
      
  }],
  rating:{
    type:Number,
    required:true,
    default:null
  },
  launguage:{
    type:String,
    required:true
},
genere:{
    type:String,
    required:true,
    default:null
},
certified:{
    type:String,
    required:true,
    default:'U'
},
length:{
    type:String,
    required:true,
    default:null
},
released_on:{
    type:Date,
    required:true,
    default:null
}

   
}
)





const Theatreschema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    screen:{name:{
        type:String,
      required:true},
      movie:{
        type:String,
      required:true},
      seatBooked:[
       { type:String,
        default:null}
      ],
      seatHolded:[
        {type:String,
        default:null}
      ]},
      address:[{city:{
        type:String,
        required:true
    },place:{
        type:String,
        required:true
    }}]
}
)


module.exports={
                UserDetails : mongoose.model('UserDetails',personSchema),
                
                CinemaHall : mongoose.model('CinemaHall',Theatreschema),
                
                MovieCollection : mongoose.model('MovieCollection',movieschema)
            }

