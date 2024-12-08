import { z } from 'zod'
import { NextResponse } from 'next/server'

export interface ApiError {
  status: number
  message: string
  details?: unknown
}

export function handleApiError(error: unknown): ApiError {
  console.error('API Error:', error)
  
  // Zod Validierungsfehler
  if (error instanceof z.ZodError) {
    return {
      status: 400,
      message: 'Validierungsfehler',
      details: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
    }
  }
  
  // MongoDB Fehler
  if (error instanceof Error && error.name === 'MongoError') {
    if ((error as any).code === 11000) {
      return {
        status: 409,
        message: 'Datensatz existiert bereits',
        details: error.message
      }
    }
  }
  
  // JWT Fehler
  if (error instanceof Error && error.name === 'JsonWebTokenError') {
    return {
      status: 401,
      message: 'Ungültiger Token',
      details: error.message
    }
  }
  
  // Standard Error
  if (error instanceof Error) {
    return {
      status: 500,
      message: 'Interner Server-Fehler',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }
  }
  
  // Unbekannter Fehler
  return {
    status: 500,
    message: 'Unbekannter Fehler'
  }
}

export function createApiError(error: ApiError) {
  return NextResponse.json(
    { 
      error: error.message, 
      ...(error.details && { details: error.details }) 
    },
    { status: error.status }
  )
}
