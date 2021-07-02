const express = require('express');
const axios = require('axios');
const PORT = process.env.PORT || 5000;
const qoutesApi = axios.create({
    baseURL: 'https://api.quotable.io/'
});

const qtRequest = async ({path, method, params}) => {
    try{
        const data = await qoutesApi({method: method, url: `${path}`, params});
        return [data, null];
    }catch(error){
        return [null, error];
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
    let [data, error] = await qtRequest({path: '/random', method: 'GET'});
    if(error) return res.status(500).send({status: 'FAIL', message: 'Failed to get qoute!'});
    res.status(200).send({status: 'SUCCESS', responseData: data.data});
})

app.post('/rateQt', async (req, res) => {
    const {rating, qtData} = req.body;
    if(rating >= 4){
        res.send('Loved it!');
    }else{
        res.send('Hated it!');
    }
})

app.use((req, res) => {
    res.send('Not Found!');
});