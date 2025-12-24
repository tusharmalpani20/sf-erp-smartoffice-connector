import axios from "axios";

const biomax_axios_instance = axios.create({
    // baseURL: 'http://localhost:82',
    //baseURL: 'http://183.82.102.253:82',
    baseURL: 'http://smartoffice.sidsfarm.com',
    params: {
        APIKey: process.env.BIOMAX_APIKEY as string
    }
});

export { biomax_axios_instance };