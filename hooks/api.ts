import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "@/recoil/userAtom";


/**
 * api 호출 
 * @param {string} url 
 * @param {string} method
 * @param {Object} data
 * @param {Object} params
 * @param {Object} headers
 */
const makeApiRequest = async (url: string, method = 'get', accessToken: string, data = {}, params = {}, headers = {}) => {

    console.log("user?.accessToken");
    console.log(accessToken);

    const DOMAIN = process.env.EXPO_PUBLIC_API_URL || '';
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "Bearer " + accessToken,
    };
  
    const finalHeaders = { ...defaultHeaders, ...headers };

    try {
      const response = await axios({
        url: url.includes('http') ? url : DOMAIN + url,
        method,
        headers: finalHeaders,
        params,
        data,
      });
  
      return response.data;
    } catch (error) {
      console.log('makeApiRequest while ', method, 'to', url);
      console.log('error : ', error);
      throw error;
    }
  };
  
  export default makeApiRequest;
