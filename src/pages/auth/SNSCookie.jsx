import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { authAPI } from '../../components/common/apiClient';

function SNSCookie() {
  const navigate = useNavigate();

  useEffect(() => {
    const exchangeToken = async () => {
      try {
        console.log('▶ SNSCookie: /jwt/exchange 호출');  // 로그

        const { data } = await authAPI.exchangeOAuthToken();
        console.log('▶ /jwt/exchange 응답:', data);      // 응답 확인

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        console.log('▶ 저장된 accessToken:', localStorage.getItem('accessToken'));
        console.log('▶ 저장된 refreshToken:', localStorage.getItem('refreshToken'));

        navigate("/termcondition");
      } catch (error) {
        console.error('▶ /jwt/exchange 실패:', error);
        alert("소셜 로그인 실패");
        navigate("/");
      }
    };

    exchangeToken();
  }, [navigate]);


  return <p>로그인 처리 중...</p>;
}

export default SNSCookie;
