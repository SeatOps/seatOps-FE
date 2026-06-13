import Backbtn from '../../img/backbtn.svg'
import '../../css/auth/IdPswFindTop.css'
import Navigation from '../common/Navigate'

function IdPswFindDesktop({ step = 1 }) {
    const { idfind, pswfind } = Navigation();
    return (
        <div className='idpsw-top-desktop'>
            <p> 아이디 / 비밀번호 찾기 </p>
            <nav className='idpsw-desktop-ct'>
                <button style={{ cursor: 'pointer' }} className={`idpsw-btn ${step === 1 ? 'idpsw-desktop-step-2' : 'idpsw-desktop-step-1'}`} onClick={idfind}>아이디 찾기</button>
                <button style={{ cursor: 'pointer' }}  className={`idpsw-btn ${step === 2 ? 'idpsw-desktop-step-2' : 'idpsw-desktop-step-1'}`} onClick={pswfind}>비밀번호 찾기</button>
            </nav>
        </div>
    )
}

export default IdPswFindDesktop
