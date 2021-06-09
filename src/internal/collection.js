import axios from 'axios';

axios.defaults.withCredentials = true;

const baseAPI = 'https://api.keycap-archivist.com';

export function updateCollection(id, data) {
  console.debug('[WS] Updating', data);

  return axios
    .post(`${baseAPI}/ws/${id}`, data)
    .then((response) => response.data.id)
    .catch((err) => {
      console.log(err.message);
    });
}

export function setCollection(data) {
  console.debug('[WS] Creating', data.name, data);

  return axios
    .post(`${baseAPI}/ws`, data)
    .then((response) => response.data.id)
    .catch((err) => {
      console.log(err.message);
    });
}

export function getCollections() {
  console.debug('[WS] Downloading All wishlist');
  return axios
    .get(`${baseAPI}/ws`)
    .then(({ data }) => data)
    .catch(() => []);
}

export function getCollectionById(id) {
  console.debug('[WS] Downloading', id);

  return axios
    .get(`${baseAPI}/ws/${id}`)
    .then(({ data }) => data[0])
    .catch((err) => {
      console.log(err.message);
    });
}

export async function getCurrentSession() {
  console.debug('Get current session');
  await axios.get(`${baseAPI}/auth/current-session`, { timeout: 20000 });
}
