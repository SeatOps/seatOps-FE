import '../../css/auth/IdPswFindTop.css'

function SignupTermDesktop({ step = 1 }) {
    return (
        <div className='signterm-desktop-top'>
            <p className="term-desktop-pharse"> 시대원 학원 회원가입</p>

            <nav className="term-ct-desktop">
                <div className={`term-step1-ct ${step === 1 ? 'active' : ''}`}>
                    <p> STEP 01</p>
                    <p> 약관동의</p>
                </div>

                <div className={`term-step2-ct ${step === 2 ? 'active' : ''}`}>
                    <p> STEP 02 </p>
                    <p> 정보 입력</p>
                </div>

                <div className={`term-step3-ct ${step === 3 ? 'active' : ''}`}>
                    <p> STEP 03</p>
                    <p> 가입 완료</p>
                </div>
            </nav>
        </div>
    )
}

export default SignupTermDesktop
