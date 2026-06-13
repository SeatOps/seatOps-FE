import '../../css/auth/Login.css';
import GoogleLoginimg from '../../img/google-login-logo.svg';
import NaverLoginimg from '../../img/naver-login-log.png';
import Navigation from '../../components/common/Navigate.jsx';
import { useState, useEffect } from 'react';
import { authAPI } from '../../components/common/apiClient.jsx';
import SignupTop from '../../components/auth/SignupTop.jsx';
import Logoimg from '../../img/login-academy-logo.svg';
import Header from '../../components/common/Header.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Modal from '../../components/common/Modal.jsx';
import inputvisible from '../../img/inputeye.svg';
import inputremove from '../../img/inputuneye.svg';
import eyeCss from '../../css/auth/logineye.module.css'


export default function Login() {
  const { loginpg, movesignup, idfind, pswfind, movehome } = Navigation();
  const { login: contextLogin } = useAuth();

  const [loading, setLoading] = useState(false);
  // message 상태 제거 (모달로 통합)

  // 입력 값 상태
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 모달 상태 (확장)
  const [modalType, setModalType] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [newPwVisible, setNewPwVisible] = useState(false);


  // 로그인 submit 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModalType(null); // 기존 모달 닫기

    try {
      const response = await authAPI.login({
        username,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      // 기존 로직 + AuthContext 연동
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      contextLogin(accessToken);

      // 성공 → 성공 모달
      setErrorMessage('로그인에 성공했습니다!');
      setModalType('success');

      // 2초 후 자동 홈 이동
      setTimeout(() => {
        movehome();
      }, 1500);

    } catch (error) {
      console.error("로그인 에러:", error);

      // 모든 오류를 모달로 통합 처리
      let msg = '알 수 없는 오류가 발생했습니다.';
      let type = 'error';

      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 401) {
          const errorCode = errorData?.code;
          msg = errorData?.message || '로그인에 실패했습니다.';

          if (errorCode === 'NOT_APPROVED') {
            type = 'not-approved';
          } else if (errorCode === 'LOGIN_FAILED') {
            type = 'login-failed';
          } else {
            type = 'login-failed';
          }
        } else if (status === 400) {
          msg = errorData?.message || '입력 정보를 확인해주세요.';
          type = 'error';
        } else if (status === 500) {
          msg = '서버 오류입니다. 잠시 후 다시 시도해주세요.';
          type = 'server-error';
        } else {
          msg = errorData?.message || `오류 (${status})`;
          type = 'error';
        }
      } else if (error.request) {
        // 네트워크 오류
        msg = '네트워크 연결을 확인해주세요.';
        type = 'network-error';
      } else {
        msg = error.message || '로그인 중 오류가 발생했습니다.';
        type = 'error';
      }

      setErrorMessage(msg);
      setModalType(type);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && token !== 'undefined' && token !== 'null') {
      movehome();
    }
  }, []);

  // 모달 닫기
  const closeModal = () => {
    setModalType(null);
    setErrorMessage('');
  };

  return (
    <div className="term-all-scroll-ct">
      <SignupTop title="로그인" onBack={loginpg} />
      <Header />
      <section className="login-ct">
        <p className="login-mobile-logoimg">
          <img src={Logoimg} alt="로고" />
        </p>
        <p className="login-desktop-pharse"> 로그인 </p>

        <form className="login-form-ct" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            className="id-input"
            placeholder="아이디"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div
            className={`password-input ${eyeCss.input_div}`}
          >
            <input
              type={newPwVisible ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
            />
            <button
              type="button"
              className="pw-icon-btn"
              onClick={() => setNewPwVisible(v => !v)}
            >
              <img
                src={newPwVisible ? inputvisible : inputremove}
                alt={newPwVisible ? "비밀번호 숨기기" : "비밀번호 보이기"}
              />
            </button>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
            style={{ cursor: 'pointer' }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="find-singup-ct">
          <p className="id-find" onClick={idfind} style={{ cursor: 'pointer' }}>
            아이디 찾기
          </p>
          <div> | </div>
          <p className="password-find" onClick={pswfind} style={{ cursor: 'pointer' }}>
            비밀번호 찾기
          </p>
          <div> | </div>
          <p className="signup" onClick={movesignup} style={{ cursor: 'pointer' }}>
            회원가입
          </p>
        </div>
      </section>

      {modalType && (
        <div className="reservation-modal-ct">
          {modalType === 'success' && (
            <Modal
              text={errorMessage}
              event={() => closeModal()}
            />
          )}
          {modalType === 'not-approved' && (
            <Modal
              text={errorMessage}
              event={() => closeModal()}
            />
          )}
          {modalType === 'login-failed' && (
            <Modal
              text={errorMessage}
              event={() => closeModal()}
            />
          )}
          {modalType === 'error' && (
            <Modal
              text={errorMessage}
              event={() => closeModal()}
            />
          )}
          {modalType === 'server-error' && (
            <Modal
              text={errorMessage}
              event={() => closeModal()}
            />
          )}
          {modalType === 'network-error' && (
            <Modal
              text={errorMessage}
              event={() => closeModal()}
            />
          )}
        </div>
      )}
    </div>
  );
}
