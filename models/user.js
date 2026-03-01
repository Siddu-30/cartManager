const {Schema,model}=require('mongoose');
const bcrypt = require("bcrypt");
const {createUserToken}=require('../services/auth');


const userData= new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['customer','admin'],
        default:'customer'
    },
},{timestamps:true});


userData.pre('save',async function(next){
    if(!this.isModified('password')) return ;

    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})

userData.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Incorrect password");

    return createUserToken(user);
  }
);

const user=model('user',userData);

module.exports=user;