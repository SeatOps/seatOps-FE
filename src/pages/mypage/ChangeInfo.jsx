import Header from "../../components/common/Header"
import changeI from "../../css/mypage/ChangeInfo.module.css";
import { useEffect, useState } from "react";
import { authAPI } from '../../components/common/apiClient';
import Modal from "../../components/common/Modal";
import Navigation from "../../components/common/Navigate";
import scroll from "../../css/common/scroll.module.css"
import InputModal from "../../components/mypage/InputModal";

// 아이콘 및 CSS 추가
import ShowPaswword from '../../img/inputeye.svg';
import Inputuneye from '../../img/inputuneye.svg';
import '../../css/auth/LocalSignUp.css';

function ChangeInfo() {
    const { movemypage } = Navigation();
    const [isModal, setIsModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [checkPass, setCheckPass] = useState(false);
    const [myInfo, setMyInfo] = useState({})
    const [onModal, setOnModal] = useState(false)
    const [onPassModal, setOnPassModal] = useState(false);

    const [phone, setPhone] = useState("");
    const [parentPhoneError, setParentPhoneError] = useState('');

    const [change, setChange] = useState(false);

    const [nickname, setNickname] = useState("");
    const [nicknameError, setNicknameError] = useState(false);

    const [attendance, setAttendance] = useState("");
    const [attendanceError, setAttendanceError] = useState('');

    const [newPass, setNewPass] = useState("");
    const [cNewPass, setCNewPass] = useState("");

    const [error, setError] = useState(false);
    const [passwordError, setPasswordError] = useState(false)

    // ✅ 가시성 상태 관리 (현재/새비밀번호/확인)
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

    // ✅ 비밀번호 유효성 검사 로직 (영문+숫자 혼합 및 8~16자)
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

    const clickModi = () => {
        setIsModal(true)
    }

    // 내 정보 조회
    useEffect(() => {
        const fetchMyInfo = async () => {
            try {
                const response = await authAPI.getMyInfo();
                setMyInfo(response.data);
                const data = response.data;
                setNickname(data.nickname || "");
                setAttendance(data.attendanceNumber || "");
                setPhone(data.parentPhoneNumber || "");
            } catch (err) {
                console.error("내 정보 조회 실패:", err);
            }
        }
        fetchMyInfo();
    }, [checkPass]);

    // 전화번호 실시간 유효성 체크
    useEffect(() => {
        if (!phone.trim()) {
            setParentPhoneError('');
            return;
        }
        const dashCount = (phone.match(/-/g) || []).length;
        if (dashCount !== 2 || phone.length !== 13 || !/^\d+-\d+-\d+$/.test(phone)) {
            setParentPhoneError("'-'를 포함해서 입력해 주세요. (예: 010-1234-5678)");
        } else {
            setParentPhoneError('');
        }
    }, [phone]);

    const handleNameChange = (e) => {
        setChange(true);
        setNickname(e.target.value);
        setNicknameError(e.target.value.length === 0);
    };

    const handlePhoneChange = (e) => {
        setChange(true);
        const onlyNumberAndDash = e.target.value.replace(/[^0-9-]/g, "");
        setPhone(onlyNumberAndDash.slice(0, 13));
    };

    const handleAttendanceChange = (e) => {
        setChange(true);
        const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
        const trimmed = onlyNumber.slice(0, 4);
        setAttendance(trimmed);
        setAttendanceError(trimmed.length < 4 ? '4자리 숫자를 입력해주세요.' : '');
    };

    const handleVerifyPassword = async () => {
        if (!currentPassword) return;
        try {
            await authAPI.checkPassword({ password: currentPassword });
            setCurrentPassword("");
            setError(false);
            setIsModal(false);
            setCheckPass(true);
        } catch (err) {

            setError(true);
            console.log(error)

        }
    };

    const handleUpdateInfo = async () => {
        if (!phone || !attendance || !nickname) { setOnPassModal(true); return; }
        if (parentPhoneError || attendanceError || nicknameError) return;
        if (newPass && (!isPasswordValid || !isPasswordMatch)) return;

        const requestData = {
            username: myInfo.username,
            nickname: nickname,
            attendanceNumber: attendance,
            parentPhoneNumber: phone,
        };

        try {
            if (newPass) {
                requestData.password = newPass;
                requestData.passwordConfirm = cNewPass;
                await authAPI.changePassword(requestData);
            }
            await authAPI.changeInfo(requestData);
            setOnModal(true);
        } catch (err) {
            const msg = err.response?.data?.message;
            if (msg === "이미 사용 중인 비밀번호입니다.") {
                setPasswordError(true);
                setNewPass(""); setCNewPass("");
            } else if (msg?.includes("출결번호")) {
                setAttendanceError(msg);
            }
        }
    };

    const canSubmit = (!parentPhoneError && !attendanceError && !nicknameError && phone && attendance && nickname && change) ||
        (newPass && isPasswordValid && isPasswordMatch);

    return (
        <div className={scroll.scroll}>
            <div className={scroll.scroll_section}>
                <Header />
                <section className={scroll.turn_display}>
                    <p>계속하시려면<br />화면을 가로로 돌려주세요.</p>
                    <div></div>
                </section>
                <section>
                    <section className={changeI.infos}>
                        <p>내 정보 수정</p>
                        {checkPass ? (
                            <form className={changeI.infos_form_white}>
                                <div><label>회원 아이디</label><input className={changeI.info_form_input} type="text" value={myInfo.username || ""} readOnly /></div>
                                <div>
                                    <label>이름</label>
                                    <div>
                                        <input type='text' placeholder='변경 이름 입력' value={nickname} onChange={handleNameChange} className={`${changeI.info_form_input} ${nicknameError ? changeI.error_input : ""}`} />
                                        <p className={nicknameError ? changeI.error_p : ""}>이름을 입력해주세요.</p>
                                    </div>
                                </div>
                                <div>
                                    <label>출결번호</label>
                                    <div>
                                        <input type='text' placeholder='변경 출결번호 입력' value={attendance} onChange={handleAttendanceChange} className={`${changeI.info_form_input} ${attendanceError ? changeI.error_input : ""}`} />
                                        <p className={attendanceError ? changeI.error_p : ""}>{attendanceError || "4자리 숫자를 입력해주세요."}</p>
                                    </div>
                                </div>
                                <div>
                                    <label>학부모 전화번호</label>
                                    <div>
                                        <input type='text' placeholder='변경 전화번호 입력 (010-1234-5678)' value={phone} onChange={handlePhoneChange} className={`${changeI.info_form_input} ${parentPhoneError ? changeI.error_input : ""}`} />
                                        <p className={parentPhoneError ? changeI.error_p : ""}>{parentPhoneError || "'-'를 포함해서 입력해 주세요."}</p>
                                    </div>
                                </div>
                                <div>
                                    <label>새 비밀번호</label>
                                    <div>
                                        <div className={`${changeI.togle_input_div} ${passwordError || passwordHasError ? changeI.error_input : ""}`} style={{ position: 'relative' }}>
                                            <input type={passwordVisible ? 'text' : 'password'} placeholder='새 비밀번호 입력' value={newPass} onChange={(e) => { setNewPass(e.target.value); setChange(true); }} onClick={() => setPasswordError(false)} maxLength={16} />
                                            <button type="button" className="pw-icon-btn" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none' }} onClick={() => setPasswordVisible(v => !v)}>
                                                <img src={passwordVisible ? ShowPaswword : Inputuneye} alt="toggle" />
                                            </button>
                                        </div>
                                        {passwordError && <p className={changeI.error_p}>이미 사용 중인 비밀번호입니다.</p>}
                                        {!passwordError && passwordHasError && <p className={changeI.error_p}>영문, 숫자를 포함해 8~16자로 입력해 주세요.</p>}
                                    </div>
                                </div>
                                <div>
                                    <label>새 비밀번호 재확인</label>
                                    <div>
                                        <div className={`${changeI.togle_input_div} ${passwordMatchError ? changeI.error_input : ""}`} style={{ position: 'relative' }}>
                                            <input type={passwordConfirmVisible ? 'text' : 'password'} placeholder='새 비밀번호 재입력' value={cNewPass} onChange={(e) => { setCNewPass(e.target.value); setChange(true); }} maxLength={16} />
                                            <button type="button" className="pw-icon-btn" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none' }} onClick={() => setPasswordConfirmVisible(v => !v)}>
                                                <img src={passwordConfirmVisible ? ShowPaswword : Inputuneye} alt="toggle" />
                                            </button>
                                        </div>
                                        {passwordMatchError && <p className={changeI.error_p}>비밀번호가 일치하지 않습니다.</p>}
                                    </div>
                                </div>

                            </form>
                        ) : (
                            <form className={changeI.infos_form}>
                                <div>
                                    <label>회원 아이디</label><input className={changeI.info_form_input} type="text" value={myInfo.username || ""} readOnly />
                                </div>
                                <div>
                                    <label>이름</label><input className={changeI.info_form_input} type="text" value={myInfo.nickname || ""} readOnly />
                                </div>
                                <div>
                                    <label>출결번호</label><input className={changeI.info_form_input} type="text" value={myInfo.attendanceNumber || ""} readOnly />
                                </div>
                                <div>
                                    <label>학부모 전화번호</label><input className={changeI.info_form_input} type="text" value={myInfo.parentPhoneNumber || ""} readOnly />
                                </div>
                                <div>
                                    <label>비밀번호</label><input className={changeI.info_form_input} type="password" value='password' readOnly />
                                </div>
                            </form>
                        )}
                    </section>
                    <section className={changeI.button_ct}>
                        <button onClick={() => { if (checkPass) { setCheckPass(false); setNewPass(""); setCNewPass(""); setAttendanceError(""); setNicknameError("") } else movemypage(); }}>이전</button>
                        {checkPass ? <button className={canSubmit ? changeI.activeBtn : ""} onClick={handleUpdateInfo}>변경하기</button> : <button onClick={clickModi}>회원정보 수정</button>}
                    </section>
                    <div className={changeI.modal}>
                        {isModal && (
                            <InputModal
                                currentPassword={currentPassword}
                                setCurrentPassword={setCurrentPassword}
                                error={error}
                                btn1E={() => { setIsModal(false); setCurrentPassword(""); setError(false) }}
                                btn2E={handleVerifyPassword}
                            />
                        )}
                    </div>




                    {onModal && <Modal text='변경이 완료되었습니다.' event={() => { setOnModal(false); setCheckPass(false); }} />}
                    {onPassModal && <Modal text='모든 값을 입력해주세요.' event={() => setOnPassModal(false)} />}
                </section>
            </div>
        </div>
    )
}

export default ChangeInfo;