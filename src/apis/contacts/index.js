import axiosConfig from '../../config/axiosConfig';

export const createContactRequest = async (data, token) => {
    try {
        const res = await axiosConfig.post('/contacts', data, {
            headers: {
                'x-access-token': token,
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data.data;
    } catch (error) {
        console.log("Error in createContactRequest", error);
        throw error;
    }
}

export const updateContactRequest = async (data, contactId, token) => {
    try {
        const res = await axiosConfig.put(`/contacts/${contactId}`, data, {
            headers: {
                'x-access-token': token,
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data.data;
    } catch (error) {
        console.log("Error in updateContactRequest", error);
        throw error;
    }
}

export const deleteContactRequest = async (contactId, token) => {
    try {
        const res = await axiosConfig.delete(`/contacts/${contactId}`, {
            headers: {
                'x-access-token': token
            }
        });
        return res;
    } catch (error) {
        console.log("Error in deleteContactRequest", error);
        throw error;
    }
}

export const getAllContactsRequest = async (token, page=1, limit=12) => {
    try {
        const res = await axiosConfig.get(`/contacts/?page=${page}&limit=${limit}`, {
            headers: {
                'x-access-token': token
            }
        });
        return res.data.data;
    } catch (error) {
        console.log("Error in getAllContactsRequest", error);
        throw error;
    }
}