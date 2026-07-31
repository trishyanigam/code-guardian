import apiClient from './api';

export const securityService = {
  async getHealthStatus() {
    return apiClient.get('/health');
  },
  
  async scanCodeSnippet(code, language = 'javascript') {
    return apiClient.post('/scan', { code, language });
  },

  async getProjectScans(projectId) {
    return apiClient.get(`/projects/${projectId}/scans`);
  },
};
