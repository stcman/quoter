const express = require('express');
const PORT = process.env.PORT || 5000;
const {logger} = require('./common/logger');
const {qtRequest, twRequest} = require('./common/requests');
const app = express();
let server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

let seenQuotes = {};
let cachedResults = {};
let qtsPerPage = 25;

(async function(){
    let [quoteData, quoteError] = await qtRequest("", "", {path: '/quotes', method: 'GET', params: {page: 1, limit: qtsPerPage}});
    if(quoteError) server.close(() => console.error('Could not request quotable.io. Please check your connection or try again later...'));
    else cachedResults[1] = quoteData.data;
})();

const findQuote = async (res, rating, ratedQuote) => {
    let pageNum = Math.floor(Math.random() * cachedResults[1].totalPages);
    
    //if we don't find cached results for page#, go get a new page
    let [quoteData, quoteError] = cachedResults[pageNum] === undefined ? await qtRequest(res, 'Failed to get qoute!', {path: '/quotes', method: 'GET', params: {page: pageNum, limit: qtsPerPage}}) : [null, null];

    if(!quoteError){
        let quotes = cachedResults[pageNum] || quoteData.data;
        
        //cache results if results for this page not already cached
        if(!cachedResults[pageNum]) cachedResults[pageNum] = quotes;
        
        for(let i = 0; i < quotes.count; i++){

            //ignore duplicates and quotes that have been seen
            if(ratedQuote._id == quotes.results[i]._id || seenQuotes[quotes.results[i]._id]) continue;

            let [twRequestData, twRequestError] = await twRequest(res, 'Failed to compare texts', {path: '/', method: 'GET', params: {text1: ratedQuote.content, text2: quotes.results[i].content}});
            if(twRequestError) return;
            let similarityObj = twRequestData.data;

            //Similar : > 0.3
            //VERY Differnt: < 0.1
            
            if(similarityObj.similarity > 0.3 && rating >= 4 || similarityObj.similarity < 0.1 && rating < 4){
                logger.info(`Rated Quote: "${ratedQuote.content}" \n New Quote: "${quotes.results[i].content}" \n Similarity Rating: ${similarityObj.similarity}`)
                seenQuotes[quotes.results[i]._id] = true;
                res.status(200).send({responseData: quotes.results[i], similarity: similarityObj.similarity, pageNum: pageNum});
                return;
            }
        }

        getRandomQuote(res); //new random quote if similarity check fails
    }
    
}

const getRandomQuote = async (res) => {
    let allQtsCount = cachedResults[1].totalCount;
    if(Object.keys(seenQuotes).length == allQtsCount) return res.status(500).send({status: 'FAIL', message: 'No more new quotes!'});

    let [radomQtData, radomQterror] = await qtRequest(res, 'Failed to get qoute!', {path: '/random', method: 'GET'});
    if(!radomQterror){
        if(seenQuotes[radomQtData.data._id]) return getRandomQuote(res); //if quote already been seen, get new quote
        seenQuotes[radomQtData.data._id] = true;
        res.status(200).send({status: 'SUCCESS', responseData: radomQtData.data});
    }
}

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
});

app.use(express.json());

app.get('/randomQt', async (req, res) => {
    getRandomQuote(res);
})

app.post('/rateQt', async (req, res) => {
    const {rating, ratedQt} = req.body;
    findQuote(res, rating, ratedQt);
})

app.use((req, res) => {
    res.send('Not Found!');
});