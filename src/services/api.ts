import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_OTMS_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Course Management APIs
export const courseApi = {
  getAllCourses: (): Promise<AxiosResponse> => api.get('/courses'),
  getCourseById: (id: string): Promise<AxiosResponse> => api.get(`/courses/${id}`),
  getCoursesByOrganization: (organizationId: string): Promise<AxiosResponse> => 
    api.get(`/courses/organization/${organizationId}`),
};

// Enrollment APIs
export const enrollmentApi = {
  getAllEnrollments: (): Promise<AxiosResponse> => api.get('/enrollments'),
  getEnrollmentById: (id: string): Promise<AxiosResponse> => api.get(`/enrollments/${id}`),
  enrollInCourse: (courseId: string): Promise<AxiosResponse> => 
    api.post(`/enrollments/courses/${courseId}/enroll`),
  getUserEnrollments: (userId: string): Promise<AxiosResponse> => 
    api.get(`/enrollments/user/${userId}`),
};

// Resource APIs
export const resourceApi = {
  getAllResources: (): Promise<AxiosResponse> => api.get('/resources'),
  getResourceById: (id: string): Promise<AxiosResponse> => api.get(`/resources/${id}`),
  checkResourceAvailability: (id: string): Promise<AxiosResponse> => 
    api.get(`/resources/${id}/availability`),
};

export default api; 