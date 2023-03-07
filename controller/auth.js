const jwt = require('jsonwebtoken');

exports.auth=(req,res,next)=>{

    // console.log(JSON.stringify(req.headers['auth']));

    const token = req.headers.token;
    const user = req.params['username'] ;

    // console.log(token);

    if(!token){
       return res.end("Access Denied")
    }
    try {

        const userkey= user==="admin"?process.env.ADMIN_KEY:process.env.SECRET_KEY
        // console.log(userkey);
        jwt.verify(token, userkey, (err) => {
            if (err) {
              return res.status(401).send({
                message: "Unauthorized!"
              });
            }
            else {
                // console.log('verified'); 
                next()
                return;
            
                }
           
          });
        }
        catch(error){
            res.status(500).send(error)
        }


    }

   