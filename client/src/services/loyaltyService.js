import api from './api';

const loyaltyService = {
    // Loyalty Points
    getDashboardData: async () => {
        const response = await api.get('/loyalty/dashboard');
        return response.data;
    },

    getHistory: async (limit = 50) => {
        const response = await api.get(`/loyalty/history?limit=${limit}`);
        return response.data;
    },

    redeemPoints: async (points) => {
        const response = await api.post('/loyalty/redeem', { points });
        return response.data;
    },

    getEarnOpportunities: async () => {
        const response = await api.get('/loyalty/earn-opportunities');
        return response.data;
    },

    checkBirthdayBonus: async () => {
        const response = await api.post('/loyalty/birthday-check');
        return response.data;
    },

    // Spin Wheel
    getSpinStatus: async () => {
        const response = await api.get('/spin/status');
        return response.data;
    },

    spinWheel: async () => {
        const response = await api.post('/spin/wheel');
        return response.data;
    },

    getSpinHistory: async () => {
        const response = await api.get('/spin/history');
        return response.data;
    },

    useReward: async (rewardId) => {
        const response = await api.post(`/spin/use-reward/${rewardId}`);
        return response.data;
    },

    // Flash Sales
    getActiveFlashSales: async () => {
        const response = await api.get('/flash-sales/active');
        return response.data;
    },

    getUpcomingFlashSales: async () => {
        const response = await api.get('/flash-sales/upcoming');
        return response.data;
    },

    reserveFlashSaleItem: async (id, quantity) => {
        const response = await api.post(`/flash-sales/${id}/reserve`, { quantity });
        return response.data;
    },

    // Returns
    createReturnRequest: async (data) => {
        const response = await api.post('/returns', data);
        return response.data;
    },

    getMyReturns: async () => {
        const response = await api.get('/returns/my-returns');
        return response.data;
    },

    getReturnDetails: async (id) => {
        const response = await api.get(`/returns/${id}`);
        return response.data;
    },

    cancelReturn: async (id) => {
        const response = await api.put(`/returns/${id}/cancel`);
        return response.data;
    },

    getReturnPolicy: async () => {
        const response = await api.get('/returns/policy/details');
        return response.data;
    },

    // Referral
    getReferralStats: async () => {
        const response = await api.get('/referral/stats');
        return response.data;
    },

    getReferralLeaderboard: async () => {
        const response = await api.get('/referral/leaderboard');
        return response.data;
    }
};

export default loyaltyService;
