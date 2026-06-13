import Header from "../../components/common/Header.jsx";
import { useState, useEffect } from "react";
import { authAPI } from "../../components/common/apiClient.jsx";
import '../../css/auth/LocalSignUp.css';
import '../../css/auth/LocalSignupModal.css';
import Navigation from "../../components/common/Navigate.jsx";
import SignuseMobile from "../../components/auth/SignuseMobile.jsx"
import SignupTop2 from "../../components/auth/SignupTop2.jsx";
import SignupTermDesktop from "../../components/auth/SignupTermDesktop.jsx";
import ShowPaswword from '../../img/inputeye.svg';
import Inputuneye from '../../img/inputuneye.svg';
import SignupCheck from '../../img/signupcheck.svg';
import Modal from "../../components/common/Modal.jsx";

export default function SignUpNormal() {
    const { signupcomplete, movesignup, loginpg } = Navigation();
    const isMobile = SignuseMobile();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');



    const [isUsernameDuplicateChecked, setIsUsernameDuplicateChecked] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    const [inputBorderColor, setInputBorderColor] = useState('');

    const [isAttendanceDuplicateChecked, setIsAttendanceDuplicateChecked] = useState(false);
    const [isAttendanceAvailable, setIsAttendanceAvailable] = useState(false);

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

    // 비밀번호 상태 분리
    const [passwordStatus, setPasswordStatus] = useState(''); // 'valid' | 'invalid' | ''
    const [passwordConfirmStatus, setPasswordConfirmStatus] = useState(''); // 'match' | 'mismatch' | ''

    const [showValidationModal, setShowValidationModal] = useState(false);
    const [showIncompleteModal, setShowIncompleteModal] = useState(false);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);

    const [isStep1Valid, setIsStep1Valid] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState('');
    const [errors, setErrors] = useState({
        username: "",
        password: "",
        passwordConfirm: ""
    });

    const [attendanceError, setAttendanceError] = useState('');
    const [parentPhoneError, setParentPhoneError] = useState('');

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        passwordConfirm: "",
        nickname: "",
        attendanceNumber: "",
        parentPhoneNumber: ""
    });

    // 기존 상태들 아래에 추가
    const [tempUsernameInput, setTempUsernameInput] = useState('');
    const [usernameHasKorean, setUsernameHasKorean] = useState(false);


    // 검증 로직 수정
    const isUsernameValid = formData.username.length >= 4 && formData.username.length <= 12;
    const isPasswordValid = formData.password.length >= 8 && formData.password.length <= 16;
    const isPasswordMatch = formData.password === formData.passwordConfirm && formData.passwordConfirm.length > 0;
    const isAttendanceValid = formData.attendanceNumber.length === 4 && attendanceError === '';
    const isParentPhoneValid = formData.parentPhoneNumber.length === 13 &&
        (formData.parentPhoneNumber.match(/-/g) || []).length === 2 &&
        parentPhoneError === '';

    const isAllFilled =
        formData.username.trim() !== "" &&
        formData.password.trim() !== "" &&
        formData.passwordConfirm.trim() !== "" &&
        formData.nickname.trim() !== "" &&
        formData.attendanceNumber.trim() !== "" &&
        formData.parentPhoneNumber.trim() !== "";

    const isFormValid = isAllFilled &&
        isUsernameValid &&
        isPasswordValid &&
        isPasswordMatch &&
        isAttendanceValid &&
        isParentPhoneValid &&
        isUsernameDuplicateChecked &&
        isUsernameAvailable;

    const showPasswordError = passwordStatus === 'invalid' || passwordConfirmStatus === 'mismatch';

    useEffect(() => {
        const phone = formData.parentPhoneNumber.trim();

        if (!phone) {
            setParentPhoneError('');
            return;
        }

        // '-' 포함 여부 체크
        const dashCount = (phone.match(/-/g) || []).length;
        if (dashCount !== 2) {
            setParentPhoneError("'-'를 포함해서 입력해 주세요. (예: 010-1234-5678)");
            return;
        }

        // 13자리 + 올바른 형식 체크
        if (phone.length !== 13 || !/^\d+-\d+-\d+$/.test(phone)) {
            setParentPhoneError("올바르지 않은 전화번호 형식입니다");
            return;
        }

        // 모두 통과
        setParentPhoneError('');
    }, [formData.parentPhoneNumber]);

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
        const step1Valid =
            formData.nickname.trim() !== "" &&
            formData.parentPhoneNumber.trim() !== "" &&
            formData.attendanceNumber.trim() !== "";
        setIsStep1Valid(step1Valid);
    }, [formData.nickname, formData.parentPhoneNumber, formData.attendanceNumber]);

    const handleAttendanceCheck = async () => {
        if (formData.attendanceNumber.length !== 4) {
            setAttendanceError("4자리 숫자를 입력해주세요");
            setIsAttendanceAvailable(false);
            setIsAttendanceDuplicateChecked(false);
            return false;
        }

        try {
            const response = await authAPI.checkattendanceExists(formData.attendanceNumber);

            if (response.data === true) {
                setIsAttendanceAvailable(false);
                setIsAttendanceDuplicateChecked(true);
                setAttendanceError("이미 존재하는 출결번호입니다.");
                return false;
            } else {
                setIsAttendanceAvailable(true);
                setIsAttendanceDuplicateChecked(true);
                setAttendanceError("");
                return true;
            }
        } catch (error) {
            setAttendanceError("중복확인 중 오류가 발생했습니다.");
            setIsAttendanceDuplicateChecked(false);
            return false;
        }
    };

    // 아이디 한글 검증 useEffect
    useEffect(() => {
        // 한글 감지 먼저
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

        // 기존 길이 검증
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
                // 한글 시: 에러 표시 + 실제 데이터는 빈칸
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
                // 영문/숫자만: 정상 처리
                const onlyEnglishNumber = value.replace(/[^a-zA-Z0-9]/g, "");
                const trimmed = onlyEnglishNumber.slice(0, 12);

                setFormData(prev => ({ ...prev, username: trimmed }));
                setErrors(prev => ({ ...prev, username: '' }));
                setInputBorderColor('');
                setUsernameMessage('');
                setIsUsernameDuplicateChecked(false);
                setIsUsernameAvailable(false);
            }
        }
        // ...

        else if (name === "password") {
            const trimmed = value.slice(0, 16);
            setFormData(prev => ({ ...prev, password: trimmed }));
        }
        else if (name === "passwordConfirm") {
            const trimmed = value.slice(0, 16);
            setFormData(prev => ({ ...prev, passwordConfirm: trimmed }));
        }
        else if (name === "attendanceNumber") {
            const onlyNumber = value.replace(/[^0-9]/g, "");
            const trimmed = onlyNumber.slice(0, 4);
            setFormData(prev => ({ ...prev, attendanceNumber: trimmed }));

            if (trimmed.length !== 4) {
                setAttendanceError("4자리 숫자를 입력해주세요");
            } else {
                setAttendanceError('');
                setIsAttendanceDuplicateChecked(false);
                setIsAttendanceAvailable(false);
            }
        }
        else if (name === "parentPhoneNumber") {
            const onlyNumberAndDash = value.replace(/[^0-9-]/g, "");
            const trimmed = onlyNumberAndDash.slice(0, 13);
            setFormData(prev => ({
                ...prev,
                parentPhoneNumber: trimmed,
            }));
        }
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // 비밀번호에 영문 + 숫자가 최소 1자 이상씩 포함됐는지 체크
    const hasLetterAndNumber = (value) => {
        const hasLetter = /[A-Za-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        return hasLetter && hasNumber;
    };


    const handleNextClick = async (e) => {
        e.preventDefault();

        if (!isStep1Valid) {
            setShowIncompleteModal(true);
            return;
        }

        const attendanceCheckResult = await handleAttendanceCheck();

        const hasVisibleErrors = parentPhoneError || attendanceError;
        if (hasVisibleErrors || !attendanceCheckResult) {
            setShowValidationModal(true);
            return;
        }

        setStep(2);
    };

    const handleSignupClick = async (e) => {
        e.preventDefault();

        if (!isUsernameDuplicateChecked || !isUsernameAvailable) {
            setShowDuplicateModal(true);
            return;
        }

        await handleAttendanceCheck();

        const checks = {
            allFilled: isAllFilled,
            usernameValid: isUsernameValid,
            passwordValid: isPasswordValid,
            passwordMatch: isPasswordMatch,
            attendanceValid: isAttendanceValid,
            phoneValid: isParentPhoneValid,
            usernameChecked: isUsernameDuplicateChecked,
            usernameAvailable: isUsernameAvailable,
            noPhoneError: parentPhoneError === "",
            noAttendanceError: attendanceError === ""
        };

        const hasAnyError = Object.values(checks).some(v => !v);

        if (hasAnyError) {
            setShowValidationModal(true);
            return;
        }

        handleSignup(e);
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const payload = {
                username: formData.username,
                password: formData.password,
                passwordConfirm: formData.passwordConfirm,
                nickname: formData.nickname,
                attendanceNumber: formData.attendanceNumber,
                parentPhoneNumber: formData.parentPhoneNumber
            };

            await authAPI.signup(payload);
            setMessage("회원가입 성공!");

            setFormData({
                username: "", password: "", passwordConfirm: "",
                nickname: "", attendanceNumber: "", parentPhoneNumber: ""
            });
            setErrors({ username: "", passwordConfirm: "" });
            setUsernameMessage('');
            setInputBorderColor('');
            setAttendanceError('');
            setParentPhoneError('');
            setPasswordStatus('');
            setPasswordConfirmStatus('');

            if (isMobile) setStep(1);
            signupcomplete(payload.nickname, payload.attendanceNumber);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "회원가입 실패";
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const prevStep = (e) => {
        e.preventDefault();
        setStep(1);
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
                                    className={`ls-input ${errors.username ? "ls-input-error" : ""}`}
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
                                    : errors.username || usernameMessage || "영문을 포함해 4~12자로 입력해주세요"
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
                                        : "영문, 숫자를 포함해 8~16자로 입력해주세요"}
                            </p>
                        </article>


                        <article className="ls-name-ct">
                            <label className="ls-name"> 이름</label>
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                className="ls-input"
                                placeholder="이름"
                                autoComplete="name"
                            />
                        </article>

                        <article className="ls-number-ct">
                            <label className="ls-number"> 학부모 전화번호</label>
                            <input
                                type="tel"
                                name="parentPhoneNumber"
                                value={formData.parentPhoneNumber}
                                onChange={handleChange}
                                className={`ls-input ${parentPhoneError ? "ls-input-error ls-attendance-input" : ""}`}
                                placeholder="전화번호 입력"
                                autoComplete="tel"
                            />
                            <p className={`ls-number-sub ${parentPhoneError ? "ls-error-text" : ""}`}>
                                {parentPhoneError || "‘-’를 포함한 아버님 또는 어머님 번호 중 하나를 입력해 주세요 (예: 010-1234-5678)"}
                            </p>
                        </article>

                        <article className="ls-attendance-ct">
                            <label className="ls-attendance"> 출결번호</label>
                            <input
                                type="text"
                                name="attendanceNumber"
                                value={formData.attendanceNumber}
                                onChange={handleChange}
                                className={`ls-input ${attendanceError ? "ls-input-error ls-attendance-input" : ""}`}
                                placeholder="출결번호 입력"
                                maxLength={4}
                            />
                            <p className={`ls-attendance-sub ${attendanceError ? "ls-error-text" : ""}`}>
                                {attendanceError || "4자리 숫자를 입력해 주세요."}
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

                {/* 모바일 Step 1 */}
                {isMobile && step === 1 && (
                    <form className="ls-info-ct term-all-scroll-ct">
                        <SignupTop2 step={1} leftBackTo='/signup' rightBackTo='/' />

                        <article className="ls-name-ct">
                            <label className="ls-name"> 이름</label>
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                className={`ls-input ${!formData.nickname.trim() ? "ls-input-inactive" : ""}`}
                                placeholder="이름 입력"
                                autoComplete="name"
                            />
                        </article>

                        <article className="ls-number-ct">
                            <label className="ls-number"> 학부모 전화번호</label>
                            <input
                                type="text"
                                name="parentPhoneNumber"
                                value={formData.parentPhoneNumber}
                                onChange={handleChange}
                                className={`ls-input ${parentPhoneError ? "ls-input-error ls-attendance-input" : !formData.parentPhoneNumber.trim() ? "ls-input-inactive" : ""}`}
                                placeholder="전화번호 입력"
                                autoComplete="tel"
                            />
                            <p className={`ls-number-sub ${parentPhoneError ? "ls-error-text" : ""}`}>
                                {parentPhoneError || "‘-’를 포함한 아버님 또는 어머님 번호 중 하나를 입력해 주세요 (예: 010-1234-5678)"}
                            </p>
                        </article>

                        <article className="ls-attendance-ct">
                            <label className="ls-attendance"> 출결번호</label>
                            <div className="id-duplication-ct">
                                <input
                                    type="text"
                                    name="attendanceNumber"
                                    value={formData.attendanceNumber}
                                    onChange={handleChange}
                                    className={`ls-input ${attendanceError ? "ls-input-error ls-attendance-input" : !formData.attendanceNumber.trim() ? "ls-input-inactive" : ""}`}
                                    placeholder="출결번호 입력"
                                    maxLength={4}
                                />
                            </div>
                            <p className={`ls-attendance-sub ${attendanceError ? "ls-error-text" : ""}`}>
                                {attendanceError || "4자리 숫자를 입력해 주세요."}
                            </p>
                        </article>

                        <button
                            className={`ls-sign-btn ${isStep1Valid ? "ls-sign-btn-active" : ""}`}
                            type="button"
                            onClick={handleNextClick}
                            disabled={loading}
                        >
                            {loading ? "확인 중..." : "다음"}
                        </button>
                    </form>
                )}

                {/* 모바일 Step 2 */}
                {isMobile && step === 2 && (
                    <form className="ls-info-ct term-all-scroll-ct">
                        <SignupTop2 step={2} leftBackTo='/signup' rightBackTo='/' />

                        <article className="ls-id-ct">
                            <label className="ls-id"> 아이디</label>
                            <div className="id-duplication-ct">
                                <input
                                    type="text"
                                    name="username"
                                    value={tempUsernameInput || formData.username}
                                    onChange={handleChange}
                                    className={`ls-input ${errors.username ? "ls-input-error" : ""}`}
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
                                    : errors.username || usernameMessage || "영문을 포함해 4~12자로 입력해주세요"
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
                            {formData.password.length >= 0 && (
                                <p className={`ls-psw-sub ${passwordStatus === 'valid' ? "ls-complete-text " :
                                    passwordStatus === 'invalid' ? "ls-error-text" : ""}`}>
                                    {passwordStatus === 'valid'
                                        ? "사용 가능한 비밀번호입니다"
                                        : passwordStatus === 'invalid'
                                            ? errors.password || "영문, 숫자를 포함해 8~16자로 입력해 주세요"
                                            : "영문, 숫자를 포함해 8~16자로 입력해 주세요"}
                                </p>
                            )}
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
                            {formData.passwordConfirm.length >= 0 && (
                                <p className={`ls-psw-sub ${passwordConfirmStatus === 'match' ? "ls-complete-text ls-psw-sub" :
                                    passwordConfirmStatus === 'mismatch' ? "ls-error-text" : ""}`}>
                                    {passwordConfirmStatus === 'match'
                                        ? "비밀번호가 일치합니다"
                                        : passwordConfirmStatus === 'mismatch'
                                            ? "비밀번호가 일치하지 않습니다"
                                            : "영문, 숫자를 포함해 8~16자로 입력해주세요"}
                                </p>
                            )}
                        </article>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                            <button
                                type="button"
                                className="ls-sign-btn"
                                onClick={prevStep}
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
                {/* {message && <p className="message">{message}</p>} */}

                {/* 모달들 */}
                {showValidationModal && (

                    <Modal text={"입력하신 정보를 다시 확인해주세요."} event={() => {
                        setShowValidationModal(false)
                    }} />
                )}

                {showIncompleteModal && (
                    <Modal text={"모든 정보를 입력해주세요."} event={() => {
                        setShowIncompleteModal(false)
                    }} />
                )}

                {showDuplicateModal && (
                    <Modal text={"아이디 중복확인을 먼저 진행해주세요."} event={() => {
                        setShowDuplicateModal(false)
                    }} />
                )}
            </div>
        </div>
    );
}
