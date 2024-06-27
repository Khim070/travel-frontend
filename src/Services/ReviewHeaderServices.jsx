import axios from "axios";

const REST_API_URL_BASE = "http://localhost:8080/api/reviewheader";

export const getAllPopularHeader = () => axios.get(REST_API_URL_BASE);

export const getAllCardHeader = () => axios.get(REST_API_URL_BASE);

export const getAllOurTeamHeader = () => axios.get(REST_API_URL_BASE);

export const createPopularHeader = (popularHeader) => axios.post(REST_API_URL_BASE, popularHeader);

export const getOnlyPopularHeader = (popularHeaderId) => axios.get(REST_API_URL_BASE + '/' + popularHeaderId);

export const getOnlyCardHeader = (cardHeaderId) => axios.get(REST_API_URL_BASE + '/' + cardHeaderId);

export const updatePopularHeader = (popularHeaderId, popularHeader) => axios.put(REST_API_URL_BASE + '/update/' + popularHeaderId, popularHeader);

export const updateCardHeader = (cardHeaderId, cardHeader) => axios.put(REST_API_URL_BASE + '/update/' + cardHeaderId, cardHeader);

export const updateOurTeamHeader = (ourTeamId, ourTeam) => axios.put(REST_API_URL_BASE + '/update/' + ourTeamId, ourTeam);