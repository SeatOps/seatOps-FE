import removebtn from '../../img/signupbackbtn.svg'
import '../../css/auth/Login.css'
import Navigation from '../common/Navigate'
import Backbtn from '../../img/backbtn.svg'

function SignupTop2({ step = 1, onBack, backTo, leftBackTo, rightBackTo }) {
    const { termcondition, movesignup } = Navigation();

    // ✅ 왼쪽 뒤로가기 (Backbtn) 핸들러
    const handleLeftBackClick = () => {
        if (leftBackTo) {
            // leftBackTo prop 있으면 해당 경로로 이동
            window.location.href = leftBackTo;
        } else if (onBack) {
            // onBack prop 있으면 콜백 실행
            onBack();
        } else {
            // 기본: 브라우저 뒤로가기
            window.history.back();
        }
    };

    // ✅ 오른쪽 뒤로가기 (removebtn) 핸들러
    const handleRightBackClick = () => {
        if (rightBackTo) {
            // rightBackTo prop 있으면 해당 경로로 이동
            window.location.href = rightBackTo;
        } else if (backTo) {
            // backTo prop 있으면 해당 경로로 이동
            window.location.href = backTo;
        } else {
            // 기본: 홈으로 이동 (또는 movesignup)
            movesignup();
        }
    };

    return (
        <div className='signup-top-style'>
            <div className="mobile-login-top-ct">
                <div>
                    {/* ✅ 왼쪽 버튼: handleLeftBackClick */}
                    <img 
                        src={Backbtn} 
                        onClick={handleLeftBackClick} 
                        alt="뒤로가기 버튼" 
                    />
                </div>
                <p className='login-title-font'> 회원가입 </p>
                <img 
                    src={removebtn} 
                    onClick={handleRightBackClick}
                    alt="닫기 버튼"
                />
            </div>
            <div className={`login-mobile-line step-${step}`}> </div>
        </div>
    )
}

export default SignupTop2
