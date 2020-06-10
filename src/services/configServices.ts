import { Config } from './../model/Config';

const api = process.env.REACT_APP_API_URL

export const getAllConfigs = async () => {
  return await fetch(`${api}/getConfigs`).then(async resp => {
    if (resp.ok) {
      const data = await resp.json();
      return [data, resp.status]
    } else {
      const data = await resp.text();
      return [data, resp.status]
    }
  })
}

export const updateConfig = async (data: Config, token: string) => {
  return await fetch(`${api}/saveConfig`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(async resp => {
    if (resp.ok) {
      const data: Config = await resp.json();
      return [data, resp.status]
    } else {
      const data = await resp.text();
      return [data, resp.status]
    }
  })
}
