import Backbtn from '../../img/backbtn.svg'
import '../../css/auth/SignupTop.css'

function SignupTop({ title, onBack, backTo }) {
    // 뒤로가기 핸들러
    const handleBackClick = () => {
        if (onBack) {
            // onBack prop이 있으면 콜백 실행
            onBack();
        } else if (backTo) {
            // backTo prop이 있으면 해당 경로로 이동 (react-router 사용 시)
            window.history.back(); // 또는 window.location.href = backTo;
        } else {
            // 기본: 뒤로가기
            window.history.back();
        }
    };

    return (
        <div className='signup-top-style'>
            <div className="mobile-login-top-ct">
                <img 
                    src={Backbtn} 
                    className="back-btn-img"
                    onClick={handleBackClick}
                    alt="뒤로가기"
                    style={{ cursor: 'pointer' }}
                />
                <p className='login-title-font'> {title} </p>
                <div></div>
            </div>
            <div className='login-mobile-line'> </div>
        </div>
    )
}

export default SignupTop
