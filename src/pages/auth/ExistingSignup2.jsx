import Header from "../../components/common/Header";
import { useState, useEffect } from "react";
import { authAPI } from "../../components/common/apiClient";
import '../../css/auth/LocalSignUp.css';
import '../../css/auth/LocalSignupModal.css';
import Navigation from "../../components/common/Navigate";
import SignuseMobile from "../../components/auth/SignuseMobile"
import SignupTop2 from "../../components/auth/SignupTop2";
import SignupTermDesktop from "../../components/auth/SignupTermDesktop";
import ShowPaswword from '../../img/inputeye.svg';
import Inputuneye from '../../img/inputuneye.svg'
import Modal from "../../components/common/Modal";

export default function ExistingSignup2() {
    const { signupcomplete, movesignup, loginpg, existingsignup } = Navigation();
    const isMobile = SignuseMobile();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [isUsernameDuplicateChecked, setIsUsernameDuplicateChecked] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    const [inputBorderColor, setInputBorderColor] = useState('');

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

    // 비밀번호 상태 분리
    const [passwordStatus, setPasswordStatus] = useState(''); // 'valid' | 'invalid' | ''
    const [passwordConfirmStatus, setPasswordConfirmStatus] = useState(''); // 'match' | 'mismatch' | ''

    const [showValidationModal, setShowValidationModal] = useState(false);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);

    const [usernameMessage, setUsernameMessage] = useState('');
    const [errors, setErrors] = useState({
        username: "",
        password: "",       
        passwordConfirm: ""
    });

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        passwordConfirm: ""
    });

    const [tempUsernameInput, setTempUsernameInput] = useState('');
    const [usernameHasKorean, setUsernameHasKorean] = useState(false);

    // 1단계에서 받은 userId
    const [verifiedUserId, setVerifiedUserId] = useState(null);

    // 1단계에서 받은 userId 로드
    useEffect(() => {
        const userId = localStorage.getItem('verifiedUserId');
        if (userId) {
            setVerifiedUserId(parseInt(userId, 10));
        }
    }, []);

    const isUsernameValid = formData.username.length >= 4 && formData.username.length <= 12;
    const isPasswordValid = formData.password.length >= 8 && formData.password.length <= 16;
    const isPasswordMatch = formData.password === formData.passwordConfirm && formData.passwordConfirm.length > 0;

    const isAllFilled =
        formData.username.trim() !== "" &&
        formData.password.trim() !== "" &&
        formData.passwordConfirm.trim() !== "";

    const isFormValid = isAllFilled &&
        verifiedUserId &&  
        isUsernameValid &&
        isPasswordValid &&
        isPasswordMatch &&
        isUsernameDuplicateChecked &&
        isUsernameAvailable;

    // 비밀번호에 영문 + 숫자가 최소 1자 이상씩 포함됐는지 체크
    const hasLetterAndNumber = (value) => {
        const hasLetter = /[A-Za-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        return hasLetter && hasNumber;
    };

    // 비밀번호 입력 시 독립 검증 
    useEffect(() => {
        const value = formData.password;

        if (value.length === 0) {
            setPasswordStatus('');
            setErrors(prev => ({ ...prev, password: '' }));
            return;
        }

        // 길이 우선 체크
        if (value.length < 8 || value.length > 16) {
            setPasswordStatus('invalid');
            setErrors(prev => ({
                ...prev,
                password: '비밀번호는 8~16자로 입력해주세요.'
            }));
            return;
        }

        // 영문 + 숫자 포함 여부 체크
        if (!hasLetterAndNumber(value)) {
            setPasswordStatus('invalid');
            setErrors(prev => ({
                ...prev,
                password: '영문과 숫자 모두 최소한 한 자 이상 포함시켜주세요.'
            }));
            return;
        }

        // 위 조건 통과 시 유효
        setPasswordStatus('valid');
        setErrors(prev => ({ ...prev, password: '' }));
    }, [formData.password]);

    // 비밀번호 재확인 입력 시 독립 검증 
    useEffect(() => {
        if (formData.passwordConfirm.length === 0) {
            setPasswordConfirmStatus('');
            setErrors(prev => ({ ...prev, passwordConfirm: '' }));
        } else if (formData.password === formData.passwordConfirm) {
            setPasswordConfirmStatus('match');
            setErrors(prev => ({ ...prev, passwordConfirm: '' }));
        } else {
            setPasswordConfirmStatus('mismatch');
            setErrors(prev => ({ ...prev, passwordConfirm: '비밀번호가 일치하지 않습니다.' }));
        }
    }, [formData.passwordConfirm, formData.password]);

    useEffect(() => {
        // 한글 감지
        const hasKorean = /[가-힣]/.test(formData.username);
        setUsernameHasKorean(hasKorean);

        if (hasKorean) {
            setErrors(prev => ({
                ...prev,
                username: '한글은 사용할 수 없습니다. 영문과 숫자만 입력해주세요'
            }));
            setInputBorderColor('#F00');
            return;
        }

        // 기본 상태 초기화
        if (!formData.username.trim()) {
            setErrors(prev => ({ ...prev, username: '' }));
            setInputBorderColor('');
        } else {
            setErrors(prev => ({ ...prev, username: '' }));
            setInputBorderColor('');
        }
    }, [formData.username]);

    const handleDuplicateCheck = async () => {
        if (!formData.username || formData.username.length < 4 || formData.username.length > 12) {
            setErrors(prev => ({
                ...prev,
                username: formData.username.length < 4
                    ? "아이디는 4자 이상 입력해주세요."
                    : "아이디는 12자 이내로 입력해주세요."
            }));
            setUsernameMessage('');
            setIsUsernameAvailable(false);
            setIsUsernameDuplicateChecked(false);
            setInputBorderColor('#F00');
            return;
        }

        try {
            const response = await authAPI.checkUsernameExists(formData.username);

            if (response.data === true) {
                setErrors(prev => ({
                    ...prev,
                    username: "이미 사용 중인 아이디입니다."
                }));
                setUsernameMessage('');
                setIsUsernameAvailable(false);
                setIsUsernameDuplicateChecked(true);
                setInputBorderColor('#F00');
            } else {
                setErrors(prev => ({
                    ...prev,
                    username: ""
                }));
                setUsernameMessage("사용할 수 있는 아이디입니다.");
                setIsUsernameAvailable(true);
                setIsUsernameDuplicateChecked(true);
                setInputBorderColor('#2C8FFF');
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                username: "중복확인 중 오류가 발생했습니다."
            }));
            setUsernameMessage('');
            setIsUsernameDuplicateChecked(false);
            setInputBorderColor('#F00');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "username") {
            // 원본 입력값 임시 저장 (UI 표시용)
            setTempUsernameInput(value);

            // 한글 체크
            const hasKorean = /[가-힣]/.test(value);
            setUsernameHasKorean(hasKorean);

            if (hasKorean) {
                // 한글 입력 시: 에러 표시 + 실제 username은 비움
                setErrors(prev => ({
                    ...prev,
                    username: '한글은 사용할 수 없습니다. 영문과 숫자만 입력해주세요'
                }));
                setInputBorderColor('#F00');
                setUsernameMessage('');
                setFormData(prev => ({ ...prev, username: '' }));
                setIsUsernameDuplicateChecked(false);
                setIsUsernameAvailable(false);
            } else {
                // 영문/숫자만 허용
                const onlyEnglishNumber = value.replace(/[^a-zA-Z0-9]/g, "");
                const trimmed = onlyEnglishNumber.slice(0, 12);

                setFormData(prev => ({ ...prev, username: trimmed }));
                setErrors(prev => ({ ...prev, username: "" }));
                setUsernameMessage('');
                setInputBorderColor('');
                setIsUsernameDuplicateChecked(false);
                setIsUsernameAvailable(false);
            }
        }

        else if (name === "password") {
            const trimmed = value.slice(0, 16);
            setFormData(prev => ({ ...prev, password: trimmed }));
        }
        else if (name === "passwordConfirm") {
            const trimmed = value.slice(0, 16);
            setFormData(prev => ({ ...prev, passwordConfirm: trimmed }));
        }
    };

    // 기존회원 완전 회원가입 API
    const handleCompleteExistingSignup = async () => {
        if (!verifiedUserId) {
            setMessage("1단계 인증 정보가 없습니다. 다시 시작해주세요.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                userId: verifiedUserId,
                username: formData.username.trim(),
                password: formData.password,
                passwordConfirm: formData.passwordConfirm
            };

            const response = await authAPI.completeExistingSignup(payload);

            setMessage(response.data.message || "회원가입 요청이 완료되었습니다.");

            const attendanceNumber = response.data.attendanceNumber || '';
            localStorage.removeItem('verifiedUserId');
            signupcomplete(formData.username, attendanceNumber);

        } catch (error) {

            let errorMessage = '회원가입 중 오류가 발생했습니다.';

            if (error.response) {
                // 서버 응답 에러
                const status = error.response.status;
                const data = error.response.data;

                if (status === 400) errorMessage = '입력 정보를 확인해주세요.';
                else if (status === 409) errorMessage = '이미 사용 중인 정보입니다.';
                else if (data?.message) errorMessage = data.message;
                else if (data?.error) errorMessage = data.error;
                else if (typeof data === 'string') errorMessage = data;
                else errorMessage = `서버 오류 (${status})`;
            } else if (error.request) {
                // 네트워크 에러
                errorMessage = '네트워크 연결을 확인해주세요.';
            } else {
                // 기타 에러
                errorMessage = error.message || '알 수 없는 오류가 발생했습니다.';
            }

            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSignupClick = async (e) => {
        e.preventDefault();

        if (!verifiedUserId) {
            setMessage("1단계 인증 정보가 없습니다. 다시 시작해주세요.");
            return;
        }

        if (!isUsernameDuplicateChecked || !isUsernameAvailable) {
            setShowDuplicateModal(true);
            return;
        }

        const checks = {
            verifiedUserId: !!verifiedUserId,
            allFilled: isAllFilled,
            usernameValid: isUsernameValid,
            passwordValid: isPasswordValid,
            passwordMatch: isPasswordMatch,
            usernameChecked: isUsernameDuplicateChecked,
            usernameAvailable: isUsernameAvailable
        };

        const hasAnyError = Object.values(checks).some(v => !v);
        if (hasAnyError) {
            setShowValidationModal(true);
            return;
        }

        await handleCompleteExistingSignup();
    };

    return (
        <div className="media-ct term-all-scroll-ct">
            <Header />
            <SignupTermDesktop step={2} />
            <div className="ls-ct">

                {/* 데스크톱 */}
                {!isMobile && (
                    <form className="ls-info-ct">
                        <article className="ls-id-ct">
                            <label className="ls-id"> 아이디</label>
                            <div className="id-duplication-ct">
                                <input
                                    type="text"
                                    name="username"
                                    value={tempUsernameInput || formData.username}
                                    onChange={handleChange}
                                    className={`ls-input ${errors.username || usernameHasKorean ? "ls-input-error" : ""}`}
                                    style={{ borderColor: inputBorderColor }}
                                    placeholder="아이디 입력"
                                    maxLength={12}
                                    autoComplete="username"
                                    pattern="[a-zA-Z0-9]"
                                />
                                <button
                                    className="duplication-btn"
                                    type="button"
                                    onClick={handleDuplicateCheck}
                                > 중복확인 </button>
                            </div>
                            <p className={`ls-id-sub
    ${(errors.username || usernameHasKorean) ? "ls-error-text" : ""} 
    ${usernameMessage ? "ls-complete-text" : ""}
`}>
                                {usernameHasKorean
                                    ? '한글은 사용할 수 없습니다. 영문과 숫자만 입력해주세요'
                                    : errors.username || usernameMessage || "4~12자 영문, 숫자로 입력해주세요."
                                }
                            </p>
                        </article>

                        <article className="ls-psw-ct">
                            <label className="ls-psw"> 비밀번호 </label>
                            <div className={`pw-input-wrap ${passwordStatus === 'invalid' ? "ls-password-error-ct" : ""}`}
                                style={passwordStatus === 'invalid' ? { borderColor: '#FF0000' } : {}}>
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    name="password"
                                    className={`ls-input ${passwordStatus === 'invalid' ? "ls-input-error" : ""}`}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="비밀번호 입력"
                                    maxLength={16}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="pw-icon-btn"
                                    onClick={() => setPasswordVisible(v => !v)}
                                >
                                    {passwordVisible ? (
                                        <img src={ShowPaswword} alt="비밀번호 숨기기" />
                                    ) : (
                                        <img src={Inputuneye} alt="비밀번호 보이기" />
                                    )}
                                </button>
                            </div>

                            <p className={`ls-psw-sub ${passwordStatus === 'valid' ? "ls-complete-text" :
                                passwordStatus === 'invalid' ? "ls-error-text" : ""}`}>
                                {passwordStatus === 'valid'
                                    ? "사용 가능한 비밀번호입니다"
                                    : passwordStatus === 'invalid'
                                        ? errors.password || "영문, 숫자를 포함해 8~16자로 입력해 주세요"
                                        : "영문, 숫자를 포함해 8~16자로 입력해 주세요"}
                            </p>
                        </article>

                        <article className="ls-psw-check-ct">
                            <label className="ls-psw-check"> 비밀번호 재확인</label>
                            <div className={`pw-input-wrap ${passwordConfirmStatus === 'mismatch' ? "ls-password-error-ct" : ""}`}
                                style={passwordConfirmStatus === 'mismatch' ? { borderColor: '#FF0000' } : {}}>
                                <input
                                    type={passwordConfirmVisible ? 'text' : 'password'}
                                    name="passwordConfirm"
                                    className={`ls-input ${passwordConfirmStatus === 'mismatch' ? "ls-input-error" : ""}`}
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    placeholder="비밀번호를 재입력"
                                    maxLength={16}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="pw-icon-btn"
                                    onClick={() => setPasswordConfirmVisible(v => !v)}
                                >
                                    {passwordConfirmVisible ? (
                                        <img src={ShowPaswword} alt="비밀번호 숨기기" />
                                    ) : (
                                        <img src={Inputuneye} alt="비밀번호 보이기" />
                                    )}
                                </button>
                            </div>
                            <p className={`ls-psw-sub ${passwordConfirmStatus === 'match' ? "ls-complete-text ls-psw-sub" :
                                passwordConfirmStatus === 'mismatch' ? "ls-error-text" : ""}`}>
                                {passwordConfirmStatus === 'match'
                                    ? "비밀번호가 일치합니다"
                                    : passwordConfirmStatus === 'mismatch'
                                        ? "비밀번호가 일치하지 않습니다"
                                        : "영문, 숫자를 포함해 8~16자로 입력해 주세요"}
                            </p>
                        </article>

                        <div className="ls-btn-ct">
                            <button className="ls-back-btn"
                                onClick={movesignup}> 이전 </button>

                            <button
                                className={`ls-sign-btn ${isFormValid ? "ls-sign-btn-active" : ""}`}
                                type="button"
                                onClick={handleSignupClick}
                                disabled={loading}
                            >
                                {loading ? "가입 중..." : "가입하기"}
                            </button>
                        </div>
                    </form>
                )}

                {/* 모바일 Step 2 */}
                {isMobile && (
                    <form className="ls-info-ct term-all-scroll-ct">
                        <SignupTop2 step={2} leftBackTo='/existingsignup' rightBackTo='/' />

                        <article className="ls-id-ct">
                            <label className="ls-id"> 아이디</label>
                            <div className="id-duplication-ct">
                                <input
                                    type="text"
                                    name="username"
                                    value={tempUsernameInput || formData.username}
                                    onChange={handleChange}
                                    className={`ls-input ${errors.username || usernameHasKorean ? "ls-input-error" : ""}`}
                                    style={{ borderColor: inputBorderColor }}
                                    placeholder="아이디를 입력"
                                    maxLength={12}
                                    autoComplete="username"
                                    pattern="[a-zA-Z0-9]"
                                />
                                <button
                                    type="button"
                                    className="duplication-btn"
                                    onClick={handleDuplicateCheck}
                                >
                                    중복확인
                                </button>
                            </div>
                            <p className={`ls-id-sub
    ${(errors.username || usernameHasKorean) ? "ls-error-text" : ""} 
    ${usernameMessage ? "ls-complete-text" : ""}
`}>
                                {usernameHasKorean
                                    ? '한글은 사용할 수 없습니다. 영문과 숫자만 입력해주세요'
                                    : errors.username || usernameMessage || "영문을 포함해 4~12자로 입력해 주세요"
                                }
                            </p>
                        </article>

                        <article className="ls-psw-ct">
                            <label className="ls-psw"> 비밀번호 </label>
                            <div className={`pw-input-wrap ${passwordStatus === 'invalid' ? "ls-password-error-ct" : ""}`}
                                style={passwordStatus === 'invalid' ? { borderColor: '#FF0000' } : {}}>
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    name="password"
                                    className={`ls-input ${passwordStatus === 'invalid' ? "ls-input-error" : ""}`}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="비밀번호를 입력"
                                    maxLength={16}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="pw-icon-btn"
                                    onClick={() => setPasswordVisible(v => !v)}
                                >
                                    {passwordVisible ? (
                                        <img src={ShowPaswword} alt="비밀번호 숨기기" />
                                    ) : (
                                        <img src={Inputuneye} alt="비밀번호 보이기" />
                                    )}
                                </button>
                            </div>

                            <p className={`ls-psw-sub ${passwordStatus === 'valid' ? "ls-complete-text " :
                                passwordStatus === 'invalid' ? "ls-error-text" : ""}`}>
                                {passwordStatus === 'valid'
                                    ? "사용 가능한 비밀번호입니다"
                                    : passwordStatus === 'invalid'
                                        ? errors.password || "영문, 숫자를 포함해 8~16자로 입력해 주세요"
                                        : "영문, 숫자를 포함해 8~16자로 입력해 주세요"}
                            </p>
                        </article>

                        <article className="ls-psw-check-ct">
                            <label className="ls-psw-check"> 비밀번호 재확인</label>
                            <div className={`pw-input-wrap ${passwordConfirmStatus === 'mismatch' ? "ls-password-error-ct" : ""}`}
                                style={passwordConfirmStatus === 'mismatch' ? { borderColor: '#FF0000' } : {}}>
                                <input
                                    type={passwordConfirmVisible ? 'text' : 'password'}
                                    name="passwordConfirm"
                                    className={`ls-input ${passwordConfirmStatus === 'mismatch' ? "ls-input-error" : ""}`}
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    placeholder="비밀번호를 재입력"
                                    maxLength={16}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="pw-icon-btn"
                                    onClick={() => setPasswordConfirmVisible(v => !v)}
                                >
                                    {passwordConfirmVisible ? (
                                        <img src={ShowPaswword} alt="비밀번호 숨기기" />
                                    ) : (
                                        <img src={Inputuneye} alt="비밀번호 보이기" />
                                    )}
                                </button>
                            </div>

                            <p className={`ls-psw-sub ${passwordConfirmStatus === 'match' ? "ls-complete-text ls-psw-sub" :
                                passwordConfirmStatus === 'mismatch' ? "ls-error-text" : ""}`}>
                                {passwordConfirmStatus === 'match'
                                    ? "비밀번호가 일치합니다"
                                    : passwordConfirmStatus === 'mismatch'
                                        ? "비밀번호가 일치하지 않습니다"
                                        : "영문, 숫자를 포함해 8~16자로 입력해 주세요"}
                            </p>
                        </article>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                            <button
                                type="button"
                                className="ls-sign-btn"
                                onClick={() => movesignup()}
                            >
                                이전
                            </button>
                            <button
                                className={`ls-sign-btn ${isFormValid ? "ls-sign-btn-active" : ""}`}
                                type="button"
                                onClick={handleSignupClick}
                                disabled={loading}
                            >
                                {loading ? "가입 중..." : "가입하기"}
                            </button>
                        </div>
                    </form>
                )}
                {message && (
                    <div className={`message ${loading ? 'loading' : ''}`}>
                        {message}
                    </div>
                )}

                {showValidationModal && (
                    <Modal text={"입력하신 정보를 다시 확인해주세요."} event={() => {
                        setShowValidationModal(false);
                    }} />
                )}

                {showDuplicateModal && (
                    <Modal text={"아이디 중복확인을 먼저 진행해주세요."} event={() => {
                        setShowDuplicateModal(false);
                    }} />
                )}
            </div>
        </div>
    );
}
