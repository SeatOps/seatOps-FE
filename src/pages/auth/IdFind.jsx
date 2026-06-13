// IdFind.jsx (완전 수정 버전: string attendanceNumber + 안전한 authAPI 호출)
import IdPswFindTop from "../../components/auth/IdPswFindTop.jsx";
import Navigation from "../../components/common/Navigate.jsx";
import '../../css/auth/IdPswFind.css';
import { useState, useEffect } from "react";
import Header from '../../components/common/Header.jsx';
import IdPswFindDesktop from "../../components/auth/IdPswFindDesktop.jsx";
import { authAPI } from "../../components/common/apiClient.jsx";  // 객체 import
import { useNavigate } from "react-router-dom";
import Modal from "../../components/common/Modal.jsx";

export default function IdFind() {
  const { idfind2, loginpg } = Navigation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nickname: '',
    parentPhoneNumber: '',
    attendanceNumber: ''
  });

  const [loading, setLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState('');
  const [parentPhoneError, setParentPhoneError] = useState('');
  const [attendanceError, setAttendanceError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // PasswordFind와 동일한 모달 상태
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 출석번호 유효성 검사 (4자리)
  const isAttendanceValid = form.attendanceNumber.length === 4 && /^\d{4}$/.test(form.attendanceNumber);

  // 학부모 전화번호 유효성 검사 (010-1234-5678 형식)
  const isParentPhoneValid = form.parentPhoneNumber.length >= 10 &&
    (form.parentPhoneNumber.match(/-/g) || []).length === 2 &&
    /^\d+-\d+-\d+$/.test(form.parentPhoneNumber) &&
    parentPhoneError === '';

  // 모든 필드 채워졌는지 + 유효성 검사
  const isAllValid =
    form.nickname.trim() !== "" &&
    isParentPhoneValid &&
    isAttendanceValid;

  // 전화번호 실시간 유효성 검사
  useEffect(() => {
    const phone = form.parentPhoneNumber.trim();
    if (!phone) {
      setParentPhoneError('');
      return;
    }
    const dashCount = (phone.match(/-/g) || []).length;
    if (dashCount === 2 && /^\d+-\d+-\d+$/.test(phone) && phone.length >= 10) {
      setParentPhoneError('');
    } else {
      setParentPhoneError("'-'를 포함해서 입력해 주세요. (예: 010-1234-5678)");
    }
  }, [form.parentPhoneNumber]);

  // 이름 실시간 유효성 검사
  useEffect(() => {
    const name = form.nickname.trim();
    if (!name) {
      setNicknameError('');
    } else if (name.length < 2) {
      setNicknameError('이름은 2글자 이상 입력해주세요.');
    } else {
      setNicknameError('');
    }
  }, [form.nickname]);

  // 출석번호 실시간 유효성 검사
  useEffect(() => {
    const attendance = form.attendanceNumber.trim();
    if (!attendance) {
      setAttendanceError('');
    } else if (attendance.length !== 4 || !/^\d{4}$/.test(attendance)) {
      setAttendanceError('4자리 숫자를 입력해주세요.');
    } else {
      setAttendanceError('');
    }
  }, [form.attendanceNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "attendanceNumber") {
      // 숫자만 허용하고 4자리로 제한
      const onlyNumber = value.replace(/[^0-9]/g, "");
      const trimmed = onlyNumber.slice(0, 4);
      setForm(prev => ({ ...prev, attendanceNumber: trimmed }));
    } else if (name === "parentPhoneNumber") {
      // 숫자와 -만 허용하고 13자리로 제한
      const onlyNumberAndDash = value.replace(/[^0-9-]/g, "");
      const trimmed = onlyNumberAndDash.slice(0, 13);
      setForm(prev => ({ ...prev, parentPhoneNumber: trimmed }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // 에러 모달 닫기 함수
  const closeErrorModal = () => {
    setErrorModal(false);
    setErrorMessage('');
    setGeneralError('');
  };

  // 안전한 authAPI 호출 + string attendanceNumber
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 개별 에러 초기화
    setNicknameError('');
    setParentPhoneError('');
    setAttendanceError('');
    setGeneralError('');

    // 유효성 검사
    if (!form.nickname.trim()) {
      setNicknameError('이름을 입력해주세요.');
      return;
    }
    if (!isParentPhoneValid) {
      setParentPhoneError("'-'를 포함해서 입력해 주세요. (예: 010-1234-5678)");
      return;
    }
    if (!isAttendanceValid) {
      setAttendanceError('4자리 숫자를 입력해주세요.');
      return;
    }

    if (!authAPI) {
      setErrorMessage('API 클라이언트 오류. 새로고침 후 재시도');
      setErrorModal(true);
      return;
    }

    try {
      setLoading(true);
      setErrorModal(false);
      setGeneralError('');

      const requestBody = {
        nickname: form.nickname.trim(),
        parentPhoneNumber: form.parentPhoneNumber.trim(),
        // string으로 전송
        attendanceNumber: form.attendanceNumber.trim()
      };

      // authAPI 객체 메서드 직접 호출 (baseURL 오류 해결)
      const res = await authAPI.findUsername(requestBody);
      const { username, updatedDate, message } = res.data;

      // 성공 시 결과 페이지로 이동
      navigate('/idfind2', {
        state: {
          username,
          updatedDate,
          message,
        },
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        '일치하는 계정을 찾을 수 없습니다. 다시 확인해 주세요.';

      setGeneralError(msg);
      setErrorMessage(msg);
      setErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="term-all-scroll-ct">
      <IdPswFindTop step={1} onBack={loginpg} />
      <Header />
      <IdPswFindDesktop step={1} />

      <form className="idfind-info-ct" onSubmit={handleSubmit}>
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

        <article className="ls-number-ct">
          <label className="ls-number"> 학부모 전화번호</label>
          <input
            type="text"
            name="parentPhoneNumber"
            className={`ls-input ${parentPhoneError ? "ls-input-error ls-attendance-input" : ""}`}
            placeholder="전화번호 입력"
            value={form.parentPhoneNumber}
            onChange={handleChange}
            autoComplete="tel"
          />
          <p className={`ls-number-sub ${parentPhoneError ? "ls-error-text" : ""}`}>
            {parentPhoneError || "‘-’를 포함한 아버님 또는 어머님 번호 중 하나를 입력해 주세요 (예: 010-1234-5678)"}
          </p>
        </article>

        <article className="ls-attendance-ct mobile-marign">
          <label className="ls-attendance"> 출결번호</label>
          <input
            type="text"
            name="attendanceNumber"
            className={`ls-input ${attendanceError ? "ls-input-error ls-attendance-input" : ""}`}
            placeholder="출결번호 입력"
            value={form.attendanceNumber}
            onChange={handleChange}
            maxLength={4}
            autoComplete="off"
          />
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
            {loading ? '조회 중...' : '아이디 찾기'}
          </button>
        </div>

        <button
          className={`idfind-btn2 ${isAllValid ? 'idfind-btn-active' : ''}`}
          type="submit"
          disabled={!isAllValid || loading}
        >
          {loading ? '조회 중...' : '아이디 찾기'}
        </button>
      </form>

      {errorModal && (
        <Modal
          text={errorMessage}
          event={() => closeErrorModal()}
        />
      )}
    </div>
  );
}
