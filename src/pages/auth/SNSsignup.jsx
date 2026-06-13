import Header from "../../components/common/Header";
import { useState, useEffect } from "react";
import { authAPI } from "../../components/common/apiClient";
import '../../css/auth/LocalSignUp.css';
import '../../css/auth/LocalSignupModal.css';
import Navigation from "../../components/common/Navigate";
import SignuseMobile from "../../components/auth/SignuseMobile";
import SignupTop2 from "../../components/auth/SignupTop2";
import SignupTermDesktop from "../../components/auth/SignupTermDesktop";
import Modal from "../../components/common/Modal";

export default function SNSsignup() {
    const { signupcomplete } = Navigation();
    const isMobile = SignuseMobile();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [showValidationModal, setShowValidationModal] = useState(false);
    const [showIncompleteModal, setShowIncompleteModal] = useState(false);

    const [isStep1Valid, setIsStep1Valid] = useState(false);

    const [attendanceError, setAttendanceError] = useState('');
    const [parentPhoneError, setParentPhoneError] = useState('');

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        passwordConfirm: "",
        nickname: "",
        email: "",
        attendanceNumber: "",
        parentPhoneNumber: ""
    });

    // 이전 페이지에서 넘어온 email (?email=...) 세팅
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailFromPrev = params.get("email");
        const usernameFromPrev = params.get("nickname");

        setFormData(prev => ({
            ...prev,
            email: emailFromPrev || prev.email,
            nickname: usernameFromPrev || prev.nickname,   // username을 이름에 미리 채움
        }));
    }, []);

    // 필수 값 채움 여부 (이름/출결/전화번호만)
    const isAllFilled =
        formData.nickname.trim() !== "" &&
        formData.attendanceNumber.trim() !== "" &&
        formData.parentPhoneNumber.trim() !== "";

    const isAttendanceValid = formData.attendanceNumber.length === 4;
    const isParentPhoneValid =
        formData.parentPhoneNumber.length >= 10 &&
        (formData.parentPhoneNumber.match(/-/g) || []).length === 2 &&
        parentPhoneError === '';

    // 가입 버튼 활성 조건(전화번호/출결번호 관련 조건 유지)
    const isFormValid = isAllFilled &&
        isAttendanceValid &&
        isParentPhoneValid &&
        parentPhoneError === "" &&
        attendanceError === "";

    // 학부모 전화번호 형식 검증
    useEffect(() => {
        const phone = formData.parentPhoneNumber;
        if (!phone.trim()) {
            setParentPhoneError('');
            return;
        }
        const dashCount = (phone.match(/-/g) || []).length;
        if (dashCount === 2 && /^\d+-\d+-\d+$/.test(phone) && phone.length >= 10) {
            setParentPhoneError('');
        } else {
            setParentPhoneError("'-'를 포함해서 입력해 주세요. (예: 010-1234-5678)");
        }
    }, [formData.parentPhoneNumber]);

    // Step1 유효성 (이름/전화번호/출결번호)
    useEffect(() => {
        const step1Valid =
            formData.nickname.trim() !== "" &&
            formData.parentPhoneNumber.trim() !== "" &&
            formData.attendanceNumber.trim() !== "";
        setIsStep1Valid(step1Valid);
    }, [formData.nickname, formData.parentPhoneNumber, formData.attendanceNumber]);

    // 출결번호 중복 체크
    const handleAttendanceCheck = async () => {
        if (formData.attendanceNumber.length !== 4) {
            setAttendanceError("4자리 숫자를 입력해주세요.");
            return false;
        }

        try {
            const response = await authAPI.checkattendanceExists(formData.attendanceNumber);

            if (response.data === true) {
                setAttendanceError("이미 존재하는 출결번호입니다.");
                return false;
            } else {
                setAttendanceError("");
                return true;
            }
        } catch (error) {
            console.error("출결번호 중복확인 실패:", error);
            setAttendanceError("중복확인 중 오류가 발생했습니다.");
            return false;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "username") {
            const trimmed = value.slice(0, 12);
            setFormData(prev => ({ ...prev, username: trimmed }));
        }
        else if (name === "attendanceNumber") {
            const onlyNumber = value.replace(/[^0-9]/g, "");
            const trimmed = onlyNumber.slice(0, 4);
            setFormData(prev => ({ ...prev, attendanceNumber: trimmed }));
            setAttendanceError('');
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

        await handleAttendanceCheck();

        const checks = {
            allFilled: isAllFilled,
            attendanceValid: isAttendanceValid,
            phoneValid: isParentPhoneValid,
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

            // /api/user/socialSignup 으로 보낼 payload (3개만)
            const payload = {
                nickname: formData.nickname,
                attendanceNumber: formData.attendanceNumber,
                parentPhoneNumber: formData.parentPhoneNumber
            };

            await authAPI.socialSignup(payload); // socialSignup 호출

            setMessage("회원가입 성공!");

            setFormData({
                username: "",
                password: "",
                passwordConfirm: "",
                nickname: "",
                email: "",
                attendanceNumber: "",
                parentPhoneNumber: ""
            });
            setAttendanceError('');
            setParentPhoneError('');

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
            <div className="ls-ct ">

                {/* 데스크톱 */}
                {!isMobile && (
                    <form className="ls-info-ct">
                        <p className="sns-login-pharse"> *소셜로 가입한 계정은 개인정보를 입력할 필요가 없습니다 </p>
                        {/* 아이디는 단순 표시만 */}
                        <article className="ls-id-ct">
                            <label className="ls-id"> 아이디</label>
                            <p className="ls-input sns-id-singup">
                                {formData.nickname || "아이디 칸이 비워져있다면 카카오톡 오픈 채팅 SeatOps로 연락해주세요."}
                            </p>
                        </article>

                        {/* 비밀번호/재확인도 고정 표시만 */}
                        <article className="ls-psw-ct">
                            <label className="ls-psw"> 비밀번호 </label>
                            <p className="ls-input sns-psw-signup"> ****  </p>
                        </article>

                        <article className="ls-psw-check-ct">
                            <label className="ls-psw-check"> 비밀번호 재확인</label>
                            <p className="ls-input sns-psw-signup"> **** </p>
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

                        {/* 이전 페이지에서 받은 email 표시 */}
                        <article className="ls-email-ct">
                            <label className="ls-email"> 이메일</label>
                            <p className="ls-input sns-psw-signup">
                                {formData.email || "이메일이 뜨지 않으시면 카카오톡 오픈 채팅방 SeatOps로 문의해주세요"}
                            </p>
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
                                {parentPhoneError || "'-'를 포함해서 입력해 주세요. (예: 010-1234-5678)"}
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

                        <button
                            className={`ls-sign-btn ${isFormValid ? "ls-sign-btn-active" : ""}`}
                            type="button"
                            onClick={handleSignupClick}
                            disabled={loading}
                        >
                            {loading ? "가입 중..." : "가입하기"}
                        </button>

                        {message && <p className="message">{message}</p>}
                    </form>
                )}

                {/* 모바일 Step 1 */}
                {isMobile && step === 1 && (
                    <form className="ls-info-ct">
                        <SignupTop2 step={0} />

                        <p className="sns-login-pharse"> *소셜로 가입한 계정은 개인정보를 입력할 필요가 없습니다 </p>

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

                        {/* 모바일에서도 이메일 표시만 */}
                        <article className="ls-email-ct">
                            <label className="ls-email"> 이메일</label>
                            <p className="ls-input sns-psw-signup">
                                {formData.email || "오류발생"}
                            </p>
                            <p className="ls-number-sub"> 카카오톡 오픈 채팅 SeatOps로 연락주세요.</p>
                        </article>

                        <article className="ls-number-ct">
                            <label className="ls-number"> 학부모 전화번호</label>
                            <input
                                type="tel"
                                name="parentPhoneNumber"
                                value={formData.parentPhoneNumber}
                                onChange={handleChange}
                                className={`ls-input ${parentPhoneError ? "ls-input-error ls-attendance-input" : !formData.parentPhoneNumber.trim() ? "ls-input-inactive" : ""}`}
                                placeholder="전화번호 입력"
                                autoComplete="tel"
                            />
                            <p className={`ls-number-sub ${parentPhoneError ? "ls-error-text" : ""}`}>
                                {parentPhoneError || "'-'를 포함해서 입력해 주세요. (예: 010-1234-5678)"}
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

                        {message && <p className="message">{message}</p>}
                    </form>
                )}

                {/* 모달들 */}
                {showValidationModal && (

                    <Modal text="입력하신 정보를 다시 확인해주세요." event={() => {
                        setShowValidationModal(false)
                    }} />

                )}

                {showIncompleteModal && (

                    <Modal text="모든 정보를 입력해주세요." event={() => {
                        setShowIncompleteModal(false)
                    }} />

                )}
            </div>
        </div>
    );
}
