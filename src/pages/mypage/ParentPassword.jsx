import backBtn from '../../img/back-btn.svg';
import changeF from '../../css/mypage/ChangeForm.module.css';
import { authAPI } from '../../components/common/apiClient.jsx';
import { useState, useEffect } from 'react';
import Navigation from '../../components/common/Navigate.jsx';
import Modal from '../../components/common/Modal.jsx';
import scroll from '../../css/common/scroll.module.css'

// 로컬 회원가입에서 사용했던 CSS 임포트
import '../../css/auth/LocalSignUp.css';

// 아이콘 임포트 추가
import ShowPaswword from '../../img/inputeye.svg';
import Inputuneye from '../../img/inputuneye.svg';

function ParentPassword() {
    const { movemyinfo } = Navigation();

    const [currentPassword, setCurrentPassword] = useState("");
    const [checkPass, setCheckPass] = useState(false);
    const [change, setChange] = useState(false);

    // ✅ 현재 비밀번호 가시성 상태 추가
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);

    // 입력 데이터 상태
    const [nickname, setNickname] = useState("");
    const [phone, setPhone] = useState("");
    const [attendance, setAttendance] = useState("");

    // 에러 및 상태 메시지
    const [parentPhoneError, setParentPhoneError] = useState('');
    const [attendanceError, setAttendanceError] = useState('');
    const [nicknameError, setNicknameError] = useState('');

    const [onModal, setOnModal] = useState(false);
    const [error, setError] = useState(false); // 비밀번호 확인 에러
    const [myInfo, setMyInfo] = useState(null);
    const [allInput, setAllInput] = useState(true);

    useEffect(() => {
        const myInfoString = window.localStorage.getItem('myInfo');
        if (myInfoString) {
            const my = JSON.parse(myInfoString);
            setMyInfo(my);
            setNickname(my.nickname || "");
            setAttendance(my.attendanceNumber || "");
            setPhone(my.parentPhoneNumber || "");
        }
    }, []);

    // 학부모 전화번호 실시간 유효성 체크
    useEffect(() => {
        if (!phone.trim()) {
            setParentPhoneError('');
            return;
        }
        const dashCount = (phone.match(/-/g) || []).length;
        if (dashCount !== 2) {
            setParentPhoneError("'-'를 포함해서 입력해 주세요. (예: 010-1234-5678)");
            return;
        }
        if (phone.length !== 13 || !/^\d+-\d+-\d+$/.test(phone)) {
            setParentPhoneError("올바르지 않은 전화번호 형식입니다");
            return;
        }
        setParentPhoneError('');
    }, [phone]);

    const handlePhoneChange = (e) => {
        setChange(true);
        const value = e.target.value;
        const onlyNumberAndDash = value.replace(/[^0-9-]/g, "");
        const trimmed = onlyNumberAndDash.slice(0, 13);
        setPhone(trimmed);
    };

    const handleAttendanceChange = (e) => {
        setChange(true);
        const value = e.target.value.replace(/[^0-9]/g, "");
        const trimmed = value.slice(0, 4);
        setAttendance(trimmed);
        if (trimmed.length !== 4) {
            setAttendanceError("4자리 숫자를 입력해주세요.");
        } else {
            setAttendanceError('');
        }
    };

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

    const handleUpdateInfo = async () => {
        if (!phone || !attendance || !nickname) {
            setAllInput(false);
            return;
        }
        if (parentPhoneError || attendanceError) return;
        setAllInput(true);

        try {
            const requestData = {
                username: myInfo?.username,
                nickname: nickname,
                attendanceNumber: attendance,
                parentPhoneNumber: phone,
            };
            const response = await authAPI.changeInfo(requestData);
            if (response.status === 200) setOnModal(true);
        } catch (err) {
            if (err.response?.status === 400 && err.response.data.message.includes("출결번호")) {
                setAttendanceError(err.response.data.message);
            } else {
                alert("서버 오류가 발생했습니다.");
            }
        }
    };

    const isFormValid = !parentPhoneError && !attendanceError && phone && attendance && nickname && change;

    return (
        <div className={scroll.scroll}>
            <div className={scroll.scroll_section}>
                <header className={changeF.mypage_header}>
                    <div>
                        <button onClick={movemyinfo}><img src={backBtn} alt="back" /></button>
                        <p>내 정보 변경</p>
                    </div>
                </header>
                <section className={scroll.turn_display_app}>
                    <p>계속하시려면<br />화면을 세로로 돌려주세요.</p>
                    <div></div>
                </section>

                <section className={changeF.form_section}>
                    {checkPass ? (
                        <>
                            <label>변경할 이름</label>
                            <input
                                type='text'
                                placeholder='변경 이름 입력'
                                value={nickname}
                                onChange={(e) => {
                                    setNickname(e.target.value);
                                    setChange(true);
                                }}
                                className={`${changeF.form_input} ${nicknameError ? changeF.error_input : ""}`}
                            />

                            <label>변경할 전화번호</label>
                            <input
                                type='text'
                                placeholder='변경 전화번호 입력 (010-1234-5678)'
                                value={phone}
                                onChange={handlePhoneChange}
                                className={`${changeF.form_input} ${parentPhoneError ? changeF.error_input : ""}`}
                            />
                            <p className={parentPhoneError ? changeF.errorP : ""}>
                                {parentPhoneError || "'-'를 포함해서 입력해 주세요."}
                            </p>
                            <div></div>
                            <label>변경할 출결번호</label>
                            <input
                                type='text'
                                placeholder='변경 출결번호 입력'
                                value={attendance}
                                onChange={handleAttendanceChange}
                                className={`${changeF.form_input} ${attendanceError ? changeF.error_input : ""}`}
                            />
                            <p className={`${changeF.last_p} ${attendanceError ? changeF.error_p : ""}`}>
                                {attendanceError || "4자리 숫자를 입력해주세요."}
                            </p>

                            <button
                                onClick={handleUpdateInfo}
                                className={isFormValid ? changeF.activeBtn : ""}
                                disabled={!isFormValid}
                            >
                                변경하기
                            </button>
                        </>
                    ) : (
                        <>
                            <label>현재 비밀번호</label>
                            {/* ✅ CheckPassword 컴포넌트와 동일한 가시성 토글 구조 적용 */}
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
                                onClick={handleCheckPassword}
                                className={currentPassword ? changeF.activeBtn : ""}
                            >
                                비밀번호 확인
                            </button>
                        </>
                    )}

                    {!allInput && (
                        <p className={changeF.red}>모든 값을 입력해주세요.</p>
                    )}
                </section>

                {onModal && (
                    <Modal text="변경이 완료되었습니다." event={() => {
                        setOnModal(false);
                        movemyinfo();
                    }} />
                )}
            </div>
        </div>
    );
}

export default ParentPassword;