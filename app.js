const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const seedDB = require('./seed');
const methodOverride = require('method-override');
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/User');
const productsRoutes = require('./routes/products');
const productReviews = require('./routes/review')
const authUser = require('./routes/auth')
const forgotPassword = require('./routes/forgotPassword')
const cart = require('./routes/cart')
const productApi = require('./routes/api/productApi')
const wishlist = require('./routes/wishlist')
const dotenv = require('dotenv').config()

// let url = 'mongodb+srv://rahulchaudhary777:rahul@cluster0.dsmpl38.mongodb.net/ecommerceretryWrites=true&w=majority'
//let url = process.env.MONGO_URL
// console.log(process.env.MONGO_URL)
let url = 'mongodb://127.0.0.1:27017/ecommerceDB'
mongoose.connect(url)
.then(() => { console.log("database created"); })
.catch((err) => { console.log(err) });


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))

let configSession = {
    secret: 'keyboard cat',
    store: new MemoryStore({
        checkPeriod: 86400000 // expired entries every 24h
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { 
        // secure: true
        httpOnly: true,
        // expires: Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000
    },
}

app.use(session(configSession));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());    // attach passport with session

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');
    res.locals.currentUser = req.user;
    // console.log(`success : ${res.locals.success}`);
    next();

})

// home page
app.get('/', (req, res) => {
    res.render('home');
})

// routes
app.use(productsRoutes);
app.use(productReviews);
app.use(authUser);
app.use(forgotPassword);
app.use(cart);
app.use(productApi);
app.use(wishlist);


/// seedDB();

app.listen(8080, ()=>{
    console.log("server connected");
})

// 1. express server
// 2. schema using mongoose
// 3. add some predefined data into DB (seedDB)
// 4. show all DB products
// 5. add new product
// 6. edit a product
// 7. delete product