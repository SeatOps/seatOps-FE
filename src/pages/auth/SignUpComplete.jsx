// SignUpComplete.jsx
import Header from "../../components/common/Header"
import CompleteCircle from '../../img/complete-round.svg';
import CompleteCheck from '../../img/complete-check.svg'

import '../../css/auth/SignUpComplete.css'
import Navigation from "../../components/common/Navigate";
import { useLocation } from "react-router-dom";   
import SignupTop2 from "../../components/auth/SignupTop2";
import SignupTermDesktop from "../../components/auth/SignupTermDesktop";

export default function SignUpComplete() {
    const { loginpg } = Navigation();
    const location = useLocation(); 

    // 회원가입 페이지에서 넘긴 값 (없을 수도 있어서 기본값 처리)
    const nickname = location.state?.nickname || '';
    const attendanceNumber = location.state?.attendanceNumber || '';

    return (
        <div className="term-all-scroll-ct">
            <Header />
            <SignupTop2 step={3} />
            <SignupTermDesktop step={3} />
            <section className="signup-complete-ct">
                <p className="complete-title"> 시대원학원 회원가입 </p>

                <div className="complete-check-img-ct">
                    <img src={CompleteCircle} alt="" />
                    <img className="completecheck-img" src={CompleteCheck} alt="체크표시" />
                </div>

                <p className="complete-inf-message">
                    <span>{nickname}({attendanceNumber})</span> 님의 <br />
                    회원가입이 성공적으로 완료되었습니다.
                </p>

                <p className="complete-message2"> 관리자의 승인 후 로그인이 가능하므로 승인될 때까지 <br/> 
                잠시 기다려 주시기 바랍니다.</p>

                <button className="complete-btn" onClick={loginpg}> 로그인하기 </button>
            </section>
        </div>
    );
}
