import useSWR from 'swr'
import { logError } from '@/lib/errors'

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url)
    
    if (!res.ok) {
      const error = new Error(`API error: ${res.status}`)
      logError(`Fetcher:${url}`, error)
      throw error
    }
    
    const data = await res.json()
    return data
  } catch (error) {
    logError(`Fetcher:${url}`, error)
    throw error
  }
}

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR('/api/stats', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  })

  return {
    stats: data?.stats || { contacts: 0, messages: 0, numbers: 0 },
    isLoading: isLoading && !data,
    error,
    mutate,
  }
}

export function useContacts() {
  const { data, error, isLoading, mutate } = useSWR('/api/contacts', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    contacts: data?.contacts || [],
    total: data?.total || 0,
    isLoading: isLoading && !data,
    error,
    mutate,
  }
}

export function useMessages() {
  const { data, error, isLoading, mutate } = useSWR('/api/messages', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    messages: data?.messages || [],
    total: data?.total || 0,
    isLoading: isLoading && !data,
    error,
    mutate,
  }
}

export function useNumbers() {
  const { data, error, isLoading, mutate } = useSWR('/api/numbers', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    numbers: data?.numbers || [],
    total: data?.total || 0,
    isLoading: isLoading && !data,
    error,
    mutate,
  }
}
