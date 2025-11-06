import axiosConfig from '../../config/axiosConfig';

export const signupRequest = async (data) => {
    try {
        const res = await axiosConfig.post('/user/signup', data);
        return res.data.data;
    } catch (error) {
        console.log("Error in signupRequest", error);
        throw error;
    }
}

export const loginRequest = async (data) => {
    try {
        const res = await axiosConfig.post('/user/login', data);
        return res.data.data;
    } catch (error) {
        console.log("Error in loginRequest", error);
        throw error;
    }
}