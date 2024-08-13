const Express = require("express")
const app = Express()
const CORS = require("cors")
const Bcrypt = require("bcrypt")
const Razorpay = require("razorpay")
const Crypto = require("crypto")

app.use(CORS())

const Mongoose = require("mongoose")
Mongoose.connect("mongodb+srv://Raju:Rani@cluster0.9nw5aik.mongodb.net/moviedatabase?retryWrites=true&w=majority&appName=Cluster0")
    .then()

app.use(Express.json())


// Back End Application
// Logic to read the data from the database and after reading the data
// give that data back to front end

const MovieSchema = new Mongoose.Schema({
    id: {
        type: Number,
        // unique: true
    },
    movie_name: {
        type: String,
        // unique: true
    },
    image_url: {
        type: String,
        // unique: true
    },
    description: {
        type: String,
        // unique: true
    },
    genre: {
        type: String,
        // unique: true
    },
    censor: {
        type: String,
        // unique: true
    },
    director: {
        type: String,
        // unique: true
    }
})

const MovieModel = Mongoose.model("moviescollections", MovieSchema)

app.get("/fetch/all/movies", async function (req, res) {
    // Logic to read all the movies
    MovieModel.find().then(function (output) {
        res.json(output)
    })
})


const SignupSchema = new Mongoose.Schema({
    username: String,
    email: String,
    password: String
})

const SignupModel = Mongoose.model("signups", SignupSchema)

app.post("/signup", async function (req, res) {
    const signupDetails = req.body

    const hashedPassword = await Bcrypt.hash(signupDetails.myPassword, 10)

    const SignupData = new SignupModel({
        username: signupDetails.myUsername,
        email: signupDetails.myEmail,
        password: hashedPassword
    })

    if (signupDetails.myPassword == signupDetails.myConfirmPassword) {
        SignupData.save()
        return res.json({ "message": "Registration successfull!" })
    }
    else {
        return res.json({ "message": "Passwords doesn't match!" })
    }
})

app.post("/signin", async function (req, res) {
    const signinDetails = req.body

    const output = await SignupModel.findOne({ email: signinDetails.myEmail })

    if (output != null) {
        // Email is valid, continue to verify password
        const enteredPassword = signinDetails.myPassword//Welcome
        const actualPassword = output.password//I5rYAtWTK9F9g1rufOFifbIQh54T

        const result = await Bcrypt.compare(enteredPassword, actualPassword)

        if (result == true) {
            // Valid user
            res.json({ "message": "Login successfull!" })
        }
        else {
            // Invalid user
            res.json({ "message": "Login not successfull!" })
        }

    }
})

// {
//     location: "Bangalore",
//     theatres: [
//         { theatreName: "Urvashi Theatre", showTimes: ["6:30 AM", "9:30 AM", "12:30 PM"] },
//         { theatreName: "Meenakshi Theatre", showTimes: ["8:00 AM", "11:30 PM"] },
//         { theatreName: "PVR Theatre", showTimes: ["6:30 AM", "9:30 AM", "12:30 PM"] }
//     ]
// }

const TheatreSchema = new Mongoose.Schema({
    theatreName: String,
    showTimes: Array
})

const LocationSchema = new Mongoose.Schema({
    location: String,
    theatres: [TheatreSchema]
})

const LocationModel = Mongoose.model("locationandtheatres", LocationSchema)


app.get("/locations", async function (req, res) {
    const allDetails = await LocationModel.find()
    res.json({ "info": allDetails })
})

// If our back end has to connect with razorpay ==> 2 keys ==> razorpay_id and razorpay_secret_key

const razorpayDetails = new Razorpay({
    key_id: "rzp_test_lHlNdrDCdx5Dmf",
    key_secret: "4p0UqbVw581aYV4ueGMSqigs"
})

app.post("/create/order", function (req, res) {
    const enteredAmount = req.body.amount

    const options = {
        amount: enteredAmount * 100,
        currency: "INR"
    }

    razorpayDetails.orders.create(options, function (error, orderInfo) {
        if(!error)
        {
            res.json({output: orderInfo})
        }
        else
        {
            console.log(error)
        }
    })
})


// 2 end points
// 1) create the order --> book the ticket for 500 rs
// 2) verify the order
// Order is successful




app.listen(9001, function () {
    console.log("Server is running on the port 9001!")
})

// MongoDB Atlas --> Company who has tied with AWS ==> Provided a Computer(MongoDB)
// AWS --> Services to the customer -->

// Heavy Appl --> Live for 24hrs * 7 days
// Run any Application --> Softwares, Tools, Databases, .................
// 4 GB RAM, 8 GB RAM, ..... 100GB, 1000GB RAM

// Companies used to purchase computers with 100GB RAM config, ...............
// 5 lakhs, 7 lakhs

// AWS ==> They are maintaining a lot of computers through the world, (Mumbai)
// Money --> Provide computers(2 months)




