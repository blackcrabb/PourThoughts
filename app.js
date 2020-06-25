const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose')
const path = require('path');
const session = require('express-session')
const passport = require('passport')
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db');


//Load config
dotenv.config({ path: './config/config.env'});

//passportconfig
require('./config/passport')(passport)

connectDB();

const app = express();

//Body parser
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

//Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Session
app.use(
    session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}))

//Handlebars helper
const { formatDate, stripTags , truncate ,editIcon, select} = require('./helpers/hbs')


// Handlebars
app.engine('.hbs' , exphbs({ 
    helpers: { formatDate,
    stripTags, truncate ,
editIcon,select },
    defaultLayout: 'main' ,
     extname: '.hbs'}));
app.set('view engine', '.hbs');

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global var
app.use(function (req,res, next){
    res.locals.user = req.user || null
    next()
})

//Static folder
app.use(express.static(path.join(__dirname , 'public')));

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 4500 ;

app.listen(PORT , console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

