// const BASE_URL = 'https://7cvccltb-3111.inc1.devtunnels.ms/admin';
const BASE_URL = 'https://apiprofit.seotube.in/admin';
// const BASE_URL = 'http://localhost:3111/admin';

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

// Daily Spin Settings Interfaces
export interface DailySpinSettingsRequest {
  DailySpinLimit: number;
}

export interface DailySpinSettingsResponse {
  message: string;
  data: {
    _id: string;
    DailySpinLimit: number;
    __v?: number;
  };
}

// Set Daily Spin Settings API
export const setDailySpinSettings = async (data: DailySpinSettingsRequest): Promise<DailySpinSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/dailyspin/settings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Get Daily Spin Settings API
export const getDailySpinSettings = async (): Promise<DailySpinSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/dailyspin/settings`, {
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

// User Details Interfaces
export interface UserWithdrawalRequest {
  requestId: string;
  amount: number;
  paymentMethod: 'UPI' | 'BankTransfer';
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}

export interface UserStatistics {
  referralCount: number;
  totalWithdrawalRequests: number;
  pendingWithdrawals: number;
  approvedWithdrawals: number;
  rejectedWithdrawals: number;
  totalWithdrawn: number;
  totalAppSubmissions: number;
  approvedAppSubmissions: number;
  pendingAppSubmissions: number;
  rejectedAppSubmissions: number;
  totalEarningsFromApps: number;
}

export interface UserDetails {
  userId: string;
  mobileNumber: string;
  password?: string;
  deviceId: string;
  referCode: string;
  coins: number;
  walletBalance: number;
  referredBy: string | null;
  isBlocked?: boolean;
  blockedAt?: string | null;
  blockedReason?: string | null;
  createdAt: string;
  updatedAt: string;
  signupTime?: string;
  lastLoginTime?: string;
  statistics: UserStatistics;
  withdrawalRequests: UserWithdrawalRequest[];
  appSubmissions?: AppSubmission[];
}

export interface UserDetailsResponse {
  message: string;
  data: UserDetails;
}

// Get User Details by ID API
export const getUserById = async (userId: string): Promise<UserDetailsResponse> => {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Update User Interfaces
export interface UpdateUserRequest {
  MobileNumber?: string;
  Password?: string;
  DeviceId?: string;
  Coins?: number;
  WalletBalance?: number;
}

export interface UserUpdateChanges {
  mobileNumber?: { from: string; to: string };
  deviceId?: { from: string; to: string };
  coins?: { from: number; to: number };
  walletBalance?: { from: number; to: number };
  password?: string;
}

export interface UpdateUserResponse {
  message: string;
  data: {
    userId: string;
    mobileNumber: string;
    password?: string;
    deviceId: string;
    referCode: string;
    coins: number;
    walletBalance: number;
    referredBy: string | null;
    createdAt: string;
    updatedAt: string;
    changes: UserUpdateChanges;
    statistics: {
      referralCount: number;
      totalWithdrawalRequests: number;
    };
  };
}

// Update User API
export const updateUser = async (userId: string, data: UpdateUserRequest): Promise<UpdateUserResponse> => {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Block User Interfaces
export interface BlockUserRequest {
  reason?: string;
}

export interface BlockUserResponse {
  message: string;
  data: {
    userId: string;
    mobileNumber: string;
    isBlocked: boolean;
    blockedAt: string;
    blockedReason?: string | null;
  };
}

export interface UnblockUserResponse {
  message: string;
  data: {
    userId: string;
    mobileNumber: string;
    isBlocked: boolean;
    blockedAt: null;
    blockedReason: null;
  };
}

// Block User API
export const blockUser = async (userId: string, data?: BlockUserRequest): Promise<BlockUserResponse> => {
  const response = await fetch(`${BASE_URL}/users/${userId}/block`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: data ? JSON.stringify(data) : undefined,
  });

  return handleApiResponse(response);
};

// Unblock User API
export const unblockUser = async (userId: string): Promise<UnblockUserResponse> => {
  const response = await fetch(`${BASE_URL}/users/${userId}/unblock`, {
    method: 'POST',
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

// Signup Bonus Settings Interfaces
export interface SignupBonusSettingsRequest {
  SignupBonusAmount: number;
  RewardType: 'Coins' | 'WalletBalance';
}

export interface SignupBonusSettingsResponse {
  message: string;
  data: {
    _id: string;
    SignupBonusAmount: number;
    RewardType: 'Coins' | 'WalletBalance';
    createdAt?: string;
    updatedAt?: string;
  };
}

// Set Signup Bonus Settings API
export const setSignupBonusSettings = async (data: SignupBonusSettingsRequest): Promise<SignupBonusSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/signupbonus/settings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Get Signup Bonus Settings API
export const getSignupBonusSettings = async (): Promise<SignupBonusSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/signupbonus/settings`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Scratch Card Daily Limit Settings Interfaces
export interface ScratchCardDailyLimitSettingsRequest {
  DailyLimit?: number;
  RewardAmount?: number;
  RewardCoins?: number;
  IsActive?: boolean;
}

