export type LoginPayload = {
  userId: string;
  password: string;
};

export type AuthUser = {
  id: string;
  userId: string;
  name: string;
  role: string;
  subrole?: string;
  phone?: string;
  joiningDate?: string;
  endDate?: string;
  lastActive?: string;
  payment?: boolean;
};

export type LoginResponse = {
  status: string;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
};

export type UserSession = {
  token: string;
  user?: AuthUser;
};
