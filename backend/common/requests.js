const axios = require('axios');

const qoutesApi = axios.create({
    baseURL: 'https://api.quotable.io/'
});

const twinWrdApi = axios.create({
    headers: {
        'x-rapidapi-key': '62036fde62msh24624331ddd8c61p138b56jsncafff2443cc8',
        'x-rapidapi-host': 'twinword-text-similarity-v1.p.rapidapi.com'
    },
    baseURL: 'https://twinword-text-similarity-v1.p.rapidapi.com/similarity/'
});

const qtRequest = async (res, errMsg, {path, method, params, postData}) => {
    try{
        const data = await qoutesApi({method: method, url: `${path}`, params, data: postData});
        return [data, null];
    }catch(error){
        res.status(500).send({status: 'FAIL', message: errMsg});
        return [null, error];
    }
}

const twRequest = async (res, errMsg, {path, method, params, postData}) => {
    try{
        const data = await twinWrdApi({method: method, url: `${path}`, params, data: postData});
        return [data, null];
    }catch(error){
        res.status(500).send({status: 'FAIL', message: errMsg});
        return [null, error];
    }
}

module.exports = {qtRequest, twRequest};