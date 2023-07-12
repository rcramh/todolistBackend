//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

//to use ejs templating
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//getting id pass from .env file for security reasons
const DBid = process.env.userid;
const DBpass = process.env.password;

//connect with local mongodb database
mongoose.connect('mongodb+srv://DBid:DBpass@cluster0.vqukqis.mongodb.net/todolistDB' , {useNewUrlParser: true} );
//mongodb://localhost:27017/todolistDB

create schema for todolistDB collection
const itemsSchema = {
  name : String
};

//create a new mongoose model
const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name : "Workout"
});

//item1.save();


app.get("/", async function(req, res) {
const day = date.getDate();

  let ItemList = await Item.find({});

  res.render("list", {listTitle: "Today ", newListItems: ItemList});

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const newItem = new Item({
    name :  itemName
  });

  newItem.save();

  res.redirect("/");
});

app.post("/delete", function(req, res){

  const itemid = req.body.checkbox;

  console.log(itemid);

  Item.deleteMany({_id : itemid}).then(function(){
  console.log("Todo item deleted");//Success
  }).catch(function(error){
  console.log(error);//Failure
  });

  res.redirect("/");
});




const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});
