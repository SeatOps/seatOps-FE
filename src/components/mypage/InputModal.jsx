import mo from '../../css/common/Modal.module.css'
import ShowPaswword from '../../img/inputeye.svg';
import Inputuneye from '../../img/inputuneye.svg';
import '../../css/auth/LocalSignUp.css';
import { useState } from 'react';

function InputModal({ currentPassword, setCurrentPassword, error, btn1E, btn2E }) {

    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);

    return (
        <div className={mo.modal_parent}>
            <section className={mo.modal}>
                <div>
                    <p className={mo.passwordP}>현재 비밀번호를 입력해주세요</p>
                    <div className={`${mo.togle_input_div} ${error ? mo.error_input : ""}`} style={{ position: 'relative' }}>
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
                    <p className={`${mo.unerrorP} ${error ? mo.errorP : ""}`}>비밀번호가 틀렸습니다.</p>
                    <div>
                        <button onClick={btn1E}>취소</button>
                        <button onClick={btn2E}>확인</button>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default InputModal;