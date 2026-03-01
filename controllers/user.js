const user=require('../models/user');

function handleSignIn(req,res){
    return res.render('signin');
}

function handleSignUp(req,res){
    return res.render('signup');
}


async function getSignUpDetails(req,res){

    const {username,email,password,role}=req.body;

    await user.create({
        username,
        email,
        password,
        role
    });
    return res.redirect('signin');
}

async function getSignInDetails(req,res){

    const {email,password}=req.body;

    try{
        const token =await user.matchPasswordAndGenerateToken(email,password);
        return res.cookie('token',token).redirect('/');
    }
    catch (error) {
        return res.render('signin',{
            error:"Incorrect Email or Password",
        });
    };

}



module.exports={
    handleSignIn,
    getSignInDetails,
    handleSignUp,
    getSignUpDetails
}