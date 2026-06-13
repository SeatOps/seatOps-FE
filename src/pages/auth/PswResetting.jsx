import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IdPswFindTop from "../../components/auth/IdPswFindTop";
import '../../css/auth/IdPswFind.css';
import inputvisible from '../../img/inputeye.svg';
import inputremove from '../../img/inputuneye.svg';
import Header from '../../components/common/Header';
import IdPswFindDesktop from '../../components/auth/IdPswFindDesktop';
import { authAPI } from '../../components/common/apiClient';
import Navigation from '../../components/common/Navigate';
import Modal from '../../components/common/Modal';


export default function PswRessting() {
  const { loginpg } = Navigation();
  const location = useLocation();
  const navigate = useNavigate();

  const { username, nickname, attendanceNumber } = location.state || {};

  const [newPw, setNewPw] = useState('');
  const [newPwVisible, setNewPwVisible] = useState(false);

  const [newPw2, setNewPw2] = useState('');
  const [newPw2Visible, setNewPw2Visible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [passwordStatus, setPasswordStatus] = useState('');
  const [passwordConfirmStatus, setPasswordConfirmStatus] = useState('');
  const [errors, setErrors] = useState({
    password: "",
    passwordConfirm: ""
  });

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const closeErrorModal = () => {
    setErrorModal(false);
    setErrorMessage('');
  };

  const hasLetterAndNumber = (value) => {
    const hasLetter = /[A-Za-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    return hasLetter && hasNumber;
  };

  const isPasswordValid = newPw.length >= 8 && newPw.length <= 16 && hasLetterAndNumber(newPw);
  const isPasswordMatch = newPw === newPw2 && newPw2.length > 0;

  useEffect(() => {
    const value = newPw;

    if (value.length === 0) {
      setPasswordStatus('');
      setErrors(prev => ({ ...prev, password: '' }));
      return;
    }

    if (value.length < 8 || value.length > 16) {
      setPasswordStatus('invalid');
      setErrors(prev => ({
        ...prev,
        password: '비밀번호는 8~16자로 입력해주세요.'
      }));
      return;
    }

    if (!hasLetterAndNumber(value)) {
      setPasswordStatus('invalid');
      setErrors(prev => ({
        ...prev,
        password: '영문과 숫자 모두 최소한 한 자 이상 포함시켜주세요.'
      }));
      return;
    }

    setPasswordStatus('valid');
    setErrors(prev => ({ ...prev, password: '' }));
  }, [newPw]);

  useEffect(() => {
    if (newPw2.length === 0) {
      setPasswordConfirmStatus('');
      setErrors(prev => ({ ...prev, passwordConfirm: '' }));
    } else if (newPw === newPw2) {
      setPasswordConfirmStatus('match');
      setErrors(prev => ({ ...prev, passwordConfirm: '' }));
    } else {
      setPasswordConfirmStatus('mismatch');
      setErrors(prev => ({ ...prev, passwordConfirm: '비밀번호가 일치하지 않습니다.' }));
    }
  }, [newPw2, newPw]);

  const showErrorModal = (message) => {
    setErrorMessage(message);
    setErrorModal(true);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!isPasswordValid || !isPasswordMatch || loading) return;
    if (!username || !nickname || !attendanceNumber) {
      showErrorModal('비밀번호 재설정 정보가 없습니다. 다시 시도해 주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const body = {
        username,
        nickname,
        attendanceNumber,
        newPassword: newPw,
        passwordConfirm: newPw2,
      };

      const res = await authAPI.resetPassword(body);
      const { nickname: resNickname, attendanceNumber: resAttendance } = res.data;

      navigate('/pswchangecomplete', {
        state: {
          nickname: resNickname || nickname,
          attendanceNumber: resAttendance || attendanceNumber,
        },
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        '비밀번호 재설정에 실패했습니다. 다시 시도해 주세요.';

      showErrorModal(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="term-all-scroll-ct">
      <IdPswFindTop step={2} onBack={loginpg} />
      <Header />
      <IdPswFindDesktop step={2} />
      <p className="psw-resetting-ins"> 비밀번호 재설정</p>

      <form className="new-psw-total-ct" onSubmit={handleChangePassword}>
        <article className={`ls-pswresetting-ct ${passwordStatus === 'invalid' ? "ls-passweord-error-ct" : ""}`}>
          <label className="ls-psw"> 새 비밀번호 </label>
          <div
            className={`pw-input-wrap ${passwordStatus === 'invalid' ? "ls-passeword-error-ct" : ""}`}
            style={passwordStatus === 'invalid' ? { borderColor: '#FF0000' } : {}}
          >
            <input
              type={newPwVisible ? 'text' : 'password'}
              name="password"
              className={`ls-input ${passwordStatus === 'invalid' ? "ls-input-error" : ""}`}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value.slice(0, 16))}
              placeholder="비밀번호 입력"
              maxLength={16}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="pw-icon-btn"
              onClick={() => setNewPwVisible(v => !v)}
            >
              <img
                src={newPwVisible ? inputvisible : inputremove}
                alt={newPwVisible ? "비밀번호 숨기기" : "비밀번호 보이기"}
              />
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

        <article className={`ls-pswresetting-check-ct ${passwordConfirmStatus === 'mismatch' ? "ls-passwowrd-error-ct" : ""}`}>
          <label className="ls-psw-check"> 비밀번호 재확인</label>
          <div
            className={`pw-input-wrap ${passwordConfirmStatus === 'mismatch' ? "ls-paswsword-error-ct" : ""}`}
            style={passwordConfirmStatus === 'mismatch' ? { borderColor: '#FF0000' } : {}}
          >
            <input
              type={newPw2Visible ? 'text' : 'password'}
              name="passwordConfirm"
              className={`ls-input ${passwordConfirmStatus === 'mismatch' ? "ls-input-error" : ""}`}
              value={newPw2}
              onChange={(e) => setNewPw2(e.target.value.slice(0, 16))}
              placeholder="비밀번호를 재입력"
              maxLength={16}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="pw-icon-btn"
              onClick={() => setNewPw2Visible(v => !v)}
            >
              <img
                src={newPw2Visible ? inputvisible : inputremove}
                alt={newPw2Visible ? "비밀번호 숨기기" : "비밀번호 보이기"}
              />
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

        <div className="idfind-btn-ct">
          <button
            className="idfind-back-btn"
            type="button"
            onClick={loginpg}
          >
            이전
          </button>

          <button
            className={`idfind-btn ${isPasswordValid && isPasswordMatch ? 'idfind-btn-active' : ''}`}
            type="submit"
            disabled={!isPasswordValid || !isPasswordMatch || loading}
          >
            {loading ? '조회 중...' : '변경하기'}
          </button>
        </div>

        <button
          className={`idfind-btn2 ${isPasswordValid && isPasswordMatch ? 'idfind-btn-active' : ''}`}
          type="submit"
          disabled={!isPasswordValid || !isPasswordMatch || loading}
        >
          {loading ? '조회 중...' : '변경하기'}
        </button>
      </form>

      {errorModal && (
        <Modal
          text={errorMessage}
          event={() => {
            closeErrorModal();
          }}
        />
      )}
    </div>
  );
}
