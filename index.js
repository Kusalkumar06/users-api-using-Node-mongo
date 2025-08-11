const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

const app =express()
dotenv.config()

app.use(express.json())

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB is Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
})

const User = mongoose.model('User',userSchema);

app.get("/users",async (req,res)=> {
    try{
        const users = await User.find()
        res.status(200).send(users)
    } catch(err){
        console.log("Error fetching users",err)
        res.status(500).send("Internal server error",err);
    }
})

app.post('/users',async (req,res) => {
    const { name, email } = req.body
    try {
        const user = new User({name,email});
        await user.save();
        res.status(201).send(user)
    } catch(err){
        console.error('Error creating user:',err)
    }
})

app.listen(5000,()=>{
    console.log("Server started at the server 5000")
})

module.exports = app;