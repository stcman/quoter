import axios from 'axios';

const qoutesApi = axios.create({
  baseURL: 'http://localhost:5000/'
});

export const qtRequest = async (context, errMsg, {path, method, params, postData}) => {
  // { root: true } necessary to access other modules
  context.commit('globalModule/updateIsLoading', true, { root: true });
  try{
      const data = await qoutesApi({method, url: `${path}`, params, data: postData});
      context.commit('globalModule/updateIsLoading', false, { root: true });
      return [data, null];
  }catch(error){
    context.commit('globalModule/updateGlobalErrMsg', errMsg, { root: true });
    context.commit('globalModule/updateShowSnack', true, { root: true });
    context.commit('globalModule/updateIsLoading', false, { root: true });
    return [null, error];
  }
}