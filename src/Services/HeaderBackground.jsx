import axios from "axios";

const REST_API_URL_BASE = "http://localhost:8080/api/headerbackground";

export const getAllHeaderBackground = () => axios.get(REST_API_URL_BASE);

export const createHeaderBackground = (headerBackground) => axios.post(REST_API_URL_BASE, headerBackground);

export const getOnlyHeaderBackground = (headerBackgroundId) => axios.get(REST_API_URL_BASE + '/' + headerBackgroundId);

export const updateHeaderBackground = (headerBackgroundId, headerBackground) => axios.put(REST_API_URL_BASE + '/update/' + headerBackgroundId, headerBackground);

export const DisplayButtonLink = (headerBackgroundId, headerBackground) => axios.put(REST_API_URL_BASE + '/delete/' + headerBackgroundId, headerBackground);