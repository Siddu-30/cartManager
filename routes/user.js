const Router=require('express')
const router=Router()
const {handleSignIn,handleSignUp,getSignInDetails,getSignUpDetails}=require('../controllers/user')


router.get('/signin',handleSignIn);

router.get('/signup',handleSignUp);

router.post('/signin',getSignInDetails);

router.post('/signup',getSignUpDetails);

module.exports=router;