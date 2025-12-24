import axios from "axios";

const axios_instance = axios.create({
    // baseURL: 'http://82.112.231.90:8003',
    // baseURL: 'https://sf.hopnet.co.in',
    baseURL: 'http://localhost:8001',
    headers: {
        'Authorization': `token ${process.env.ERPNEXT_APIKEY as string}`,
        'Content-Type': 'application/json'
    }
});

export { axios_instance };