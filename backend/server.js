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
const app = express();

(async function() {
    await unlink('seen-quotes.json');
    await unlink('quotes-cache.json');
    await appendFile('seen-quotes.json', '{}');
    await appendFile('quotes-cache.json', '{}');
})();

const saveQt = async (res, errMsg, data) => {
    try {
        let quotes = await readFile('seen-quotes.json');
        let qoutesData = quotes.length ? JSON.parse(quotes) : {};
        
        qoutesData[data._id] = "seen";

        await writeFile('seen-quotes.json', JSON.stringify(qoutesData));
        return [qoutesData, null];
    } catch (error) {
        res.status(500).send({status: 'FAIL', message: errMsg});
        return [null, error];
    }
}

const cacheQts = async (res, errMsg, data) => {
    try {
        let results = await readFile('quotes-cache.json');
        let qoutesData = results.length ? JSON.parse(results) : {};
        
        qoutesData[data.page] = data;

        await writeFile('quotes-cache.json', JSON.stringify(qoutesData));
        return [qoutesData, null];
    } catch (error) {
        res.status(500).send({status: 'FAIL', message: errMsg});
        return [null, error];
    }
}

const getSavedData = async (res, errMsg, path) => {
    try {
        let data = await readFile(path);
        data = data.length ? JSON.parse(data) : {};
        return [data, null];
    } catch (error) {
        res.status(500).send({status: 'FAIL', message: errMsg});
        return [null, error];
    }
}

const findQuote = async (res, rating, ratedQuote) => {
    let pageNum = Math.floor(Math.random() * 76);
    
    let [cachedQuoteData, cachedQuoteError] =  await getSavedData(res, 'Failed to get cached quotes!', 'quotes-cache.json');
    if(cachedQuoteError) return;
    
    //if we don't find cached results for page
    let [quoteData, quoteError] = cachedQuoteData[pageNum] === undefined ? await qtRequest(res, 'Failed to get qoute!', {path: '/quotes', method: 'GET', params: {page: pageNum, limit: 25}}) : [null, null];

    if(!quoteError){
        let quotes = cachedQuoteData[pageNum] || quoteData.data;
        
        //run if page not already cached
        if(!cachedQuoteData[pageNum]){
            let [cachedQts, cachedQtsErr] = await cacheQts(res, 'Failed to cache quotes!', quotes);
            if(cachedQtsErr) return;
        }
        
        let [seenQuotes, seenQuotesErr] = await getSavedData(res, 'Failed to get saved qoutes!', 'seen-quotes.json');
        if(seenQuotesErr) return;
        
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
                let [saveQtData, saveQtErr] = await saveQt(res, 'Failed to save qoutes!', quotes.results[i]);
                if(!saveQtErr) res.status(200).send({responseData: quotes.results[i], similarity: similarityObj.similarity, pageNum: pageNum});
                return;
            }
        }

        getRandomQuote(res); //new random quote if similarity check fails
    }
    
}

const getRandomQuote = async (res) => {
    let [seenQuotes, seenQuotesErr] = await getSavedData(res, 'Failed to get saved qoutes!', 'seen-quotes.json');
    let [radomQtData, radomQterror] = await qtRequest(res, 'Failed to get qoute!', {path: '/random', method: 'GET'});

    if(!seenQuotesErr && !radomQterror){
        if(seenQuotes[radomQtData.data._id]) return getRandomQuote(); //if quote already been seen, get new quote
        let [saveQtData, saveQtErr] = await saveQt(res, 'Failed to save qoutes!', radomQtData.data);
        if(!saveQtErr) res.status(200).send({status: 'SUCCESS', responseData: radomQtData.data});
    }
}

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

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
    const {rating, qtData} = req.body;
    findQuote(res, rating, qtData);
})

app.use((req, res) => {
    res.send('Not Found!');
});