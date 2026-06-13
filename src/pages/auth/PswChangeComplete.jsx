// PswChangeComplete.jsx
import IdPswFindTop from "../../components/auth/IdPswFindTop";
import CompleteCircle from '../../img/complete-round.svg';
import CompleteCheck from '../../img/complete-check.svg';
import Navigation from "../../components/common/Navigate";
import Header from "../../components/common/Header";
import IdPswFindDesktop from "../../components/auth/IdPswFindDesktop";
import { useLocation } from 'react-router-dom';  

export default function PswChangeComplete() {
  const { loginpg } = Navigation();
  const location = useLocation();               
  const { nickname, attendanceNumber } = location.state || {};

  const displayName = nickname && attendanceNumber
    ? `${nickname}(${attendanceNumber})`
    : '';

  return (
    <div className="term-all-scroll-ct">
      <IdPswFindTop />
      <Header />
      <IdPswFindDesktop step={2} />
      <section className="signup-complete-ct">

        <div className="pswchange-complete-check-img-ct">
          <img src={CompleteCircle} alt="" />
          <img className="pswchange-completecheck-img" src={CompleteCheck} alt="체크표시" />
        </div>

        <p className="complete-message"> 비밀번호 변경 완료</p>

        <p className="complete-inf-message">
          <span>{displayName}</span> 님의 비밀번호가 <br />
          성공적으로 재설정되었습니다.
        </p>

        <button className="pswchange-complete-btn" onClick={loginpg}>
          로그인하러 가기
        </button>
      </section>
    </div>
  );
}
