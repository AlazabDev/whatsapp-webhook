import { useEffect, useState } from 'react'
import { useContacts, useMessages, useNumbers, useDashboardStats } from './use-data'

export interface DataSyncStatus {
  isStale: boolean
  lastUpdated: Date | null
  syncInProgress: boolean
  error: Error | null
}

/**
 * Hook to sync data and handle real-time updates
 * Automatically revalidates data when needed
 */
export function useDataSync() {
  const { mutate: mutateContacts } = useContacts()
  const { mutate: mutateMessages } = useMessages()
  const { mutate: mutateNumbers } = useNumbers()
  const { mutate: mutateStats } = useDashboardStats()

  const [syncStatus, setSyncStatus] = useState<DataSyncStatus>({
    isStale: false,
    lastUpdated: null,
    syncInProgress: false,
    error: null,
  })

  // Auto-sync on mount
  useEffect(() => {
    const syncAll = async () => {
      setSyncStatus(prev => ({ ...prev, syncInProgress: true, error: null }))
      try {
        await Promise.all([
          mutateContacts(),
          mutateMessages(),
          mutateNumbers(),
          mutateStats(),
        ])
        setSyncStatus({
          isStale: false,
          lastUpdated: new Date(),
          syncInProgress: false,
          error: null,
        })
      } catch (error) {
        setSyncStatus(prev => ({
          ...prev,
          syncInProgress: false,
          error: error instanceof Error ? error : new Error('Sync failed'),
        }))
      }
    }

    syncAll()

    // Set up interval for periodic syncs (every 30 seconds)
    const interval = setInterval(syncAll, 30000)

    return () => clearInterval(interval)
  }, [mutateContacts, mutateMessages, mutateNumbers, mutateStats])

  const manualSync = async () => {
    setSyncStatus(prev => ({ ...prev, syncInProgress: true, error: null }))
    try {
      await Promise.all([
        mutateContacts(),
        mutateMessages(),
        mutateNumbers(),
        mutateStats(),
      ])
      setSyncStatus({
        isStale: false,
        lastUpdated: new Date(),
        syncInProgress: false,
        error: null,
      })
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        syncInProgress: false,
        error: error instanceof Error ? error : new Error('Sync failed'),
      }))
    }
  }

  return { syncStatus, manualSync }
}

/**
 * Hook to handle API errors globally
 */
export function useApiError() {
  const [apiErrors, setApiErrors] = useState<Map<string, Error>>(new Map())

  const addError = (endpoint: string, error: Error) => {
    setApiErrors(prev => new Map(prev).set(endpoint, error))
  }

  const clearError = (endpoint: string) => {
    setApiErrors(prev => {
      const newMap = new Map(prev)
      newMap.delete(endpoint)
      return newMap
    })
  }

  const clearAllErrors = () => {
    setApiErrors(new Map())
  }

  return { apiErrors, addError, clearError, clearAllErrors }
}
