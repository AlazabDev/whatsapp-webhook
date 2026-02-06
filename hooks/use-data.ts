import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useDashboardStats() {
  const { data, error, isLoading } = useSWR('/api/stats', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return {
    stats: data?.stats || { contacts: 0, messages: 0, numbers: 0 },
    isLoading,
    error,
  }
}

export function useContacts() {
  const { data, error, isLoading, mutate } = useSWR('/api/contacts', fetcher)

  return {
    contacts: data?.contacts || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  }
}

export function useMessages() {
  const { data, error, isLoading, mutate } = useSWR('/api/messages', fetcher)

  return {
    messages: data?.messages || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  }
}

export function useNumbers() {
  const { data, error, isLoading, mutate } = useSWR('/api/numbers', fetcher)

  return {
    numbers: data?.numbers || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  }
}
