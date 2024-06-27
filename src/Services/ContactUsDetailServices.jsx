import axios from "axios";

const REST_API_URL_BASE = "http://localhost:8080/api/contactusdetail";

export const getAllContactUsDetail = () => axios.get(REST_API_URL_BASE);

export const createContactUsDetail = (contactUsDetail) => axios.post(REST_API_URL_BASE, contactUsDetail);

export const getOnlyContactUsDetail = (contactUsDetail) => axios.get(REST_API_URL_BASE + '/' + contactUsDetail);


export const updateContactUsDetail = (contactUsDetailId, formData) => {
    return axios.put(`${REST_API_URL_BASE}/update/${contactUsDetailId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteContactUsDetail = (contactUsDetailId, formData) => {
    return axios.put(`${REST_API_URL_BASE}/delete/${contactUsDetailId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


export const updateOrderIds = (contactUsDetail) => {
    return axios.put(`${REST_API_URL_BASE}/updateOrderIds`, contactUsDetail, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};