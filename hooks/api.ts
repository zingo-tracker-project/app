import axios from 'axios';

/**
 * api 호출 
 * @param {string} url 
 * @param {string} method
 * @param {Object} params
 * @param {Object} headers
 */
const makeApiRequest = async (url:string, method = 'get', params = {}, headers = {}) => {

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
  
    const finalHeaders = { ...defaultHeaders, ...headers };

    try {
      const response = await axios({
        url,         
        method,
        headers: finalHeaders,
        params,
        data: method === 'post' || method === 'put' ? params : undefined,  // POST/PUT 요청 시 요청 본문
      });
  
      return response.data;
    } catch (error) {
      console.log('makeApiRequest while ',method, 'to' ,url,);
      console.log('error : ', error);
      throw error;
    }
  };
  
  export default makeApiRequest;
