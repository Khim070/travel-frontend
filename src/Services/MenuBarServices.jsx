import axios from "axios";

const REST_API_URL_BASE = "http://localhost:8080/api/menubar";

export const getAllMenuBar = () => axios.get(REST_API_URL_BASE);

export const createMenuBar = (menuBar) => axios.post(REST_API_URL_BASE, menuBar);

export const getOnlyMenuBar = (menuBarId) => axios.get(REST_API_URL_BASE + '/' + menuBarId);

export const updateMenuBar = (menuBarId, menuBar) => axios.put(REST_API_URL_BASE + '/update/' + menuBarId, menuBar);

export const deleteMenuBar = (menuBarId, menuBar) => axios.put(REST_API_URL_BASE + '/delete/' + menuBarId, menuBar);

export const updateOrderIds = (menuBars) => axios.put(REST_API_URL_BASE + '/updateOrderIds', menuBars);