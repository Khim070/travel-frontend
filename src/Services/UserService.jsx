import axios from 'axios';

const REST_API_URL_BASE = "http://localhost:8080/api/user";

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${REST_API_URL_BASE}/login`,
            { email, password },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        return response.data;
    } catch (error) {
        console.error('Login request failed:', error);
        throw error;
    }
};

export const getAllUser = () => axios.get(REST_API_URL_BASE);

export const updatePassword = (email, oldPassword, newPassword) => {
    return axios.put(REST_API_URL_BASE + "/update-password", null, {
        params: {
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        }
    });
};

export const updateUser = (userID, formData) => {
    return axios.put(`${REST_API_URL_BASE}/update/${userID}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const addUser = (formData) => {
    return axios.post(`${REST_API_URL_BASE}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteUser = (userID, formData) => {
    return axios.put(`${REST_API_URL_BASE}/delete/${userID}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};