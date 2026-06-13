import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IdPswFindTop from "../../components/auth/IdPswFindTop";
import '../../css/auth/IdPswFind.css';
import Navigation from '../../components/common/Navigate';
import Header from '../../components/common/Header';
import IdPswFindDesktop from '../../components/auth/IdPswFindDesktop';
import { authAPI } from '../../components/common/apiClient';
import Modal from '../../components/common/Modal';
import CompleteCircle from '../../img/complete-round.svg';
import CompleteCheck from '../../img/complete-check.svg';

export default function PasswordFind() {
    const [isComplete, setIsComplete] = useState(false);
    const { pswreseting, loginpg } = Navigation();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: '',
        nickname: '',
        attendanceNumber: ''
    });

    const [loading, setLoading] = useState(false);

    // 개별 에러 상태들 
    const [usernameError, setUsernameError] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [attendanceError, setAttendanceError] = useState('');
    const [generalError, setGeneralError] = useState('');

    // 모달 상태
    const [errorModal, setErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // 출석번호 유효성: 4자리 숫자
    const isAttendanceValid = form.attendanceNumber.length === 4 && /^\d{4}$/.test(form.attendanceNumber);

    // 모든 필드 유효성 검사
    const isAllValid =
        form.username.trim() !== '' &&
        form.nickname.trim() !== '' &&
        isAttendanceValid;

    // 실시간 유효성 검사들
    useEffect(() => {
        const username = form.username.trim();
        if (!username) {
            setUsernameError('');
        } else if (username.length < 4 || username.length > 12) {
            setUsernameError('아이디는 4~12자로 입력해주세요.');
        } else {
            setUsernameError('');
        }
    }, [form.username]);

    useEffect(() => {
        const nickname = form.nickname.trim();
        if (!nickname) {
            setNicknameError('');
        } else if (nickname.length < 2) {
            setNicknameError('이름은 2글자 이상 입력해주세요.');
        } else {
            setNicknameError('');
        }
    }, [form.nickname]);

    useEffect(() => {
        const attendance = form.attendanceNumber.trim();
        if (!attendance) {
            setAttendanceError('');
        } else if (attendance.length !== 4 || !/^\d{4}$/.test(attendance)) {
            setAttendanceError('4자리 숫자를 입력해주세요');
        } else {
            setAttendanceError('');
        }
    }, [form.attendanceNumber]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "attendanceNumber") {
            const onlyNumber = value.replace(/[^0-9]/g, "");
            const trimmed = onlyNumber.slice(0, 4);
            setForm(prev => ({ ...prev, attendanceNumber: trimmed }));
        } else if (name === "username") {
            const trimmed = value.slice(0, 12);
            setForm(prev => ({ ...prev, username: trimmed }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    // 에러 모달 닫기
    const closeErrorModal = () => {
        setErrorModal(false);
        setErrorMessage('');
        setGeneralError('');
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        // 개별 에러 초기화
        setUsernameError('');
        setNicknameError('');
        setAttendanceError('');
        setGeneralError('');

        // 유효성 재검증
        if (!form.username.trim()) {
            setUsernameError('아이디를 입력해주세요.');
            return;
        }
        if (!form.nickname.trim() || form.nickname.trim().length < 2) {
            setNicknameError('이름을 2글자 이상 입력해주세요.');
            return;
        }
        if (!isAttendanceValid) {
            setAttendanceError('4자리 숫자를 입력해주세요');
            return;
        }

        if (loading) return;

        if (!authAPI || !authAPI.verifyResetPassword) {
            console.error('❌ [PasswordFind] authAPI.verifyResetPassword 없음');
            setErrorMessage('API 클라이언트 오류. 새로고침 후 재시도');
            setErrorModal(true);
            return;
        }

        try {
            setLoading(true);
            setErrorModal(false);
            setGeneralError('');

            const requestBody = {
                username: form.username.trim(),
                nickname: form.nickname.trim(),
                attendanceNumber: form.attendanceNumber.trim()
            };
            // 기존 authAPI 호출
            await authAPI.verifyResetPassword(requestBody);

            setIsComplete(true);
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                '입력하신 정보와 일치하는 계정을 찾을 수 없습니다. 정보를 다시 확인해주세요.';

            setGeneralError(msg);
            setErrorMessage(msg);
            setErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

// 재설정 버튼
    const handleResetPassword = () => {
        navigate('/pswreseting', {
            state: {
                username: form.username.trim(),
                nickname: form.nickname.trim(),
                attendanceNumber: form.attendanceNumber.trim(),
            },
        });
    };

    return (
        <div className="term-all-scroll-ct">
            <IdPswFindTop step={2} onBack={loginpg} />
            <Header />
            <IdPswFindDesktop step={2} />

            {/* 1단계: 정보 입력 폼 */}
            {!isComplete ? (
                <form className="pswfind-info-ct" onSubmit={handleVerify}>
                    <article className="ls-id-ct">
                        <label className="ls-id"> 아이디</label>
                        <input
                            type="text"
                            name="username"
                            className={`ls-input ${usernameError ? "ls-input-error" : ""}`}
                            placeholder="아이디 입력"
                            value={form.username}
                            onChange={handleChange}
                            autoComplete="username"
                            maxLength={12}
                        />
                        {usernameError && <p className="ls-error-text ls-id-sub">{usernameError}</p>}
                    </article>

                    <article className="ls-name-ct">
                        <label className="ls-name"> 이름</label>
                        <input
                            type="text"
                            name="nickname"
                            className={`ls-input ${nicknameError ? "ls-input-error" : ""}`}
                            placeholder="이름 입력"
                            value={form.nickname}
                            onChange={handleChange}
                            autoComplete="name"
                        />
                        {nicknameError && <p className="ls-error-text">{nicknameError}</p>}
                    </article>

                    <article className="ls-attendance-ct mobile-marign">
                        <label className="ls-attendance"> 출결번호</label>
                        <div className="id-duplication-ct">
                            <input
                                type="text"
                                name="attendanceNumber"
                                className={`pswfind-input-email ls-input ${attendanceError ? "ls-input-error ls-attendance-input" : ""}`}
                                placeholder="출결번호 입력"
                                value={form.attendanceNumber}
                                onChange={handleChange}
                                maxLength={4}
                                autoComplete="off"
                            />
                        </div>
                        <p className={`ls-attendance-sub ${attendanceError ? "ls-error-text" : ""}`}>
                            {attendanceError || "4자리 숫자를 입력해 주세요."}
                        </p>
                    </article>

                    <div className="idfind-btn-ct">
                        <button
                            className="idfind-back-btn"
                            type="button"
                            onClick={loginpg}
                        >
                            이전
                        </button>

                        <button
                            className={`idfind-btn ${isAllValid ? 'idfind-btn-active' : ''}`}
                            type="submit"
                            disabled={!isAllValid || loading}
                        >
                            {loading ? '조회 중...' : '비밀번호 찾기'}
                        </button>
                    </div>
                    <button
                        className={`idfind-btn2 ${isAllValid ? 'idfind-btn-active' : ''}`}
                        type="submit"
                        disabled={!isAllValid || loading}
                    >
                        {loading ? '조회 중...' : '비밀번호 찾기'}
                    </button>
                </form>
            ) : (
                <>
                    <section className="pswfind-complete">
                        <div className="complete-check-img-ct">
                            <img src={CompleteCircle} alt="" />
                            <img className="completecheck-img" src={CompleteCheck} alt="체크표시" />
                        </div>
                        <p className='psw-complete-pharse'> 인증완료 </p>
                        <p className='psw-complete-content-pharse'>
                            <span>비밀번호를 재설정</span>해주세요. <br />
                            아래 버튼을 클릭하면 재설정 페이지로 연결됩니다.
                        </p>
                    </section>
                    <div className='psw-resetting-btn-ct'>
                        <button
                            className="psw-resetting-btn"
                            onClick={handleResetPassword}
                        >
                            비밀번호 재설정하기
                        </button>
                    </div>
                </>
            )}

            {errorModal && (
                <Modal
                    text={errorMessage}
                    event={() => closeErrorModal()}
                />
            )}
        </div>
    );
}
