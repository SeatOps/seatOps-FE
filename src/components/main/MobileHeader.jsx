import MobileAcademyLogo from '../../img/academy-logo.svg';
import MobileProfileImg from '../../img/mobile-profile.svg';
import { authAPI } from '../common/apiClient.jsx';
import '../../css/common/MobileHeader.css';
import Navigation from '../common/Navigate.jsx';


export default function MobileHeader() {
  const { loginpg, movemypage } = Navigation();

  const isLoggedIn = localStorage.getItem('accessToken') !== null;

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('로그아웃 API 실패:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      loginpg();
      window.location.reload();
    }
  };

  return (
    <div className=' top-header-style2'>
      <header className='mobile-top-header-ct'>
        <img
          className="modile-academy-logo"
          src={MobileAcademyLogo}
          alt="학원 로고 모바일"
        />
        
        <img
          className="mobile-profile-img"
          src={MobileProfileImg}
          alt="모바일 프로필 이미지"
          onClick={movemypage}
        />
      </header>
    </div>
  );
}
