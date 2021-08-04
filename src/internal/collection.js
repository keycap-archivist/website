import axios from 'axios';
import { getConfig, setConfig } from './config';

const axInstance = axios.create({ withCredentials: true });
const baseAPI = 'https://api.keycap-archivist.com';

function checkResponse(err) {
  if (err && err.response && [401, 403].includes(err.response.status)) {
    setConfig({ ...getConfig(), authorized: false });
  }
}
export function updateCollection(id, data) {
  console.debug('[WS] Updating', data);

  return axInstance
    .post(`${baseAPI}/ws/${id}`, data)
    .then((response) => response.data.id)
    .catch((err) => {
      checkResponse(err);
      console.log(err.message);
    });
}

export function setCollection(data) {
  console.debug('[WS] Creating', data.name, data);

  return axInstance
    .post(`${baseAPI}/ws`, data)
    .then((response) => response.data.id)
    .catch((err) => {
      checkResponse(err);
      console.log(err.message);
    });
}

export function getCollections() {
  console.debug('[WS] Downloading All wishlist');
  return axInstance
    .get(`${baseAPI}/ws`)
    .then(({ data }) => data)
    .catch((err) => {
      checkResponse(err);
      return [];
    });
}

export function getCollectionById(id) {
  console.debug('[WS] Downloading', id);

  return axInstance
    .get(`${baseAPI}/ws/${id}`)
    .then(({ data }) => data)
    .catch((err) => {
      checkResponse(err);
      console.log(err.message);
    });
}

export function delCollection(id) {
  console.debug('[WS] Deleting', id);

  return axInstance
    .get(`${baseAPI}/ws/delete/${id}`)
    .then(({ data }) => data)
    .catch((err) => {
      checkResponse(err);
      console.log(err.message);
    });
}

export async function getCurrentSession() {
  console.debug('Get current session');
  await axInstance.get(`${baseAPI}/auth/current-session`, { timeout: 20000 });
}
