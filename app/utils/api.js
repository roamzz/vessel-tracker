import { ofetch } from 'ofetch'

export function useApi() {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  return ofetch.create({ baseURL: apiBaseUrl })
}
