import axios from 'axios';
import { md5 } from 'js-md5';
const API_BASE_URL = 'http://api.valantis.store:40000/';
const xAuth = md5('Valantis_' + new Date().toISOString().slice(0, 10).replace(/-/g, ''));

export async function getIds(offset: number, limit: number) {
  const response = await axios.post(
    API_BASE_URL,
    { action: 'get_ids', params: { offset, limit } },
    { headers: { 'X-Auth': xAuth } }
  );
  return response.data.result;
};

export async function getItems(ids: string[]) {
  const response = await axios.post(
    API_BASE_URL,
    { action: 'get_items', params: { ids } },
    { headers: { 'X-Auth': xAuth } }
  );
  return response.data.result;
};

export async function filterByField(field: string, value: string | number) {
  const response = await axios.post(
    API_BASE_URL,
    { action: 'filter', params: { [field]: value } },
    { headers: { 'X-Auth': xAuth } }
  );
  return response.data.result;
}


