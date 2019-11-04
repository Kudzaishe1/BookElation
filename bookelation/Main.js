const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const moment = require('moment');
const nodemailer = require('nodemailer');
const fs = require("fs");
var path = require('path');

mongoose.connect("mongodb+srv://LibraryAuth:LibraryAuth@cluster0-xmuhb.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true});
/////////////////////////////////////////////////////////Schemas
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  secure:false,
  port:25,
  auth: {
    user: 'groupassignmenttt@gmail.com',
    pass: 'Assignment123'
  },
  tls:{
    rejectUnauthorized:false,
  }
});

var MongoSchema = new mongoose.Schema({
  Name:String,
  Surname:String,
  DateOfBirth:String,
  Address:String,
  Email:String,
  PhoneNumber:Number,
  Password:String
});

var UserSch = new mongoose.Schema({
  Book_Id: {type: String, unique: true },
  Book_nam: {type: String},
  Edition: String,
  Book_url: String,
  Category: String,
  Status:String,
  descript: String,
  author: String 
});

var ReserveSchema = new mongoose.Schema({
  Book_Id:String,
  User_Email:String,
  date:String
});

var ReturnSchema = new mongoose.Schema({
  Book_idreturn: {type: String},
  return_date: {type: String},
  User_Email:String,
  Librarian: String
});
///////////////////////////////////////////////
var app = express();
var LibraryUsers = mongoose.model('LibraryUsers',MongoSchema);
var BookAdmin = mongoose.model('BookAdmin',UserSch);
var urlencodedParser = bodyParser.urlencoded({extended:false});
var Reserve_Book = mongoose.model('Reserve_Book',ReserveSchema);
var Return_Book = mongoose.model('Return_Book',ReturnSchema);

//////////////////////////////////////////////
app.use("/assets",express.static("assets"));
app.use(express.static(path.join(__dirname, 'public')));
app.set('Views', path.join(__dirname, ''));
app.set('view engine','ejs');

//////////////////////////////////////Sessions
const{
    PORT =  process.env.PORT || 3000,
    SESS_NAME = 'sid',
    IN_PROD = true,
    MAX_LIFETIME = 1
} = process.env

app.use(session({
    name:SESS_NAME,
    resave:false,
    saveUninitialized:false,
    secret:"sdaaaaaaaaaaaaaaaaafdsdf/////////';l'plp'poph;g",
}))

const Redirect_Login = (req,res,next) =>
{
 
  if(!req.session.user)
  {
    res.redirect('/');
  }

  else{
    next();    
  }
}
const Redirect_Home = (req,res,next) => 
{
 
  if(req.session.user)
  {
    res.redirect('/Home');
  }
  else{
    next();    
  }
}
const Redirect_Admin = (req,res,next) => 
{
 
  if(req.session.user !== "Admin@Library.com")
  {
      res.redirect('/');
  }
  else{
    next();    
  }
}

////////////////////////////////////////////
/* Get Methods for the pages*/
app.get('/',Redirect_Home,function(req,res){
    res.render('login',{Error:"LOG IN HERE"});
});

app.get('/No_Results',Redirect_Login,function(req,res){
  res.render('500error');
});

app.get('/Admin',Redirect_Admin,function(req,res){
  res.render('admin_add');
});

app.get('/Home',Redirect_Login,function(req,res){
  res.render('home');
});

app.get('/Arts',Redirect_Login,function(req,res){
  BookAdmin.find({Category:'Arts'},{'Book_url':1, "_id":0},function(err,data){
    if(err) throw err;
    res.render('Arts',{Image:data});
  });
});

app.get('/Medical',Redirect_Login,function(req,res){
  BookAdmin.find({Category:'Medical'},{'Book_url':1, "_id":0},function(err,data){
    if(err) throw err;
    res.render('Medical',{Image:data});
  });
});

app.get('/Business',Redirect_Login,function(req,res){
  BookAdmin.find({Category:'Business'},{'Book_url':1, "_id":0},function(err,data){
    if(err) throw err;
    res.render('Business',{Image:data});
  });
});

