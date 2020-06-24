const express = require('express')
//const passport = require('../config/passport')
const passport = require('passport')
const router = express.Router()

//Login/Landing google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

//authh callback
router.get('/google/callback', passport.authenticate('google',{
   failureRedirect: '/' }),
   (req,res) => {
       res.redirect('/dashboard')
   }
   )

//logout
router.get('/logout',(req,res) => {
    req.logout();
    res.redirect('/')
})
module.exports = router