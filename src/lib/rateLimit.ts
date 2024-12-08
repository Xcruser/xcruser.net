import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  max: number
}

const ipRequestCounts = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(config: RateLimitConfig) {
  return async function rateLimitMiddleware(request: NextRequest) {
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
    const now = Date.now()
    
    let requestData = ipRequestCounts.get(ip)
    
    if (!requestData || now > requestData.resetTime) {
      requestData = {
        count: 0,
        resetTime: now + config.windowMs
      }
    }
    
    requestData.count++
    ipRequestCounts.set(ip, requestData)
    
    // Cleanup alte Einträge
    if (now % 60000 === 0) { // Alle 60 Sekunden
      for (const [storedIp, data] of ipRequestCounts.entries()) {
        if (now > data.resetTime) {
          ipRequestCounts.delete(storedIp)
        }
      }
    }
    
    const remaining = Math.max(0, config.max - requestData.count)
    const reset = Math.ceil((requestData.resetTime - now) / 1000)
    
    return {
      isLimited: requestData.count > config.max,
      remaining,
      reset
    }
  }
}

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 5 // 5 Versuche
})
