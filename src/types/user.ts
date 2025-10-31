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
  // Core user fields
  id: string;
  email: string;
  full_name: string | null;

  // Authentication (optional in responses)
  password?: string;

  // User role and status
  role: {
    name: string;
    description: string;
  };
  status: UserStatus;
  is_admin: boolean;
  rejection_reason: string | null;

  // Timestamps
  created_at: string;  // ISO date string
  updated_at: string;  // ISO date string
  approved_at: string | null;
  rejected_at: string | null;

  // Company information (for clients)
  company_name?: string;
  company_email?: string;
  company_address?: string;
  phone_number?: string;

  // Agent-specific fields
  name?: string;
  agent_profile?: any;
  agentProfile?: any;
  phone?: string;
  primary_expertise?: string;
  verified?: boolean;
  createdAt?: string;
  date_created?: number;
  last_updated?: number;

  // Additional fields from API responses
  [key: string]: any;
}

export interface UserRejectPayload {
  reason?: string;
}
