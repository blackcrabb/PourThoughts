const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose')
const path = require('path');
const session = require('express-session')
const passport = require('passport')
const exphbs = require('express-handlebars');
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db');


//Load config
dotenv.config({ path: './config/config.env'});

//passportconfig
require('./config/passport')(passport)

connectDB();

const app = express();

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


// Handlebars
app.engine('.hbs' , exphbs({ defaultLayout: 'main' , extname: '.hbs'}));
app.set('view engine', '.hbs');

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname , 'public')));

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 4500 ;

app.listen(PORT , console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