app.get('/Education',Redirect_Login,function(req,res){
  BookAdmin.find({Category:'Education'},{'Book_url':1, "_id":0},function(err,data){
    if(err) throw err;
    res.render('Education',{Image:data});
  });
});

app.get('/History',Redirect_Login,function(req,res){
  BookAdmin.find({Category:'History'},{'Book_url':1, "_id":0},function(err,data){
    if(err) throw err;
    res.render('History',{Image:data});
  });
});

app.get('/Lifestyle',Redirect_Login,function(req,res){
  BookAdmin.find({Category:'Lifestyle'},{'Book_url':1, "_id":0},function(err,data){
    if(err) throw err;
    res.render('Lifestyle',{Image:data});
  });
});

app.get('/Religion',Redirect_Login,function(req,res){
  BookAdmin.find({Category:'Religion'},{'Book_url':1, "_id":0},function(err,data){
    if(err) throw err;
    res.render('Religion',{Image:data});
  });
});

app.get('/Science',Redirect_Login,function(req,res){
  BookAdmin.find({Category:'Science'},{'Book_url':1, "_id":0},function(err,data){
    if(err) throw err;
    res.render('Science',{Image:data});
  });
});

app.get('/Technology',Redirect_Login,function(req,res){
  BookAdmin.find({Category:'Technology'},{'Book_url':1, "_id":0},function(err,data){
    if(err) throw err;
    res.render('Technology',{Image:data});
  });
});

app.get('/Book_Page',Redirect_Login,function(req,res){
  BookAdmin.findOne({Book_url:req.query.URL},function(err,data){
    if(err) throw err;
    res.render('Book_Page',{Details:data});
  });
});

app.get('/SignUp',function(req,res){
    res.render('signup',{Error:"Sign Up"});
});
////////////////////////////////////////////////////////////* The post methods for the pages*/
app.post('/SignUp',urlencodedParser,function(req,res){
  var check = {Email:req.body.Email}; /*The email used to verify */
  var Account = LibraryUsers.find(check,function(err,data){ /* Query the database*/
    if(err) throw err;
    if(data.length !=0)
    {
        res.render('signup',{Error:"User Account Already Exists"});
    }
    else
    {
   
      if(req.body.Password === req.body.Confirm_Password && req.body.Password !="")
      {
        var User = LibraryUsers({
              Name:req.body.Name,
              Surname:req.body.Surname,
              DateOfBirth:req.body.DateOfBirth,
              Address:req.body.Address,
              Email:req.body.Email,
              PhoneNumber:req.body.Phone_Number,
              Password:req.body.Password}).save(function(err){
              if(err) throw err;
              res.redirect('/');
        });
      }
    }
  });
});

app.post('/',urlencodedParser,function(req,res){
  var check = {Email:req.body.Email,Password:req.body.Password};
  var Account = LibraryUsers.find(check,function(err,data){
    if(err) throw err;
    if(data.length !=0)
    {
      if(data[0].Email !== "Admin@Library.com") {
        req.session.user = req.body.Email;
        res.redirect('/Home');
      }
      else
      {
        req.session.user = req.body.Email;
        res.redirect('/Admin');
      }
    }
    else
    {
      res.render('login',{Error:"Incorrect Email or Password"});
    }
  });
});

app.post('/Admin',urlencodedParser,function(req,res){
  if (req.body.add_button =="true"){
      var Admin = BookAdmin({
          Book_Id : req.body.Book_Id,
          Book_nam : req.body.Book_nam,
          Book_url : req.body.Book_url,
          Category : req.body.Category,
          Status:"Available",
          descript : req.body.descript,
          author : req.body.author,
          Edition : req.body.ed,}).save(function(err){
              if(err) throw err;
              res.render("admin_add");
          });
  }
  else{
    BookAdmin.deleteOne({Book_Id:req.body.Book_Id},function(err,data){
      if(err) throw err;
      res.render("admin_add");
    });
  }
});

