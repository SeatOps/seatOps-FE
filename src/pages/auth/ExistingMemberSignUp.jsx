import Header from "../../components/common/Header";
import { useState, useEffect } from "react";
import { authAPI } from "../../components/common/apiClient";
import '../../css/auth/LocalSignUp.css';
import '../../css/auth/LocalSignupModal.css';
import Navigation from "../../components/common/Navigate";
import SignuseMobile from "../../components/auth/SignuseMobile"
import SignupTop2 from "../../components/auth/SignupTop2";
import SignupTermDesktop from "../../components/auth/SignupTermDesktop";
import Modal from "../../components/common/Modal";

export default function ExistingMemberSignUp({ verifiedUserId: propVerifiedUserId } = {}) {
    const { existingsignup2, movesignup, loginpg } = Navigation();
    const isMobile = SignuseMobile();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [showValidationModal, setShowValidationModal] = useState(false);
    const [showIncompleteModal, setShowIncompleteModal] = useState(false);

    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); 
    const [verificationMessage, setVerificationMessage] = useState('');

    const [isStep1Valid, setIsStep1Valid] = useState(false);

    const [attendanceError, setAttendanceError] = useState('');
    const [parentPhoneError, setParentPhoneError] = useState('');
    const [nicknameError, setNicknameError] = useState('');

    const [verifiedUserId, setVerifiedUserId] = useState(null);

    const [formData, setFormData] = useState({
        nickname: "",
        attendanceNumber: "",
        parentPhoneNumber: ""
    });

    // 유효성 검사 (PC/Mobile 공통)
    const isNicknameValid = formData.nickname.trim().length >= 2;
    const isAttendanceValid = formData.attendanceNumber.length === 4 && /^\d{4}$/.test(formData.attendanceNumber);
    const isParentPhoneValid = formData.parentPhoneNumber.length === 13 &&
        (formData.parentPhoneNumber.match(/-/g) || []).length === 2 &&
        /^\d+-\d+-\d+$/.test(formData.parentPhoneNumber) &&
        parentPhoneError === '';

    // 버튼 활성화: 모든 유효성 검사 통과해야 함
    const isStep1FullyValid = isNicknameValid && isParentPhoneValid && isAttendanceValid;

    const isAllFilled =
        formData.nickname.trim() !== "" &&
        formData.attendanceNumber.trim() !== "" &&
        formData.parentPhoneNumber.trim() !== "";

    // 실시간 이름 유효성 검사
    useEffect(() => {
        const name = formData.nickname.trim();
        if (!name) {
            setNicknameError('');
        } else if (name.length < 2) {
            setNicknameError('이름은 2글자 이상 입력해주세요.');
        } else {
            setNicknameError('');
        }
    }, [formData.nickname]);

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

    // 출석번호 실시간 유효성 검사
    useEffect(() => {
        const attendance = formData.attendanceNumber.trim();
        if (!attendance) {
            setAttendanceError('');
        } else if (attendance.length !== 4 || !/^\d{4}$/.test(attendance)) {
            setAttendanceError('4자리 숫자를 입력해주세요.');
        } else {
            setAttendanceError('');
        }
    }, [formData.attendanceNumber]);

    // isStep1Valid를 완전한 유효성 검사로 변경
    useEffect(() => {
        setIsStep1Valid(isStep1FullyValid);
    }, [isNicknameValid, isParentPhoneValid, isAttendanceValid]);

    useEffect(() => {
        if (verifiedUserId) {
            localStorage.setItem('verifiedUserId', verifiedUserId.toString());
        }
    }, [verifiedUserId]);

    // 수정된 기존 회원 인증 API 호출 함수
    const handleVerifyExistingMember = async () => {
        setLoading(true);
        try {
            const response = await authAPI.verifyExistingMember({
                nickname: formData.nickname.trim(),
                parentPhoneNumber: formData.parentPhoneNumber.trim(),
                attendanceNumber: formData.attendanceNumber.trim()
            });

            const { userId, isVerified, isAlreadySignedUp, message } = response.data;
            setVerificationMessage(message); 

            if (isVerified && !isAlreadySignedUp && userId) {
                setVerifiedUserId(userId);
                setShowSuccessModal(true); // 성공 모달 표시
                return true;
            } else {
                setShowVerificationModal(true);
                return false;
            }
        } catch (error) {
            console.error('❌ 요청 실패:', error.response?.status);
            console.error('❌ 에러 상세:', error.response?.data);
            setVerificationMessage("인증 중 오류가 발생했습니다. 다시 시도해주세요.");
            setShowVerificationModal(true);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "attendanceNumber") {
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

        // 개별 에러 초기화
        setNicknameError('');
        setParentPhoneError('');
        setAttendanceError('');

        if (!isNicknameValid) {
            setNicknameError('이름을 2글자 이상 입력해주세요.');
            setShowValidationModal(true);
            return;
        }
        if (!isParentPhoneValid) {
            setShowValidationModal(true);
            return;
        }
        if (!isAttendanceValid) {
            setAttendanceError("4자리 숫자를 입력해주세요.");
            setShowValidationModal(true);
            return;
        }

        console.log('✅ 모든 유효성 검사 통과, 기존 회원 인증 시작!');
        await handleVerifyExistingMember();
    };

    // 성공 모달에서 확인 클릭 시 페이지 이동
    const handleSuccessModalConfirm = () => {
        existingsignup2({ verifiedUserId: verifiedUserId });
        setStep(2);
        setShowSuccessModal(false);
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
                        <article className="ls-name-ct">
                            <label className="ls-name"> 이름</label>
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                className={`ls-input ${nicknameError ? "ls-input-error" : ""}`}
                                placeholder="이름"
                                autoComplete="name"
                            />
                            {nicknameError && (
                                <p className="ls-error-text ls-number-sub">{nicknameError}</p>
                            )}
                        </article>

                        <article className="ls-number-ct">
                            <label className="ls-number"> 학부모 전화번호</label>
                            <input
                                type="text"
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
                                {attendanceError || "4자리 숫자를 입력해 주세요"}
                            </p>
                        </article>

                        <div className="ls-btn-ct">
                            <button className="ls-back-btn"
                                onClick={movesignup}> 이전 </button>

                            <button
                                className={`ls-sign-btn ${isStep1FullyValid ? "ls-sign-btn-active" : ""}`}
                                type="button"
                                onClick={handleNextClick}
                                disabled={!isStep1FullyValid || loading}
                            >
                                {loading ? "인증 중..." : "인증하기"}
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
                                className={`ls-input ${!isNicknameValid ? "ls-input-inactive" : ""} ${nicknameError ? "ls-input-error" : ""}`}
                                placeholder="이름 입력"
                                autoComplete="name"
                            />
                            {nicknameError && <p className="ls-error-text">{nicknameError}</p>}
                        </article>

                        <article className="ls-number-ct">
                            <label className="ls-number"> 학부모 전화번호</label>
                            <input
                                type="text"
                                name="parentPhoneNumber"
                                value={formData.parentPhoneNumber}
                                onChange={handleChange}
                                className={`ls-input ${!isParentPhoneValid ? "ls-input-inactive" : ""} ${parentPhoneError ? "ls-input-error ls-attendance-input" : ""}`}
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
                                    className={`ls-input ${!isAttendanceValid ? "ls-input-inactive" : ""} ${attendanceError ? "ls-input-error ls-attendance-input" : ""}`}
                                    placeholder="출결번호 입력"
                                    maxLength={4}
                                />
                            </div>
                            <p className={`ls-attendance-sub ${attendanceError ? "ls-error-text" : ""}`}>
                                {attendanceError || "4자리 숫자를 입력해 주세요"}
                            </p>
                        </article>

                        <button
                            className={`ls-sign-btn ${isStep1FullyValid ? "ls-sign-btn-active" : ""}`}
                            type="button"
                            onClick={handleNextClick}
                            disabled={!isStep1FullyValid || loading}
                        >
                            {loading ? "인증 중..." : "인증하기"}
                        </button>
                    </form>
                )}

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

                {showVerificationModal && (
                    <Modal text={verificationMessage} event={() => {
                        setShowVerificationModal(false);
                    }} />
                )}

                {showSuccessModal && (
                    < Modal text={"재학생 인증에 성공했습니다.\n  아이디와 비밀번호를 설정해주세요."} event={() => {
                        handleSuccessModalConfirm();
                    }} />
                )}

            </div>
        </div>
    );
}
