require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose')
const path=require('path')
const cookieParser=require('cookie-parser');
const session = require("express-session");
const products = require("./data/product");

const app=express();
const PORT=process.env.PORT || 8800;

const {authenticateUserCookie}=require('./middleware/auth');
const userRoute=require('./routes/user')

mongoose.connect(process.env.MONGO_URL)
.then((e)=>console.log("MongoDB Connected"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authenticateUserCookie('token'));
app.use(express.static(path.resolve('./public')));



app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use('/user',userRoute);

app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true
  })
);

app.get('/',(req,res)=>{
    
    res.render('home',{products});
})


app.get("/cart", (req, res) => {
  res.render("cart", { cart: req.session.cart });
});


app.post("/cart/add/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!req.session.cart) {
    req.session.cart = [];
  }

  const existing = req.session.cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    req.session.cart.push({ ...product, qty: 1 });
  }

  res.redirect("/cart");
});

app.listen(PORT,()=>{console.log(`Server successfully loaded at ${PORT}`)})