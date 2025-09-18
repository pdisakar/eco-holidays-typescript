import axios from 'axios';
const PRODUCTION_SERVER = process.env.PRODUCTION_SERVER;
const DEVELOPMENT_SERVER = process.env.DEVELOPMENT_SERVER;

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production'){  
  axios.defaults.headers = {
    siteKey: process.env.SITE_KEY
  }
}
const client = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? PRODUCTION_SERVER :  DEVELOPMENT_SERVER,
})
export default client