// const BASE_URL = 'https://7cvccltb-3100.inc1.devtunnels.ms/admin';
const BASE_URL = 'https://apiprofit.seotube.in/admin';

export interface LoginRequest {
  Email: string;
  Password: string;
}

export interface SignupRequest {
  Email: string;
  Password: string;
}

export interface AuthResponse {
  message: string;
  data: {
    Email: string;
    _id?: string;
    Password?: string;
  };
  token: string;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

// Save token to localStorage
export const saveToken = (token: string): void => {
  localStorage.setItem('adminToken', token);
};

// Remove token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem('adminToken');
};

// Admin Signup API
export const adminSignup = async (data: SignupRequest): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Signup failed');
  }

  // Save token to localStorage
  if (result.token) {
    saveToken(result.token);
  }

  return result;
};

// Admin Login API
export const adminLogin = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Login failed');
  }

  // Save token to localStorage
  if (result.token) {
    saveToken(result.token);
  }

  return result;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

// Captcha Settings Interfaces
export interface CaptchaSettingsRequest {
  DailyCaptchaLimit: number;
  RewardPerCaptcha: number;
  RewardType: 'Coins' | 'WalletBalance';
}

export interface CaptchaSettingsResponse {
  message: string;
  data: {
    _id: string;
    DailyCaptchaLimit: number;
    RewardPerCaptcha: number;
    RewardType: 'Coins' | 'WalletBalance';
    __v?: number;
  };
}

// Token expiration handler
let tokenExpirationHandler: (() => void) | null = null;

export const setTokenExpirationHandler = (handler: () => void) => {
  tokenExpirationHandler = handler;
};

// Get authenticated request headers
const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Handle API response and check for token expiration
const handleApiResponse = async (response: Response): Promise<any> => {
  const result = await response.json();

  // Check for token expiration (401 status)
  if (response.status === 401) {
    if (tokenExpirationHandler) {
      tokenExpirationHandler();
    }
    throw new Error('Token expired. Please login again.');
  }

  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }

  return result;
};

// Set Captcha Settings API
export const setCaptchaSettings = async (data: CaptchaSettingsRequest): Promise<CaptchaSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/captcha/settings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Get Captcha Settings API
export const getCaptchaSettings = async (): Promise<CaptchaSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/captcha/settings`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Referral Settings Interfaces
export interface ReferralSettingsRequest {
  RewardForNewUser: number;
  RewardForReferrer: number;
  RewardType: 'Coins' | 'WalletBalance';
}

export interface ReferralSettingsResponse {
  message: string;
  data: {
    _id: string;
    RewardForNewUser: number;
    RewardForReferrer: number;
    RewardType: 'Coins' | 'WalletBalance';
    __v?: number;
  };
}

// Set Referral Settings API
export const setReferralSettings = async (data: ReferralSettingsRequest): Promise<ReferralSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/referral/settings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Get Referral Settings API
export const getReferralSettings = async (): Promise<ReferralSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/referral/settings`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Daily Bonus Settings Interfaces
export interface DailyBonusSettingsRequest {
  Monday: number;
  Tuesday: number;
  Wednesday: number;
  Thursday: number;
  Friday: number;
  Saturday: number;
  Sunday: number;
  RewardType: 'Coins' | 'WalletBalance';
}

export interface DailyBonusSettingsResponse {
  message: string;
  data: {
    _id: string;
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    Sunday: number;
    RewardType: 'Coins' | 'WalletBalance';
    __v?: number;
  };
}

// Set Daily Bonus Settings API
export const setDailyBonusSettings = async (data: DailyBonusSettingsRequest): Promise<DailyBonusSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/dailybonus/settings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Get Daily Bonus Settings API
export const getDailyBonusSettings = async (): Promise<DailyBonusSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/dailybonus/settings`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Withdrawal Request Interfaces
export interface WithdrawalRequest {
  requestId: string;
  userId: string;
  userMobileNumber: string;
  userDeviceId: string;
  amount: number;
  paymentMethod: 'UPI' | 'BankTransfer';
  upiId?: string | null;
  virtualId?: string | null;
  bankAccountNumber?: string | null;
  bankIFSC?: string | null;
  bankName?: string | null;
  accountHolderName?: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalRequestsResponse {
  message: string;
  data: {
    requests: WithdrawalRequest[];
    totalRequests: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
  };
}

export interface UpdateWithdrawalStatusRequest {
  status: 'Approved' | 'Rejected';
  adminNotes?: string;
}

export interface UpdateWithdrawalStatusResponse {
  message: string;
  data: {
    requestId: string;
    amount: number;
    paymentMethod: string;
    status: string;
    adminNotes?: string | null;
    userWalletBalance: number;
    updatedAt: string;
  };
}

// Get Withdrawal Requests API
export const getWithdrawalRequests = async (status?: 'Pending' | 'Approved' | 'Rejected'): Promise<WithdrawalRequestsResponse> => {
  const url = status 
    ? `${BASE_URL}/withdrawal/requests?status=${status}`
    : `${BASE_URL}/withdrawal/requests`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Update Withdrawal Request Status API
export const updateWithdrawalStatus = async (
  requestId: string,
  data: UpdateWithdrawalStatusRequest
): Promise<UpdateWithdrawalStatusResponse> => {
  const response = await fetch(`${BASE_URL}/withdrawal/request/${requestId}/status`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// User Management Interfaces
export interface User {
  userId: string;
  mobileNumber: string;
  deviceId: string;
  referCode: string;
  coins: number;
  walletBalance: number;
  referredBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  message: string;
  data: {
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalUsers: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    statistics: {
      totalCoins: number;
      totalWalletBalance: number;
    };
  };
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Get Users API
export const getUsers = async (params?: GetUsersParams): Promise<UsersResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);

  const url = `${BASE_URL}/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// App Installation Interfaces
