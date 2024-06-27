import axios from "axios";

const REST_API_URL_BASE = "http://localhost:8080/api/reviewfirstsection";

export const getAllPopular = () => axios.get(REST_API_URL_BASE);

export const createPopular = (popular) => axios.post(REST_API_URL_BASE, popular);

export const getOnlyPopular = (popular) => axios.get(REST_API_URL_BASE + '/' + popular);


export const updatePopular = (popularId, formData) => {
    return axios.put(`${REST_API_URL_BASE}/update/${popularId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deletePopular = (popularId, formData) => {
    return axios.put(`${REST_API_URL_BASE}/delete/${popularId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


export const updateOrderIds = (popular) => {
    return axios.put(`${REST_API_URL_BASE}/updateOrderIds`, popular, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};