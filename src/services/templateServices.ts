import { TestConfiguration, TestsConfigTemplate } from "../model/Experiment";

const api = process.env.REACT_APP_API_URL

type TemplateType = 'tests' | 'reqData'

interface CreateTemplateData {
  token: string;
  name?: string;
  data: any;
}

export const getTemplates = async (type: TemplateType, token: string) => {
  const url = type === 'tests' ? `${api}/getTestsTemplates` : `${api}/getReqDataTemplates`;
  const experiment = await fetch(url, {
    headers: {
      'Authorization': `Token ${token}`
    }
  }).then(async resp => {
    if (resp.ok) {
      const data = await resp.json();
      if (type === 'tests') {
        data.forEach((t: TestsConfigTemplate) => t.data.forEach(e => e.tries = +e.tries))
      }
      return [data, resp.status]
    } else {
      const data = await resp.text();
      return [data, resp.status]
    }
  })

  return experiment;
}

export const createTemplate = async (type: TemplateType, data: CreateTemplateData) => {
  const url = type === 'tests' ? `${api}/saveTestsTemplate` : `${api}/saveReqDataTemplate`
  const { token, ...params } = data
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(params)
  }).then(async resp => {
    if (resp.ok) {
      const data = await resp.json();
      if (type === 'tests') {
        data.data.forEach((e: TestConfiguration) => e.tries = +e.tries)
      }
      return [data, resp.status]
    } else {
      const data = await resp.text();
      return [data, resp.status]
    }
  })
}
