import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import '../../css/common/ProtectedRoute.css'

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>로딩 중...</div>; // 초기 로딩 방지

  if (!isAuthenticated) {
    return (
      <div>
        <Header />
        <section className='protect-another-site'>
          <p className='protect-pharse'> 로그인 후 이용 가능합니다</p>
          <button
            onClick={() => window.location.href = '/'}
            className="login-redirect-btn"
          >
            로그인하기
          </button>
        </section>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
