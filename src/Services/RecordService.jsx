import axios from "axios";

const REST_API_URL_BASE = "http://localhost:8080/api/record";

export const getAllRecord = () => axios.get(REST_API_URL_BASE);

export const addRecord = (record) => axios.post(REST_API_URL_BASE, record);

export const addOnlyRecord = (onlyRecord) => axios.post(REST_API_URL_BASE + "/only", onlyRecord);
