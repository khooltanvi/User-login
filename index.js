const express=require('express');
const mongoose = require('mongoose');
const path=require('path');
const app=express();
const port=8080;
const User=require("./models/info.js");
const jwt=require('jsonwebtoken');
const bcrypt=require("bcrypt");
const {body,validationResult } = require('express-validator');
const JWT_SECRET = 'May_This_be@/_a214fjgnthrjtknfgrj_secret';
require('dotenv').config(); 
const auth=require('./middleware/auth.js')

const cors = require('cors');
app.use(cors());
const corsOptions = {
    origin: ['http://localhost:8080'], 
    methods: ['GET', 'POST','PATCH','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

main()
 .then(() => console.log("Connection Successful"))
 .catch(err => console.log(err));
async function main()
{
    await mongoose.connect('mongodb://127.0.0.1:27017/login');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.listen(port,()=>{
    console.log(`Server is listening to port ${port}`)
})

app.post("/",(req,res)=>{
    res.send("HEy There")
})

app.get("/register",(req,res)=>{
    res.render("register.ejs");
})

app.post("/register",async (req,res)=>{
    let {name,username,password,email}=req.body;
   const isExist1= await User.findOne({username});
    if(isExist1)
    {
        return res.status(400).json({
            success:false,
            msg: "Username already exist"
        })
    }
    console.log(email);
    const isExist2=await User.findOne({email:email});
    console.log(isExist2);
    if(isExist2)
    {
        return res.status(400).json({
            success:false,
            msg: "Email already exist"
        })
    }
    const hashedPassword =await  bcrypt.hash(password, 10);
    let user1= new User({
        name,
        username,
        password:hashedPassword,
        email
    })
    await user1.save()
     .then(res=>console.log(res))
     .catch(err=>console.log(err));

     return res.status(201).json({
        success:true,
        msg: "Registered successfully"
    })
    
})

app.get("/login", (req,res)=>{
    res.render("login.ejs");
})

const generateToken=async(user)=>{
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    return token;

}
app.post('/login', 
    [
        body('username').isString(),
        body('password').isString()
    ], 
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    msg: "Validation Errors",
                    error: errors.array()
                });
            }

            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    msg: "Username or Password incorrect"
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    msg: "Username or Password incorrect"
                });
            }
            
            const accessToken = await generateToken({user:user});
            return res.status(200).json({
                success: true,
                msg: "Login Successful",
                user:user,
                accessToken:accessToken,
                tokenType:'Bearer'
          });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, msg: 'Server Error' });
        }
    }
);

app.get('/profile', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }
        const { password, ...userProfile } = user.toObject();
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
});

app.patch('/profile', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        const { password, ...userProfile } = updatedUser.toObject();

        res.status(200).json({ success: true, user: userProfile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
});


app.delete('/profile', auth, async (req, res) => {
    try {
        const userId = req.user.userId;

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        res.status(200).json({ success: true, msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
});


