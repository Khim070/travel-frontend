import axios from "axios";

const REST_API_URL_BASE = "http://localhost:8080/api/aboutUs";

export const getAllAboutUs = () => axios.get(REST_API_URL_BASE);

export const createAboutUs = (aboutUs) => axios.post(REST_API_URL_BASE, aboutUs);

export const updateAboutUs = (aboutUsID, aboutUs) => axios.put(REST_API_URL_BASE + '/update/' + aboutUsID, aboutUs);

export const deleteAboutUs = (aboutUsID, aboutUs) => axios.put(REST_API_URL_BASE + '/delete/' + aboutUsID, aboutUs);
