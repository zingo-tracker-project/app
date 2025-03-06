import makeApiRequest from '../api';

// 사용자 생성
// TODO 받아온 응답값을 setUser에 추가
const createUser = async (id: string, name:string, email:string)=> {
    try {
      const userData = {
        id: id,
        name: name,
        email: email,
      };

      const url = process.env.EXPO_PUBLIC_SERVER+"/users";
      const response = await makeApiRequest("http://172.30.1.29:8080/users", 'post', userData);
  
      console.log('createUser :', response);
      return response;

    } catch (error) {
      console.error('createUser Err : ', error);
    }
};

export default createUser;