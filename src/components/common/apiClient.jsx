import axios from 'axios'
import CheckPassword from '../../pages/mypage/CheckPassword';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const publicClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (newToken, error) => {
  refreshQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(newToken);
    }
  });
  refreshQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료 등으로 401이면서, 아직 재시도 안 한 요청만 처리
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        // 리프레시 토큰 없으면 바로 실패
        return Promise.reject(error);
      }

      // 이미 다른 요청이 refresh 중이면 큐에 쌓았다가 끝나면 재시도
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      // 여기서 실제로 refresh 요청
      isRefreshing = true;

      try {
        const res = await publicClient.post('/jwt/refresh', {
          refreshToken: storedRefreshToken,
        });

        // 백엔드 응답 형식에 맞게 필드명 수정
        const { accessToken, refreshToken: newRefreshToken } = res.data;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // 큐에 있는 요청들 처리
        processQueue(accessToken, null);

        // 현재 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        // 실패 시 큐에 있는 요청들 모두 에러 처리 + 토큰 제거
        processQueue(null, refreshErr);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export const authAPI = {
  login: (data) => publicClient.post('/login', data),   // 로그인
  signup: (data) => publicClient.post('/api/user/signup', data), // 회원가입

  // 회원가입 아이디 중복 확인 
  checkUsernameExists: (username) => publicClient.post('/api/user/exist/username', { username }),

  // 회원가입 출결번호 중복 확인
  checkattendanceExists: (attendanceNumber) => publicClient.post('/api/user/exist/attendance', { attendanceNumber }),
  getMyInfo: () => apiClient.get('/api/user/mypage'),
  //  로그아웃
  logout: (refreshToken) =>
    apiClient.post('/logout', {
      refreshToken: refreshToken, // { "refreshToken": "..." } 형식
    }),

  // SNS 로그인 쿠키 api
  exchangeOAuthToken: () => publicClient.post('/jwt/exchange', {}, {
    withCredentials: true  // 쿠키 포함
  }),

  //  수정된 회원가입1 기존 재학생 버전
  verifyExistingMember: (data) => publicClient.post('/api/user/verify-existing', data),

  // 
  //  수정된 회원가입2 기존 재학생 버전
  completeExistingSignup: (data) => publicClient.post('/api/user/complete-existing', data),

  // (관리자) 특정 반 예약자 자리변경
  adminUpdateReservation: (reservationId, data) => apiClient.put(`/api/admin/reservations/${reservationId}`, data),

  signupcomplete: (data) => apiClient.get('/api/user/mypage', data),
  getMyReservations: () => apiClient.get('/api/reservations/myRV'),
  getLectureList: () => apiClient.get('/api/lectures/list'),
  getMyInfo: () => apiClient.get('/api/user/mypage'),
  checkPassword: (data) => apiClient.post('/api/user/verify-password', data),
  changeInfo: (data) => apiClient.put('/api/user/mypage', data),
  changePassword: (data) => apiClient.patch('/api/user/password', data),
  regiInstructors: (data) => apiClient.post('/api/admin/instructors', data),
  regiSubjects: (data) => apiClient.post('/api/admin/subjects', data),
  regiClassrooms: (data) => apiClient.post('/api/admin/classrooms', data),
  deleteMySeat: (reservationId) => apiClient.delete(`/api/reservations/myRV/${reservationId}`),
  instructorsAdd: () => apiClient.get('/api/admin/instructors'),
  subjectsAdd: () => apiClient.get('/api/admin/subjects'),
  classroomsAdd: () => apiClient.get('/api/admin/classrooms'),
  // 좌석 수정 api 
  updateMyReservation: (reservationId, data) => apiClient.put(`/api/reservations/myRV/${reservationId}`, data),

  // refresh 토큰 재발급
  refreshToken: (refreshToken) =>
    publicClient.post('/jwt/refresh', {
      refreshToken: refreshToken,   // { "refreshToken": "..." } 형식
    }),

  // ✅ 소셜 회원가입
  socialSignup: (data) => apiClient.post('/api/user/socialSignup', data),

  // 좌석예약(reservation.jsx)
  reserveSeat: (data) => apiClient.post('/api/reservations', data),
  getLectureInfo: (lectureId) => apiClient.get(`/api/lectures/${lectureId}`),


  // 아이디 찾기, 비번찾기
  findUsername: (data) => publicClient.post('/api/user/find-username', data),
  verifyResetPassword: (data) =>
    publicClient.post('/api/user/verify-reset-password', data),
  resetPassword: (data) => publicClient.post('/api/user/reset-password', data),
  deleteUser: () => apiClient.delete('/api/user/mypage'),

  //관리자pg
  managerDeleteUser: (userId) =>
    apiClient.delete(`/api/admin/users/${userId}`),

  managerLectureList: (page) => apiClient.get(`/api/admin/lectures/all?page=${page}`),
  managerLectureRsvList: (lectureId, params) => apiClient.get(`/api/admin/lectures/${lectureId}/reservations`, { params }),
  managerLectureUserDelete: (reservationId) => apiClient.delete(`/api/admin/reservations/${reservationId}`),
  managerDeleteLecture: (lecktureId) => apiClient.delete(`/api/admin/lectures/${lecktureId}`),

  managerUserList: (params) => apiClient.get('/api/admin/users', { params }),

  managerAcessUserList: (params) => apiClient.get(`/api/admin/users/pending`, { params }),



  managerAcessUser: (userId) => apiClient.patch(`/api/admin/users/${userId}/approve`),
  managerAcessRefusal: (userId) => apiClient.delete(`/api/admin/users/${userId}/reject`),
  lectureRegi: (data) => apiClient.post('/api/admin/lectures', data),
  checkLectureInfo: (lectureId) => apiClient.get(`/api/admin/lectures/${lectureId} `),
  modiLectureInfo: (lectureId, data) => apiClient.get(`/api/admin/lectures/${lectureId} `, data),

  searchreservation: (lectureId, nickname) => apiClient.get(`/api/admin/lectures/${lectureId}/reservations?nickname=${nickname}`),
  deleteinstructor: (instructorId) => apiClient.delete(`/api/admin/instructors/${instructorId}`),
  modiinstructor: (instructorId, data) => apiClient.put(`/api/admin/instructors/${instructorId}`, data),
  deletesubject: (subjectId) => apiClient.delete(`/api/admin/subjects/${subjectId}`),
  modisubject: (subjectId, data) => apiClient.put(`/api/admin/subjects/${subjectId}`, data),
  deleteclassroom: (classroomId) => apiClient.delete(`/api/admin/classrooms/${classroomId}`),
  modiclassroom: (classroomId, data) => apiClient.put(`/api/admin/classrooms/${classroomId}`, data),
  deleteclassreservation: (lectureId) => apiClient.delete(`/api/admin/lectures/${lectureId}`),
  editclassreservation: (lecktureId, data) => apiClient.put(`/api/admin/lectures/${lecktureId}`, data)
};

export default apiClient;