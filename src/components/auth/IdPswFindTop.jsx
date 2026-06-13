
import Backbtn from '../../img/backbtn.svg'
import '../../css/auth/IdPswFindTop.css'
import Navigation from '../common/Navigate'

function IdPswFindTop({ step = 1, onBack, backTo }) {
    const { idfind, pswfind } = Navigation();

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
                <div>
                    <img src={Backbtn} alt="뒤로가기 버튼" onClick={handleBackClick} />
                </div>
                <p className='login-title-font'> 아이디/비밀번호 찾기 </p>
                <div className='idpsw'></div>
            </div>

            <section className='id-psw-find-ct'>
                <p onClick={idfind} style={{ cursor: 'pointer' }}> 아이디 찾기</p>
                <p onClick={pswfind} style={{ cursor: 'pointer' }}> 비밀번호 재설정</p>
            </section>

            <div className={`Idpsw-mobile-line step-${step}`}> </div>
        </div>
    )
}

export default IdPswFindTop
