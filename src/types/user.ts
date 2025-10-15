// This file mirrors the Pydantic schemas defined in the FastAPI backend (schemas/user.py)

export enum UserRole {
  CLIENT = "client",
  AGENT = "agent",
  ADMIN = "admin"
}

export enum UserStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export interface UserOut {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  status: UserStatus;
  is_admin: boolean;
  rejection_reason: string | null;
  created_at: string;  // ISO date string
  updated_at: string;  // ISO date string
  approved_at: string | null;  // ISO date string
  rejected_at: string | null;  // ISO date string
}

export interface UserRejectPayload {
  reason?: string;
}
