import AcademyLogo from '../../img/academy-logo.svg';
import AcademyLogoDesktop from '../../img/academy-logo-desktop.svg';
import MobileProfileImg from '../../img/mobile-profile.svg';
import Navigation from './Navigate';
import { authAPI } from './apiClient.jsx';
import '../../css/common/Header.css'
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { movehome, loginpg, movesignup } = Navigation();

  const { logout } = useAuth();
  // ✅ localStorage 토큰 확인 (기존)
  const isLoggedIn = localStorage.getItem('accessToken') !== null;

  // ✅ 로그인 페이지 경로 체크
  const isLoginPage = window.location.pathname === '/';

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('로그아웃 API 실패:', error);
    } finally {
      logout();  // ✅ 3. AuthContext logout 호출 (이전 오류 원인)
      localStorage.clear();
      window.location.href = '/';  // 로그인 페이지로 강제 이동
    }
  };


  return (
    <div className='top-header-style'>
      <header className='top-header-ct'>
        <img
          className="academy-logo-desktop desktoplogo"
          src={AcademyLogoDesktop}
          onClick={movehome}
        />

        <div className='login-logout-ct'>
          {/* ✅ 로그인 페이지에서는 무조건 로그인/회원가입 표시 */}
          {isLoginPage ? (
            <>
              <p className='desktop-ct logout' onClick={loginpg} style={{ cursor: 'pointer' }}>
                로그인
              </p>
              <p className='desktop-ct logout' onClick={movesignup} style={{ cursor: 'pointer' }}>
                회원가입
              </p>
            </>
          ) : (
            /* ✅ 다른 페이지에서는 실제 로그인 상태 표시 */
            !isLoggedIn ? (
              <>
                <p className='desktop-ct logout' onClick={loginpg} style={{ cursor: 'pointer' }}>
                  로그인
                </p>
                <p className='desktop-ct logout' onClick={movesignup} style={{ cursor: 'pointer' }}>
                  회원가입
                </p>
              </>
            ) : (
              <p className='desktop-ct logout' onClick={handleLogout} style={{ cursor: 'pointer' }}>
                로그아웃
              </p>
            )
          )}
        </div>
      </header>
      <div className="top-line desktop-ct"> </div>
    </div>
  );
}