export interface ScratchCardDailyLimitSettingsResponse {
  message: string;
  data: {
    _id: string;
    DailyLimit: number;
    RewardAmount: number;
    RewardCoins: number;
    IsActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
}

// Set Scratch Card Daily Limit Settings API
export const setScratchCardDailyLimitSettings = async (data: ScratchCardDailyLimitSettingsRequest): Promise<ScratchCardDailyLimitSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/scratchcard/dailylimit/settings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Get Scratch Card Daily Limit Settings API
export const getScratchCardDailyLimitSettings = async (): Promise<ScratchCardDailyLimitSettingsResponse> => {
  const response = await fetch(`${BASE_URL}/scratchcard/dailylimit/settings`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Withdrawal Threshold Settings Interfaces
export interface WithdrawalThresholdRequest {
  MinimumWithdrawalAmount: number;
}

export interface WithdrawalThresholdResponse {
  message: string;
  data: {
    MinimumWithdrawalAmount: number;
    updatedAt?: string;
  };
}

// Set Withdrawal Threshold API
export const setWithdrawalThreshold = async (data: WithdrawalThresholdRequest): Promise<WithdrawalThresholdResponse> => {
  const response = await fetch(`${BASE_URL}/withdrawal/threshold`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Get Withdrawal Threshold API
export const getWithdrawalThreshold = async (): Promise<WithdrawalThresholdResponse> => {
  const response = await fetch(`${BASE_URL}/withdrawal/threshold`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Dashboard Statistics Interfaces
export interface DashboardStatistics {
  users: {
    totalUsers: number;
    todayRegistrations: number;
    recentRegistrations: number;
  };
  wallet: {
    totalWalletBalance: number;
    totalCoins: number;
  };
  withdrawals: {
    totalWithdrawals: number;
    statistics: {
      pending: { count: number; totalAmount: number };
      approved: { count: number; totalAmount: number };
      rejected: { count: number; totalAmount: number };
    };
  };
  registrationChart: {
    days: number;
    data: Array<{
      date: string;
      registrations: number;
    }>;
  };
}

export interface DashboardResponse {
  message: string;
  data: DashboardStatistics;
}

// Get Dashboard Statistics API
export const getDashboardStatistics = async (days: number = 30): Promise<DashboardResponse> => {
  const response = await fetch(`${BASE_URL}/dashboard?days=${days}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Commission Slab Interfaces
export interface CommissionSlab {
  _id: string;
  SlabName: string;
  MinEarnings: number;
  MaxEarnings: number | null;
  CommissionPercentage: number;
  RewardType: 'Coins' | 'WalletBalance';
  IsActive: boolean;
  Order: number;
  CommissionBasedOn: 'ReferredUserWalletBalance' | 'WithdrawalRequestAmount' | 'WithdrawalRequestTime';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCommissionSlabRequest {
  SlabName: string;
  MinEarnings: number;
  MaxEarnings?: number | null;
  CommissionPercentage: number;
  RewardType?: 'Coins' | 'WalletBalance';
  IsActive?: boolean;
  Order?: number;
  CommissionBasedOn?: 'ReferredUserWalletBalance' | 'WithdrawalRequestAmount' | 'WithdrawalRequestTime';
}

export interface UpdateCommissionSlabRequest {
  SlabName?: string;
  MinEarnings?: number;
  MaxEarnings?: number | null;
  CommissionPercentage?: number;
  RewardType?: 'Coins' | 'WalletBalance';
  IsActive?: boolean;
  Order?: number;
  CommissionBasedOn?: 'ReferredUserWalletBalance' | 'WithdrawalRequestAmount' | 'WithdrawalRequestTime';
}

export interface CommissionSlabsResponse {
  message: string;
  data: {
    slabs: CommissionSlab[];
    totalSlabs: number;
    activeSlabs: number;
  };
}

export interface CommissionSlabResponse {
  message: string;
  data: CommissionSlab;
}

// Create Commission Slab API
export const createCommissionSlab = async (data: CreateCommissionSlabRequest): Promise<CommissionSlabResponse> => {
  const response = await fetch(`${BASE_URL}/commission/slabs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Get Commission Slabs API
export const getCommissionSlabs = async (): Promise<CommissionSlabsResponse> => {
  const response = await fetch(`${BASE_URL}/commission/slabs`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Update Commission Slab API
export const updateCommissionSlab = async (
  slabId: string,
  data: UpdateCommissionSlabRequest
): Promise<CommissionSlabResponse> => {
  const response = await fetch(`${BASE_URL}/commission/slabs/${slabId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Delete Commission Slab API
export const deleteCommissionSlab = async (slabId: string): Promise<{ message: string }> => {
  const response = await fetch(`${BASE_URL}/commission/slabs/${slabId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Users Earnings Interfaces
export interface UserEarning {
  userId: string;
  userName?: string;
  mobileNumber: string;
  referCode: string;
  coins: number;
  walletBalance: number;
  totalEarnings: number;
  earningsBreakdown: {
    coins: number;
    walletBalance: number;
    appInstallations: number;
    scratchCards: number;
    captcha: number;
    dailyBonus: number;
    referralEarnings: number;
  };
  referralCount: number;
  referredBy: string | null;
  signupTime?: string;
  lastLoginTime?: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersEarningsResponse {
  message: string;
  data: {
    users: UserEarning[];
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
      totalEarnings: number;
      totalReferrals: number;
    };
  };
}

export interface GetUsersEarningsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'totalEarnings' | 'coins' | 'walletBalance' | 'referralCount';
}

// Get Users Earnings API
export const getUsersEarnings = async (params?: GetUsersEarningsParams): Promise<UsersEarningsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

  const url = `${BASE_URL}/users/earnings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Sponsor Promotion Interfaces
export interface SponsorPromotionSubmission {
  submissionId: string;
  userId: string;
  userName: string;
  userMobileNumber: string;
  userReferCode: string;
  sponsorName: string;
  mobileNumber: string;
  email: string;
  appPromotion: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorPromotionsResponse {
  message: string;
  data: {
    submissions: SponsorPromotionSubmission[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalSubmissions: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    statistics: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
    };
  };
}

export interface UpdateSponsorPromotionStatusRequest {
  status: 'Approved' | 'Rejected';
  adminNotes?: string;
}

export interface UpdateSponsorPromotionStatusResponse {
  message: string;
  data: {
    submissionId: string;
    sponsorName: string;
    mobileNumber: string;
    email: string;
    appPromotion: string;
    status: string;
    adminNotes?: string | null;
    userName: string;
    userMobileNumber: string;
    updatedAt: string;
  };
}

export interface GetSponsorPromotionsParams {
  status?: 'Pending' | 'Approved' | 'Rejected';
  userId?: string;
  page?: number;
  limit?: number;
  search?: string;
}

// Get Sponsor Promotions API
export const getSponsorPromotions = async (params?: GetSponsorPromotionsParams): Promise<SponsorPromotionsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.userId) queryParams.append('userId', params.userId);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);

  const url = `${BASE_URL}/sponsor/promotions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Update Sponsor Promotion Status API
export const updateSponsorPromotionStatus = async (
  submissionId: string,
  data: UpdateSponsorPromotionStatusRequest
): Promise<UpdateSponsorPromotionStatusResponse> => {
  const response = await fetch(`${BASE_URL}/sponsor/promotions/${submissionId}/status`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Cron Jobs Interfaces
export interface CronJob {
  scheduled: boolean;
  schedule: string;
  description: string;
}

export interface CronJobsStatusResponse {
  message: string;
  data: {
    dailyResetJob: CronJob;
    cleanupOldRecordsJob: CronJob;
    note: string;
  };
}

export interface DailyResetStatistics {
  scratchCard: {
    today: number;
    yesterday: number;
  };
  dailySpin: {
    today: number;
    yesterday: number;
  };
  captcha: {
    today: number;
    yesterday: number;
  };
}

export interface DailyResetStatusResponse {
  message: string;
  data: {
    resetTime: string;
    today: string;
    yesterday: string;
    statistics: DailyResetStatistics;
    note: string;
  };
}

// Get Cron Jobs Status API
export const getCronJobsStatus = async (): Promise<CronJobsStatusResponse> => {
  const response = await fetch(`${BASE_URL}/cron/status`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Get Daily Reset Status API
export const getDailyResetStatus = async (): Promise<DailyResetStatusResponse> => {
  const response = await fetch(`${BASE_URL}/cron/daily-reset`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Support Link Interfaces
export interface SupportLinkSettings {
  _id?: string;
  SupportLink: string;
  SupportEmail?: string | null;
  SupportPhone?: string | null;
  SupportWhatsApp?: string | null;
  IsActive: boolean;
  Description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSupportLinkRequest {
  SupportLink: string;
  SupportEmail?: string | null;
  SupportPhone?: string | null;
  SupportWhatsApp?: string | null;
  IsActive?: boolean;
  Description?: string | null;
}

export interface UpdateSupportLinkRequest {
  SupportLink?: string;
  SupportEmail?: string | null;
  SupportPhone?: string | null;
  SupportWhatsApp?: string | null;
  IsActive?: boolean;
  Description?: string | null;
}

export interface SupportLinkResponse {
  message: string;
  data: SupportLinkSettings;
}

// Create/Set Support Link API
export const setSupportLink = async (data: CreateSupportLinkRequest): Promise<SupportLinkResponse> => {
  const response = await fetch(`${BASE_URL}/support/link`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};

// Get Support Link API
export const getSupportLink = async (): Promise<SupportLinkResponse> => {
  const response = await fetch(`${BASE_URL}/support/link`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse(response);
};

// Update Support Link API
export const updateSupportLink = async (data: UpdateSupportLinkRequest): Promise<SupportLinkResponse> => {
  const response = await fetch(`${BASE_URL}/support/link`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse(response);
};
