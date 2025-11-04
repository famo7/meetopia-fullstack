export interface User {
  id: number
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  message?: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  password?: string
}