app.post('/Book_Page',urlencodedParser,function(req,res){
      Reserve_Book.findOne({Book_Id:req.body.RSV},function(err,data){
      if(err) throw err;
      if(data == null)
      {
        var new_Reserve = Reserve_Book({Book_Id:req.body.RSV,
          User_Email: req.session.user,
          date:moment().format('MMMM Do YYYY, h:mm:ss a')}).save(function(err){
            if(err) throw err;
            var update = BookAdmin.updateOne({Book_Id:req.body.RSV},{$set: {Status:"Unavailable"}},function(err,data){
                if(err) throw err;
                let mailOptions = {
                  from: '"BookElation"<groupassignmenttt@gmail.com>',
                  to: req.session.user,
                  subject: 'Reserve Confirmation',
                  text: 'You have successfully reserved a book, the book is due in 2 weeks Book ID is: '+ req.body.RSV
                };
                
                transporter.sendMail(mailOptions,(error,info) => 
                {
                    if(error)
                    {
                      console.log(error);
                    }
                    else
                    {
                      console.log(info);
                    }
                });
                
                res.redirect('/Home');
            });
        });
      }
    });
});

app.post('/LogOut',urlencodedParser,function(req,res){
    req.session.destroy();
    res.redirect('/')
});

app.post('/returns',urlencodedParser,function(req,res){
  Reserve_Book.findOne({Book_Id:req.body.Book_idreturn},function(err,data){
    if(err) throw err;
    if(data !== null)
    {
          let mailOptions = 
          {
              from: '"BookElation"<groupassignmenttt@gmail.com>',
              to: data.User_Email,
              subject: 'Return Confirmation',
              text: 'You have successfully returned a book, Book ID is: '+ req.body.Book_idreturn
          };
  
      transporter.sendMail(mailOptions,(error,info) => 
      {
               if(error)
                {
                    console.log(error);
                }
              else
                {
                    console.log(info);
                }
      });
      var Add_Return = Return_Book({
          Book_idreturn: req.body.Book_idreturn,
          return_date: moment().format('MMMM Do YYYY, h:mm:ss a'),
          User_Email:data.User_Email,
          Librarian: req.body.Librarian
      }).save(function(err,data){
           if(err) throw err;
      });
      Reserve_Book.deleteOne({Book_Id:req.body.Book_idreturn},function(err,data)
        {
          if(err) throw err;
          var update = BookAdmin.updateOne({Book_Id:req.body.Book_idreturn},{$set: {Status:"Avaliable"}},function(err,data){
            if(err) return err;
            res.render("admin_add");
            });
        });
    }
  else
    {
      res.render("admin_add");
    }
  })

});

app.post('/Search',urlencodedParser,function(req,res){
    BookAdmin.findOne({Book_Id:req.body.Search_ID},function(err,data){
      if(err) throw err;
      if(data===null)
      {
        res.redirect("/No_Results");
      }
      else
      {
        res.render("Book_Page",{Details:data});
      }
    });  
});

app.post('/Report',urlencodedParser,function(req,res){
  Reserve_Book.find({},function(err,data){
          if(err) return err;
          var Reserve_info = String(data).replace("[","").replace("]","").replace(/},/g,"\n").replace(/{/g,"\n");
          fs.writeFile("OnLoan.txt", Reserve_info, function(err) {
                if(err) return err;
                console.log("The file was saved!");
          }); 
  });
  Return_Book.find({},function(err,data){
      if(err) return err;
      var Return_info = String(data).replace("[","").replace("]","").replace(/},/g,"\n").replace(/{/g,"\n");
      fs.writeFile("Returns.txt", Return_info, function(err) {
        if(err) return err;
        console.log("The file was saved!");
      }); 

      let mailOptions = {
        from: '"BookElation"<groupassignmenttt@gmail.com>',
        to: "groupassignmenttt@gmail.com",
        subject: 'Reserve Confirmation',
        attachments: [{filename: "Returns.txt",path: "Returns.txt"},{filename: "OnLoan.txt",path:"OnLoan.txt"}],
        text: 'Report sent'
      };
      
      transporter.sendMail(mailOptions,(error,info) => 
      {
          if(error)
          {
            console.log(error);
          }
          else
          {
            console.log(info);
          }
      });
      
      res.redirect("/Admin");
    });
});
console.log("Now listening on port 3000");
app.listen(PORT);