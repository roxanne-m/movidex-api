require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const MOVIES = require('./movies-data.js');
const helmet = require('helmet');
const cors = require('cors');

const app = express()

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next){
    
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if(!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status(401).json({error: 'Unauthorized request'})
    }
   
    // move to the next middleware
    next()
});



// For the endpoint we can pass the path of /types & our handleGetTypes middleware function
app.get('/movie', function handleGetMovie(req, res){
    
    let results = MOVIES;
    const {genre, country, avg_vote} = req.query;

    if(genre){
        results = results.filter((movie) => movie.genre.toLowerCase().includes(genre.toLowerCase()));
    };

    if(country){
        results = results.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
    };

    if(avg_vote){
        results = results.filter(movie => Number(movie.avg_vote) >= Number(avg_vote));
    };

    res.json(results);
    
});

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})