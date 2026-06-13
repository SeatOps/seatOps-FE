import SignupTop from "../../components/auth/SignupTop";
import Termremovebtn from '../../img/termremove.svg'
import '../../css/auth/TermAll.css'
import Navigation from "../../components/common/Navigate";
import Header from "../../components/common/Header";

export default function TermPersonalInf() {
    const { termcondition } = Navigation();
    return (
        <div className="term-all-scroll-ct">
            <SignupTop title='약관동의' />
            <Header />

            <p className="term-all-pharse"> 시대원 학원 회원가입</p>

            <div className="term-all-ct">
                <p className="term-all-remove-img" onClick={termcondition} style={{ cursor: 'pointer' }}> <img src={Termremovebtn} alt="x표시 이미지" /></p>

                <p
                    style={{
                        marginBottom: "32px"
                    }}> 개인정보 수집 및 이용</p>
                <section className="term-all-content-ct">
                    <p> 시대원 학원은 회원가입을 위해 아래와 같은 내용으로 개인정보를 수집 및 처리합니다.
                        <span> <br /> <br /> <br /> 1. 수집하는 개인정보</span>
                        <br />- 아이디, 비밀번호, 이름, 휴대전화번호
                        <br />- 만 14세 미만 : 법정대리인 휴대전화번호
                        서비스이용 과정에서 다음과 같은 정보가 생성되어 수집될 수 있습니다.
                    </p>

                    <p> <span> <br /><br />2. 개인정보의 처리 및 이용목적</span>
                        <br />- 이용자 식별 및 회원서비스 제공, 가입의사 확인 및 가입 횟수 제한, 불법 및 부정 이용방지,
                        분쟁조정을 위한 기록보존, 통계자료 산출, 공지사항 전달
                    </p>

                    <p> <span> <br /><br />3. 개인정보의 처리 및 보유기간</span>
                        <br />- 회원 탈퇴 시까지
                    </p>
                </section>

                <button className="termall-close-btn" onClick={termcondition} style={{ cursor: 'pointer' }}> 닫기 </button>
            </div>
        </div>
    )
}