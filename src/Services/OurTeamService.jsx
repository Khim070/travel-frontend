import axios from "axios";

const REST_API_URL_BASE = "http://localhost:8080/api/ourteam";

export const getAllOurTeam = () => axios.get(REST_API_URL_BASE);

export const createOurTeam = (ourteam) => axios.post(REST_API_URL_BASE, ourteam);

export const getOnlyOurTeam = (ourteam) => axios.get(REST_API_URL_BASE + '/' + ourteam);


export const updateOurTeam = (ourteamId, formData) => {
    return axios.put(`${REST_API_URL_BASE}/update/${ourteamId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteOurTeam = (ourteamId, formData) => {
    return axios.put(`${REST_API_URL_BASE}/delete/${ourteamId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


export const updateOrderIds = (ourteam) => {
    return axios.put(`${REST_API_URL_BASE}/updateOrderIds`, ourteam, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};