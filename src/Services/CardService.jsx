import axios from "axios";

const REST_API_URL_BASE = "http://localhost:8080/api/card";

export const getAllCard = () => axios.get(REST_API_URL_BASE);

export const createCard = (card) => axios.post(REST_API_URL_BASE, card);

export const updateCard = (cardID, formData) => {
    return axios.put(`${REST_API_URL_BASE}/update/${cardID}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteCard = (cardID, formData) => {
    return axios.put(`${REST_API_URL_BASE}/delete/${cardID}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


export const updateOrderIds = (card) => {
    return axios.put(`${REST_API_URL_BASE}/updateOrderIds`, card, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};