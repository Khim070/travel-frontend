import axios from "axios";

const REST_API_URL_BASE = "http://localhost:8080/api/contactusheader";

export const getAllHeaderContactUs = () => axios.get(REST_API_URL_BASE);

export const createHeaderContactUs = (headerContactUs) => axios.post(REST_API_URL_BASE, headerContactUs);

export const getOnlyHeaderContactUs = (headerContactUsId) => axios.get(REST_API_URL_BASE + '/' + headerContactUsId);

export const updateHeaderContactUs = (headerContactUsId, headerContactUs) => axios.put(REST_API_URL_BASE + '/update/' + headerContactUsId, headerContactUs);

export const DisplayHeaderContactUs = (headerContactUsId, headerContactUs) => axios.put(REST_API_URL_BASE + '/delete/' + headerContactUsId, headerContactUs);