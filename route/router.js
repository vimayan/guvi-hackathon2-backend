 const route = require('express').Router();
 const controllerUser = require('../controller/controllerUser')
 const controllerAdmin = require('../controller/controllerAdmin')

route.get('/',(req,res)=>{
res.end('hello there')
})


route.post('/register',controllerUser.createUser);
route.post('/login',controllerUser.loginUser);
// Router.post('/home/:username',controller.homepage)


// Router.post("/home/admin")

route.post("/addmovie/admin",controllerAdmin.verify,controllerAdmin.addMovies);
route.delete("/deletemovie/admin/:id",controllerAdmin.verify,controllerAdmin.deletemovie);




route.post("/addcinemahall/admin",controllerAdmin.verify,controllerAdmin.addCinemaHall);
route.delete("/deletecinemahall/admin/:id",controllerAdmin.verify,controllerAdmin.deleteCinemahall);
route.post("/showallcinemahall/admin/",controllerAdmin.verify,controllerAdmin.showCinemahall);



route.use('*', (req,res)=>{
    res.status(400).end("page not found")
});



module.exports = route;