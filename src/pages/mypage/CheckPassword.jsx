import backBtn from '../../img/back-btn.svg';
import { authAPI } from '../../components/common/apiClient';
import { useState, useEffect } from 'react';
import Navigation from '../../components/common/Navigate';
import Modal from '../../components/common/Modal';
import Header from '../../components/common/Header';

// CSS 임포트
import '../../css/auth/LocalSignUp.css';
import changeF from '../../css/mypage/ChangeForm.module.css';
import scroll from "../../css/common/scroll.module.css";
import myp from '../../css/mypage/MyPage.module.css';

// 아이콘 임포트
import ShowPaswword from '../../img/inputeye.svg';
import Inputuneye from '../../img/inputuneye.svg';

function CheckPassword() {
    const { movemyinfo } = Navigation();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPass, setNewPass] = useState("");
    const [cNewPass, setCNewPass] = useState("");

    const [onModal, setOnModal] = useState(false);
    const [error, setError] = useState(false);
    const [myInfo, setMyInfo] = useState(null);

    const [checkPass, setCheckPass] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    // ✅ 가시성 상태 관리 (현재 비밀번호 추가)
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

    const hasLetterAndNumber = (value) => {
        const hasLetter = /[A-Za-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        return hasLetter && hasNumber;
    };

    const isPasswordValid = newPass.length >= 8 && newPass.length <= 16 && hasLetterAndNumber(newPass);
    const isPasswordMatch = newPass === cNewPass && cNewPass !== "";

    const passwordHasError = newPass.length > 0 && !isPasswordValid;
    const passwordMatchError = cNewPass.length > 0 && !isPasswordMatch;
    const showPasswordError = passwordHasError || passwordMatchError;

    useEffect(() => {
        const myInfoString = window.localStorage.getItem('myInfo');
        if (myInfoString) {
            setMyInfo(JSON.parse(myInfoString));
        }
    }, []);

    const handleCheckPassword = async () => {
        if (!currentPassword) return;
        try {
            await authAPI.checkPassword({ password: currentPassword });
            setError(false);
            setCheckPass(true);
            setCurrentPassword("");
        } catch (err) {
            if (err.response?.status === 400) {
                setError(true);
            }
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPass || !cNewPass) return;
        if (!isPasswordValid || !isPasswordMatch) return;

        try {
            const requestData = {
                username: myInfo?.username,
                password: newPass,
                passwordConfirm: cNewPass,
            };

            const response = await authAPI.changePassword(requestData);

            if (response.status === 200) {
                setOnModal(true);
                setNewPass("");
                setCNewPass("");
            }
        } catch (err) {
            if (err.response?.status === 400) {
                if (err.response.data.message === "이미 사용 중인 비밀번호입니다.") {
                    setPasswordError(true);
                    setNewPass("");
                    setCNewPass("");
                }
            } else {
                alert("서버 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className={scroll.scroll}>
            <div className={scroll.scroll_section}>
                <div className={myp.header_app}>
                    <Header />
                </div>
                <header className={changeF.mypage_header}>
                    <div>
                        <button onClick={movemyinfo}><img src={backBtn} alt="back" /></button>
                        <p>비밀번호 변경</p>
                    </div>
                </header>
                <section className={scroll.turn_display_app}>
                    <p>계속하시려면<br />화면을 세로로 돌려주세요.</p>
                    <div></div>
                </section>

                <section className={changeF.form_section}>
                    {checkPass ? (
                        <>
                            <label>변경할 비밀번호</label>
                            <div className={`${changeF.togle_input_div} ${passwordError || (showPasswordError && passwordHasError) ? changeF.error_input : ""}`} style={{ position: 'relative' }}>
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    placeholder='변경할 비밀번호 입력'
                                    value={newPass}
                                    onChange={(e) => setNewPass(e.target.value)}
                                    onClick={() => setPasswordError(false)}
                                    maxLength={16}
                                />
                                <button
                                    type="button"
                                    className="pw-icon-btn"
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none' }}
                                    onClick={() => setPasswordVisible(v => !v)}
                                >
                                    <img src={passwordVisible ? ShowPaswword : Inputuneye} alt="toggle" />
                                </button>
                            </div>
                            {passwordError && <p className={changeF.error_p}>이미 사용 중인 비밀번호입니다.</p>}
                            {!passwordError && (
                                <p className={showPasswordError && passwordHasError ? changeF.error_p : ""}>
                                    영문, 숫자를 포함해 8~16자로 입력해 주세요.
                                </p>
                            )}

                            <div style={{ marginTop: '20px' }}></div>

                            <label>변경할 비밀번호 재확인</label>
                            <div className={`${changeF.togle_input_div} ${passwordMatchError ? changeF.error_input : ""}`} style={{ position: 'relative' }}>
                                <input
                                    type={passwordConfirmVisible ? 'text' : 'password'}
                                    placeholder='변경할 비밀번호 재입력'
                                    value={cNewPass}
                                    onChange={(e) => setCNewPass(e.target.value)}
                                    maxLength={16}
                                />
                                <button
                                    type="button"
                                    className="pw-icon-btn"
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none' }}
                                    onClick={() => setPasswordConfirmVisible(v => !v)}
                                >
                                    <img src={passwordConfirmVisible ? ShowPaswword : Inputuneye} alt="toggle" />
                                </button>
                            </div>
                            {showPasswordError && passwordMatchError && (
                                <p className={changeF.error_p}>변경 비밀번호가 일치하지 않습니다.</p>
                            )}

                            <button
                                className={isPasswordValid && isPasswordMatch ? changeF.activeBtn : ""}
                                onClick={handleUpdatePassword}
                                disabled={!isPasswordValid || !isPasswordMatch}
                                style={{ marginTop: '20px' }}
                            >
                                변경하기
                            </button>
                        </>
                    ) : (
                        <>
                            <label>현재 비밀번호</label>
                            {/* ✅ 현재 비밀번호 입력창 가시성 토글 적용 */}
                            <div className={`${changeF.togle_input_div} ${error ? changeF.error_input : ""}`} style={{ position: 'relative' }}>
                                <input
                                    type={currentPasswordVisible ? 'text' : 'password'}
                                    placeholder='현재 비밀번호 입력'
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="pw-icon-btn"
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none' }}
                                    onClick={() => setCurrentPasswordVisible(v => !v)}
                                >
                                    <img src={currentPasswordVisible ? ShowPaswword : Inputuneye} alt="toggle" />
                                </button>
                            </div>
                            {error && <p className={changeF.errorP}>비밀번호가 틀렸습니다.</p>}
                            <button
                                className={currentPassword ? changeF.activeBtn : ""}
                                onClick={handleCheckPassword}
                            >
                                비밀번호 확인
                            </button>
                        </>
                    )}
                </section>

                {onModal && <Modal text="변경이 완료되었습니다." event={() => {
                    setOnModal(false);
                    movemyinfo();
                }} />}
            </div>
        </div>
    );
}

export default CheckPassword;