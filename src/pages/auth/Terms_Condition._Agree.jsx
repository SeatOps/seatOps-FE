import Header from "../../components/common/Header";
import Navigation from "../../components/common/Navigate";
import SignupTermDesktop from "../../components/auth/SignupTermDesktop";
import SignupTop from "../../components/auth/SignupTop";
import { useState, useEffect } from "react";
import { authAPI } from "../../components/common/apiClient";
import Modal from "../../components/common/Modal"; 
import '../../css/auth/TermConditionAgree.css';
import '../../css/auth/SNSsingup.css';

export default function TermConditionAgree() {
    const { loginpg, termallagree, termpersoninf, termmarketing, signup_normal, snssignup, existingsignup} = Navigation();
    const [desktopChecked, setdesktopChecked] = useState(false);
    const [mobileChecked, setmobileChecked] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // 에러 모달 상태
    const [errorModal, setErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // 에러 모달 닫기 함수
    const closeErrorModal = () => {
        setErrorModal(false);
        setErrorMessage('');
    };

    // 컴포넌트 마운트 시 /api/user/mypage GET 호출
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                const response = await authAPI.getMyInfo();
                const { email, roleType, nickname } = response.data;
                setUserInfo({ email, roleType, nickname });
            } catch (error) {
                console.error('사용자 정보 조회 실패:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, []);

    // 회원 타입에 따른 분기 로직
    const handleNext = async () => {
        if (!desktopChecked && !mobileChecked) {
            // 모달 표시
            setErrorMessage('약관동의를 먼저 진행해주시길 바랍니다');
            setErrorModal(true);
            return;
        }

        // localStorage에서 회원가입 타입 확인
        const signupType = localStorage.getItem('signupType');

        if (userInfo?.roleType === 'GUEST') {
            // SNS 회원가입
            snssignup(userInfo.email, userInfo.nickname);
        } else if (signupType === 'existing') {
            // 기존 회원 → ExistingMemberSignUp
            existingsignup();
        } else if (signupType === 'new') {
            //신규 회원 → signup-normal
            signup_normal();
        } 
    };

    return (
        <div className="top-root">
            <SignupTop title='약관동의' onBack={loginpg} />
            <Header />
            <section className="signup-term-scroll-ct">
                <SignupTermDesktop step={1} />

                <section className="agree-check-ct termdesktop">
                    <p className="agree-check-comment"> 모두 확인하였으며 동의합니다.</p>
                    <div className="agree-check-btn-ct">
                        <p className="agree-check-content"> 이용약관, 개인정보처리 및 이용에 대한 안내,
                            개인정보의 마케팅 및 광고 활용, 전화, 문자, 이메일
                            광고성 정보 수신 동의에 모두 동의합니다.
                        </p>
                        <button
                            style={{ cursor: 'pointer' }}
                            className={`agree-check-btn ${desktopChecked ? 'checked' : ''}`}
                            onClick={() => setdesktopChecked(!desktopChecked)}
                        />
                    </div>
                </section>

                <section className="agree-list-ct">
                    <div className="agree-divide-line"></div>

                    <div className="agree-essential-ct">
                        <p> 이용약관 전체 동의 <span className="essential-sub">  (필수) </span></p>
                        <p className="agree-detail" onClick={termallagree} style={{ cursor: 'pointer' }}> 보기 </p>
                    </div>

                    <div className="agree-essential-ct">
                        <p> 개인정보 수집 및 이용 <span className="essential-sub"> (필수) </span></p>
                        <p className="agree-detail" onClick={termpersoninf} style={{ cursor: 'pointer' }}> 보기 </p>
                    </div>

                    <div className="agree-essential-ct">
                        <p> 마케팅 목적의 개인정보 수집 및 이용 <span className="essential-sub"> (필수) </span></p>
                        <p className="agree-detail" onClick={termmarketing} style={{ cursor: 'pointer' }}> 보기 </p>
                    </div>

                    <div className="agree-divide-line"></div>
                </section>

                <section className="agree-check-ct termmobile">
                    <p className="agree-check-comment"> 모두 확인하였으며 동의합니다.</p>
                    <div className="agree-check-btn-ct">
                        <p className="agree-check-content"> 이용약관, 개인정보처리 및 이용에 대한 안내,
                            개인정보의 마케팅 및 광고 활용, 전화, 문자 광고성 정보 수신 동의에 모두 동의합니다.
                        </p>
                        <button
                            className={`agree-check-btn ${mobileChecked ? 'checked' : ''}`}
                            onClick={() => setmobileChecked(!mobileChecked)}
                        />
                    </div>
                </section>

                <button
                    className="agree-next-btn"
                    onClick={handleNext}
                    disabled={loading}
                    style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? '로딩 중...' : '다음'}
                </button>
            </section>

            {errorModal && (
                <Modal 
                    text='약관동의를 먼저 진행해주세요  ' 
                    event={() => {
                        closeErrorModal();
                    }} 
                />
            )}
        </div>
    );
}
