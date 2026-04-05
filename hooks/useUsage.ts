import { useState, useEffect } from 'react'

interface Usage {
  dailyLeft: number
  monthlyLeft: number
  dailyLimit: number
  monthlyLimit: number
}

export function useUsage(feature: string) {
  const [usage, setUsage] = useState<Usage | null>(null)

  const fetch$ = async () => {
    const res = await fetch(`/api/usage?feature=${feature}`)
    if (res.ok) setUsage(await res.json())
  }

  useEffect(() => { fetch$() }, [feature])

  // AI 생성 후 응답값으로 업데이트
  const updateFromResponse = (dailyLeft: number, monthlyLeft: number) => {
    setUsage(prev => prev ? { ...prev, dailyLeft, monthlyLeft } : null)
  }

  return { usage, updateFromResponse, refresh: fetch$ }
}