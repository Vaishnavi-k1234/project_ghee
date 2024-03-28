// var express = require("express")
// var bodyParser = require("body-parser")
// var mongoose = require("mongoose")

// const app = express()
// app.use(bodyParser.json())
// app.use(express.static('public'))
// app.use(bodyParser.urlencoded({
//     extended:true
// }))

// mongoose.connect('mongodb://127.0.0.1:27017/mydb',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// var db = mongoose.connection;

// db.on('error',()=>console.log("Error in Connecting to Database"));
// db.once('open',()=>console.log("Connected to Database"))

// app.post("/Signup",(req,res)=>{
//     var name = req.body.name;
//     var email = req.body.email;
//     var phoneNumber = req.body.phoneNumber;
//     var password = req.body.password;

//     var data = {
//         "name": name,
//         "email" : email,
//         "phno": phoneNumber,
//         "password" : password
//     }

//     db.collection('users').insertOne(data,(err,collection)=>{
//         if(err){
//             throw err;
//         }
//         console.log("Record Inserted Successfully");
//     });

//     return res.redirect('index.html')

// })

// const User = require('./models/user'); // Assuming your User model is in a file named user.js

// app.post('/login', (req, res) => {
//     const { phoneNumber, password } = req.body;

//     // Use the User model to find the user by phone number
//     User.findOne({ phoneNumber: phoneNumber }, (err, user) => {
//         if (err) {
//             // Handle error
//             console.error(err);
//             return res.status(500).send('Internal Server Error');
//         }
//         if (!user) {
//             // User not found
//             return res.status(401).send('Invalid phone number or password');
//         }
//         // Check if the password is correct
//         if (user.password !== password) {
//             // Incorrect password
//             return res.status(401).send('Invalid phone number or password');
//         }
//         // User authenticated successfully
//         // Redirect or send response as needed
//         res.redirect('/home');
//     });
// });



// app.get("/",(req,res)=>{
//     res.set({
//         "Allow-access-Allow-Origin": '*'
//     })
//     return res.redirect('index.html');
// }).listen(4000);


// console.log("Listening on PORT 4000");


const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log("Connected to Database"));

// Define the user schema and model
const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String, // Assuming phone number is stored as "phoneNumber"
    password: String
}));

// Signup route
app.post("/signup", async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const user = new User({
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            password: hashedPassword
        });

        // Save the user to the database
        await user.save();

        console.log("User registered successfully");
        return res.redirect('/public/login'); // Redirect to login page after registration
    } catch (error) {
        console.error("Error in user registration:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        // Find the user by phone number
        const user = await User.findOne({ phoneNumber: phoneNumber });

        if (!user) {
            return res.status(401).send('Invalid phone number or password');
        }

        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid phone number or password');
        }

        // User authenticated successfully
        // Redirect to index.html
        res.redirect('/home.html');
    } catch (error) {
        console.error("Error in user login:", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
