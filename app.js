
require("dotenv").config();
const express = require("express");
const app = express();
const {hashSync, compareSync} = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Student = require("./data");

app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());

require("./passport");

app.get("/", function(req,res){
  Student.find({}, function(err,founditem){
    if(!err)
    res.send(founditem);
    else
    res.send(err)
  })
})

// Student register API
app.post("/register", function(req,res){
    const users = new Student({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email : req.body.email,
        password : hashSync(req.body.password , 10)
    });
       console.log(users.email, users.password);
   
   users.save().then(function(users){
    res.send({
        success : "User is registered",
        message : "Success",
        user : {
            email : users.email,
            id : users._id
        }
    });
   }).catch(function(err){
    res.send({
        success : "User failed to register",
        err0r : err
    })
   })
});

// Student register API

app.post("/login", function(req,res){
    Student.findOne({email : req.body.email}).then(function(user){
        //No user Found
        if(!user){
           return res.status(401).send({
            message : "No user found",
            success : false
           })
        }
              //Incorrect password
        if(!compareSync(req.body.password , user.password)){
            return res.status(401).send({
                message : "Incorrect Password",
                success : false
            })
        }
        //User Found
         const payload = {user : user.email, id : user._id}
         const token = jwt.sign(payload , process.env.WEB_TOKEN, {expiresIn : '7d'})
         return res.status(200).send({
                 message : "Successfully Logged In",
                 success : true,
                 user : {
                   email : user.email,
                   id : user._id
                 },
                 token : "Bearer " + token
         })
    })

})

// For Adding Favourite Teacher API
app.patch("/favourite", passport.authenticate("jwt", {session : false}), function(req,res){   
    Student.findOneAndUpdate(
        {email: req.user.email},
        {$set : req.body},
        function(err){
     if(!err)
     console.log("success");
        }
        )
    res.status(200).send({
        teacher: req.body.teacher,
        success : true,
        message: "right",
        email : req.user,
    });
})

// For Removing Favourite Teacher API
app.delete("/favourite", passport.authenticate("jwt", {session : false}), function(req,res){   
    Student.deleteOne(
        {teacher: req.body.teacher},
        function(err,result){
     if(!err)
     {
     console.log("success");
     res.send({
        teacher: req.body.teacher,
        success : true,
        message: "Teacher is removed",
        email : req.user,
     });
    }
})  
})

// Favourite Teacher API using MongoDB aggregation
app.get("/fav_teacher", function(req,res){
    
    const pipeline = [
        {"$group" : { "_id": "$teacher", "count": { "$sum": 1 } } },
        {"$match": {"_id" :{ "$ne" : null } , "count" : {"$gt": 1} } }, 
        {"$project": {"name" : "$_id", "_id" : 0} }
    ];
    Student.aggregate(pipeline,function(err,data){
        if(!err)
        res.send({
            favourite_teacher : data[0].name,
        });
    });
}
// Finding Favourite Teacher Javascript Code

//     Student.find({}).then(function(result){
//         // res.send(result);
//         // result.map(function(teach){
//         //     console.log(teach.teacher);
//         // })
//         var l =0;
//         var max = 0;
//         var ele = "";
//         for(let i=0;i<result.length-1;i++)
//         {
//             if(result[i].teacher == result[i+1].teacher)
//             {
//                 l++;
//             }
//             if(l > max)
//             {
//                 max = l;
//                 ele = result[i].teacher;
//             }
//         }
//            res.send(ele);
//     })
)

// FOR DELETING DOCUMENTS
app.delete("/", function(req,res){
    Student.deleteMany({}, function(err){
        if(!err)
        res.send("Success")
        else
        res.send("Error")
    })
});

app.listen(3000,function(req,res){
    console.log("Started at 3000");
})