const API_BASE = 'http://localhost:8000/api';

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('jharkhand_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.detail || errorData.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return res.json();
};

export const api = {
  // --- Auth ---
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    switchDemoRole: async (role) => {
      const res = await fetch(`${API_BASE}/auth/demo-switch/${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return handleResponse(res);
    },
    getRoles: async () => {
      const res = await fetch(`${API_BASE}/auth/roles`);
      return handleResponse(res);
    }
  },

  // --- Challenges ---
  challenges: {
    list: async (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val);
        }
      });
      const res = await fetch(`${API_BASE}/challenges/?${query.toString()}`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    get: async (id) => {
      const res = await fetch(`${API_BASE}/challenges/${id}`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    submit: async (data) => {
      const res = await fetch(`${API_BASE}/challenges/submit`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    updateStatus: async (id, statusData) => {
      const res = await fetch(`${API_BASE}/challenges/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(statusData)
      });
      return handleResponse(res);
    }
  },

  // --- AI Engines ---
  ai: {
    categorize: async (text) => {
      const res = await fetch(`${API_BASE}/ai/categorize`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text })
      });
      return handleResponse(res);
    },
    duplicates: async (data) => {
      const res = await fetch(`${API_BASE}/ai/duplicates`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    prioritize: async (data) => {
      const res = await fetch(`${API_BASE}/ai/prioritize`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    matchInstitutions: async (data) => {
      const res = await fetch(`${API_BASE}/ai/match-institutions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    draftProposal: async (challengeId) => {
      const res = await fetch(`${API_BASE}/ai/draft-proposal`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ challenge_id: challengeId })
      });
      return handleResponse(res);
    },
    saarthiChat: async (data) => {
      const res = await fetch(`${API_BASE}/ai/saarthi-chat`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },

  // --- Assignments ---
  assignments: {
    assign: async (data) => {
      const res = await fetch(`${API_BASE}/assignments/assign`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    respond: async (data) => {
      const res = await fetch(`${API_BASE}/assignments/respond`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    getMyAssignments: async () => {
      const res = await fetch(`${API_BASE}/assignments/my-assignments`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  // --- Proposals & Milestones ---
  proposals: {
    submit: async (data) => {
      const res = await fetch(`${API_BASE}/proposals/submit`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    approve: async (proposalId) => {
      const res = await fetch(`${API_BASE}/proposals/${proposalId}/approve`, {
        method: 'POST',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    updateMilestone: async (data) => {
      const res = await fetch(`${API_BASE}/proposals/milestone/status`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },

  // --- Marketplace ---
  marketplace: {
    getOpportunities: async (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, v);
      });
      const res = await fetch(`${API_BASE}/marketplace/opportunities?${query.toString()}`);
      return handleResponse(res);
    },
    createOpportunity: async (data) => {
      const res = await fetch(`${API_BASE}/marketplace/opportunities`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    apply: async (data) => {
      const res = await fetch(`${API_BASE}/marketplace/apply`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    getMyApplications: async () => {
      const res = await fetch(`${API_BASE}/marketplace/my-applications`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  // --- Analytics ---
  analytics: {
    getOverview: async () => {
      const res = await fetch(`${API_BASE}/analytics/overview`);
      return handleResponse(res);
    },
    getDistricts: async () => {
      const res = await fetch(`${API_BASE}/analytics/districts`);
      return handleResponse(res);
    },
    getCategories: async () => {
      const res = await fetch(`${API_BASE}/analytics/categories`);
      return handleResponse(res);
    },
    getStages: async () => {
      const res = await fetch(`${API_BASE}/analytics/stages`);
      return handleResponse(res);
    },
    getInstitutions: async () => {
      const res = await fetch(`${API_BASE}/analytics/institutions`);
      return handleResponse(res);
    },
    exportCsvUrl: `${API_BASE}/analytics/export-csv`
  },

  // --- Feedback ---
  feedback: {
    submit: async (data) => {
      const res = await fetch(`${API_BASE}/feedback/submit`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    getForChallenge: async (challengeId) => {
      const res = await fetch(`${API_BASE}/feedback/${challengeId}`);
      return handleResponse(res);
    }
  },

  // --- Audit & Notifications ---
  audit: {
    getLogs: async () => {
      const res = await fetch(`${API_BASE}/audit/logs`);
      return handleResponse(res);
    },
    getNotifications: async () => {
      const res = await fetch(`${API_BASE}/audit/notifications`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    markRead: async (notifId) => {
      const res = await fetch(`${API_BASE}/audit/notifications/${notifId}/read`, {
        method: 'POST',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  // --- Project Funding Marketplace ---
  funding: {
    list: async (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val);
        }
      });
      const res = await fetch(`${API_BASE}/funding?${query.toString()}`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    get: async (proposalId) => {
      const res = await fetch(`${API_BASE}/funding/${proposalId}`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    contribute: async (data) => {
      const res = await fetch(`${API_BASE}/funding/contribute`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    request: async (data) => {
      const res = await fetch(`${API_BASE}/funding/request`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },

  // --- Rewards & Opportunities ---
  rewards: {
    getCertificates: async (userId = null) => {
      const url = userId ? `${API_BASE}/rewards/certificates?user_id=${userId}` : `${API_BASE}/rewards/certificates`;
      const res = await fetch(url, { headers: getHeaders() });
      return handleResponse(res);
    },
    verifyCertificate: async (certId) => {
      const res = await fetch(`${API_BASE}/rewards/certificates/verify/${certId}`);
      return handleResponse(res);
    },
    issueCertificate: async (data) => {
      const res = await fetch(`${API_BASE}/rewards/certificates/issue`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    getOpportunities: async () => {
      const res = await fetch(`${API_BASE}/rewards/opportunities`);
      return handleResponse(res);
    },
    getPortfolio: async (userId) => {
      const res = await fetch(`${API_BASE}/rewards/portfolio/${userId}`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    getAchievements: async () => {
      const res = await fetch(`${API_BASE}/rewards/achievements`);
      return handleResponse(res);
    },
    getPoints: async (userId) => {
      const res = await fetch(`${API_BASE}/rewards/points/${userId}`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    getGoodies: async () => {
      const res = await fetch(`${API_BASE}/rewards/goodies`);
      return handleResponse(res);
    },
    redeemGoodie: async (data) => {
      const res = await fetch(`${API_BASE}/rewards/goodies/redeem`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },

  // --- Investor & Startup Hub ---
  investor: {
    getStartups: async () => {
      const res = await fetch(`${API_BASE}/investor/startups`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    getMeetings: async () => {
      const res = await fetch(`${API_BASE}/investor/meetings`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    requestMeeting: async (data) => {
      const res = await fetch(`${API_BASE}/investor/meetings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    updateMeetingStatus: async (meetingId, status, notes = null) => {
      const res = await fetch(`${API_BASE}/investor/meetings/${meetingId}/status?status=${encodeURIComponent(status)}${notes ? `&notes=${encodeURIComponent(notes)}` : ''}`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  }
};
