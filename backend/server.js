const express = require('express');
const PORT = process.env.PORT || 5000;
const {logger} = require('./common/logger');
const {qtRequest, twRequest} = require('./common/requests');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
const appendFile = util.promisify(fs.appendFile);

(async function() {
    await unlink('quotes.json');
    await appendFile('quotes.json', '{}');
})();

const saveQts = async (res, errMsg, data) => {
    try {
        let quotes = await readFile('quotes.json');
        let qoutesData = quotes.length ? JSON.parse(quotes) : {};
        
        qoutesData[data._id] = "seen";

        await writeFile('quotes.json', JSON.stringify(qoutesData));
        return [qoutesData, null];
    } catch (error) {
        res.status(500).send({status: 'FAIL', message: errMsg});
        return [null, error];
    }
}  

const getSavedQts = async (res, errMsg) => {
    try {
        let data = await readFile('quotes.json');
        data = data.length ? JSON.parse(data) : {};
        return [data, null];
    } catch (error) {
        res.status(500).send({status: 'FAIL', message: errMsg});
        return [null, error];
    }
}

const findQuote = async (rating, ratedQuote, res) => {
    let pageNum = Math.floor(Math.random() * 76);
    let [quoteData, quoteError] = await qtRequest(res, 'Failed to get qoute!', {path: '/quotes', method: 'GET', params: {page: pageNum, limit: 25}});

    if(!quoteError){
        let quotes = quoteData.data;
        let [savedQuotes, savedQuotesErr] = await getSavedQts(res, 'Failed to get saved qoutes!');
        if(savedQuotesErr) return;
        
        for(let i = 0; i < quotes.count; i++){

            //ignore duplicates and quotes that have been seen
            if(ratedQuote._id == quotes.results[i]._id || savedQuotes[quotes.results[i]._id]) continue;
    
            let [twRequestData, twRequestError] = await twRequest(res, 'Failed to compare texts', {path: '/', method: 'GET', params: {text1: ratedQuote.content, text2: quotes.results[i].content}});
            if(twRequestError) return;

            let similarityObj = twRequestData.data;

            //Similar : > 0.3
            //VERY Differnt: < 0.1
            
            if(similarityObj.similarity > 0.3 && rating >= 4 || similarityObj.similarity < 0.1 && rating < 4){
                logger.info(`Rated Quote: "${ratedQuote.content}" \n New Quote: "${quotes.results[i].content}" \n Similarity Rating: ${similarityObj.similarity}`)
                let [saveQtsData, saveQtsErr] = await saveQts(res, 'Failed to save qoutes!', quotes.results[i]);
                if(!saveQtsErr) res.status(200).send({responseData: quotes.results[i], similarity: similarityObj.similarity, pageNum: pageNum});
                return;
            }
        }

        getRandomQuote(res); //new random quote if similarity check fails
    }
}

const getRandomQuote = async (res) => {
    let [savedQuotes, savedQuotesErr] = await getSavedQts(res, 'Failed to get saved qoutes!');
    let [radomQtData, radomQterror] = await qtRequest(res, 'Failed to get qoute!', {path: '/random', method: 'GET'});

    if(!savedQuotesErr && !radomQterror){
        if(savedQuotes[radomQtData.data._id]) return getRandomQuote(); //if quote already been seen
        let [saveQtsData, saveQtsErr] = await saveQts(res, 'Failed to save qoutes!', radomQtData.data);
        if(!saveQtsErr) res.status(200).send({status: 'SUCCESS', responseData: radomQtData.data});
    }
}

const app = express();

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Pass to next layer of middleware
    next();
});

app.use(express.json());

app.get('/randomQt', async (req, res) => {
    getRandomQuote(res);
})

app.post('/rateQt', async (req, res) => {
    const {rating, qtData} = req.body;
    findQuote(rating, qtData, res);
})

app.use((req, res) => {
    res.send('Not Found!');
});