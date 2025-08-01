const AppError = require('./../utils/AppError')
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400);
}


const handleValidationDB = err => {
    // console.log('handling val err');
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid Input Data: ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = err => new AppError('Invalid Token: Please Login again', 401);

const handleJWTExpiredError = err => new AppError('Token Expired: Please Login again', 401);


const sendErrorDev = (err, res) => 
{
    console.log(err)
    res.status(err.statusCode).json({
        status: err.status,
        stack: err.stack
    });
};
const sendErrorProd = (err, res) => {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,

        }); 
    }
//Prog. or some other error
    else{
        console.error('error', err);
        res.status(500).json({
            status: 'Network Error',
            message: 'Something went very wrong'
        });
    }
   
};

module.exports = (err, req, res, next) => {

    let error = { ...err }
    // console.log(err.name);
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

    error.statusCode = error.statusCode || 500;
    error.status= error.status || 'Network Error! Please try again later!';
    //.trim() is important because NODE_ENV=production && nodemon server.js sets N0DE_ENV = "production "
    if(process.env.NODE_ENV.trim() === 'development'){
        // console.log('sending dev error')
        sendErrorDev(error, res);
    } else if (process.env.NODE_ENV.trim() === 'production') {
        // console.log('sending prod error')
        sendErrorProd(error, res);
    }
    
}