export interface App {
  appId?: string;
  _id?: string;
  appName?: string;
  AppName?: string;
  appImage?: string;
  AppImage?: string;
  appDownloadUrl?: string;
  AppDownloadUrl?: string;
  rewardCoins?: number;
  RewardCoins?: number;
  difficulty?: string;
  Difficulty?: string;
  status?: string;
  Status?: string;
  description?: string;
  Description?: string;
  statistics?: {
    totalSubmissions: number;
    approvedSubmissions: number;
    pendingSubmissions: number;
    rejectedSubmissions?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAppRequest {
  AppName: string;
  AppImage: string;
  AppDownloadUrl: string;
  RewardCoins: number;
  Difficulty?: 'Easiest' | 'Easy' | 'Medium' | 'Hard';
  Status?: 'Active' | 'Inactive';
  Description?: string;
}

export interface UpdateAppRequest {
  AppName?: string;
  AppImage?: string;
  AppDownloadUrl?: string;
  RewardCoins?: number;
  Difficulty?: 'Easiest' | 'Easy' | 'Medium' | 'Hard';
  Status?: 'Active' | 'Inactive';
  Description?: string;
}

export interface AppsResponse {
  message: string;
  data: {
    apps: App[];
    totalApps: number;
  };
}

export interface AppResponse {
  message: string;
  data: App;
}

export interface AppSubmission {
  submissionId: string;
  userId: string;
  userMobileNumber: string;
  userDeviceId: string;
  userReferCode: string;
  appId: string;
  appName: string;
  appImage: string;
  appRewardCoins: number;
  appDifficulty: string;
  screenshotUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppSubmissionsResponse {
  message: string;
  data: {
    submissions: AppSubmission[];
    totalSubmissions: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
  };
}

export interface UpdateSubmissionStatusRequest {
  status: 'Approved' | 'Rejected';
  adminNotes?: string;
}

export interface UpdateSubmissionStatusResponse {
  message: string;
  data: {
    submissionId: string;
    appName: string;
    rewardCoins: number;
    status: string;
    adminNotes?: string | null;
    userCoins: number;
    updatedAt: string;
  };
}

export interface GetAppsParams {
  status?: 'Active' | 'Inactive';
  difficulty?: 'Easiest' | 'Easy' | 'Medium' | 'Hard';
  sortBy?: 'reward';
}

export interface GetSubmissionsParams {
  status?: 'Pending' | 'Approved' | 'Rejected';
  appId?: string;
  userId?: string;
  sortBy?: 'oldest';
}

// Create App API
export const createApp = async (data: CreateAppRequest): Promise<AppResponse> => {
  const response = await fetch(`${BASE_URL}/apps`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Get Apps API
export const getApps = async (params?: GetAppsParams): Promise<AppsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

  const url = `${BASE_URL}/apps${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Get App by ID API
export const getAppById = async (appId: string): Promise<AppResponse> => {
  const response = await fetch(`${BASE_URL}/apps/${appId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Update App API
export const updateApp = async (appId: string, data: UpdateAppRequest): Promise<AppResponse> => {
  const response = await fetch(`${BASE_URL}/apps/${appId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Delete App API
export const deleteApp = async (appId: string): Promise<{ message: string }> => {
  const response = await fetch(`${BASE_URL}/apps/${appId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Get App Submissions API
export const getAppSubmissions = async (params?: GetSubmissionsParams): Promise<AppSubmissionsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.appId) queryParams.append('appId', params.appId);
  if (params?.userId) queryParams.append('userId', params.userId);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

  const url = `${BASE_URL}/apps/submissions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Update Submission Status API
export const updateSubmissionStatus = async (
  submissionId: string,
  data: UpdateSubmissionStatusRequest
): Promise<UpdateSubmissionStatusResponse> => {
  const response = await fetch(`${BASE_URL}/apps/submissions/${submissionId}/status`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Coin Conversion Settings Interfaces
export interface CoinConversionSettingsRequest {
  CoinsPerRupee: number;
  MinimumCoinsToConvert: number;
}

export interface CoinConversionSettingsResponse {
  message: string;
  data: {
    _id: string;
    CoinsPerRupee: number;
    MinimumCoinsToConvert: number;
    createdAt?: string;
    updatedAt?: string;
  };
}

// Set Coin Conversion Settings API
export const setCoinConversionSettings = async (data: CoinConversionSettingsRequest): Promise<CoinConversionSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/coinconversion/settings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Get Coin Conversion Settings API
export const getCoinConversionSettings = async (): Promise<CoinConversionSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/coinconversion/settings`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Scratch Card Settings Interfaces
export interface ScratchCardSettingsRequest {
  Sunday: number;
  Monday: number;
  Tuesday: number;
  Wednesday: number;
  Thursday: number;
  Friday: number;
  Saturday: number;
  RewardType: 'Coins' | 'WalletBalance';
}

export interface ScratchCardSettingsResponse {
  message: string;
  data: {
    _id: string;
    Sunday: number;
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    RewardType: 'Coins' | 'WalletBalance';
    createdAt?: string;
    updatedAt?: string;
  };
}

// Set Scratch Card Settings API
export const setScratchCardSettings = async (data: ScratchCardSettingsRequest): Promise<ScratchCardSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/scratchcard/settings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Get Scratch Card Settings API
export const getScratchCardSettings = async (): Promise<ScratchCardSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/scratchcard/settings`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};
