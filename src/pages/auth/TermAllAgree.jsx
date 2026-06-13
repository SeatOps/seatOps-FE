import SignupTop from "../../components/auth/SignupTop";
import Termremovebtn from '../../img/termremove.svg'
import '../../css/auth/TermAll.css'
import Navigation from "../../components/common/Navigate";
import Header from "../../components/common/Header";

export default function TermAllAgree() {
    const { termcondition } = Navigation();
    return (
        <div className="term-all-scroll-ct">
            <SignupTop title='약관동의' />
            <Header />

            <p className="term-all-pharse"> 시대원 학원 회원가입</p>
            <div className="term-all-ct">
                <p style={{ cursor: 'pointer' }} className="term-all-remove-img" onClick={termcondition}> <img src={Termremovebtn} alt="x표시 이미지" /></p>

                <p
                    style={{
                        marginBottom: "32px"
                    }}> 이용약관 전체 동의</p>
                <section className="term-all-content-ct">
                    <p> [필수] 개인정보 수집 및 이용 <br />
                        시대원 학원 서비스를 이용하기 위해 다음과 같은 내용으로 개인정보를 처리하며
                        개인정보 보호법 제 15조 제1항 제4호에 따라, 정보주체와 체결한 계약으로
                        정보주체의 동의없이 개인정보를 수집 및 이용합니다.
                    </p>

                    <p> <span> <br />1. 수집하는 개인정보</span>
                        <br />- 아이디, 비밀번호, 이름, 휴대전화번호
                        <br />- 만 14세 미만 : 법정대리인 휴대전화번호
                        서비스이용 과정에서 다음과 같은 정보가 생성되어 수집될 수 있습니다.
                    </p>

                    <p> <br />o 부정이용방지 및 비인가 사용방지 서비스 이용기록, 불량 이용기록, 접속 로그, 쿠키, 접속 IP정보, 접속 기기정보</p>

                    <p> <span> <br />2. 개인정보의 처리 및 이용목적</span>
                        <br />이용자 식별 및 회원서비스 제공, 가입의사 확인 및 가입 횟수 제한, 불법 및 부정 이용방지, 분쟁 예방 및 해결을 위한 기록보존, 통계자료 산출
                    </p>

                    <p> <span> <br />3. 개인정보의 처리 및 보유기간</span>
                        <br /> 회사는 원칙적으로 이용자의 개인정보를 회원 탈퇴시 지체없이 파기하고 있습니다. 단, 계약을 이행하거나 체결하는 과정에서 이용자의 요청에 따른 조치를 이행하기 위하여 필요한 경우, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 개별적으로 동의를 받거나 아래와 같이 일정기간 동안 개인정보를 보관합니다.
                    </p>

                    <p> <span> <br />- 중복가입 방지 및 게시물 관리를 위해 아이디 영구보관 </span>
                        <br />- 표시/광고에 관한 기록 : 6개월 (전자상거래 등에서의 소비자보호에 관한 법률)
                        <br />- 계약 또는 청약철회 등에 관한 기록 : 5년 (전자상거래 등에서의 소비자보호에 관한 법률)
                        <br />- 대금결제 및 재화 등의 공급에 관한 기록 : 5년 (전자상거래등에서의 소비자보호에 관한 법률)
                        <br />- 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년 (전자상거래등에서의 소비자 보호에 관한 법률)
                        <br />- 통신사실확인자료 : 3개월 (통신비밀보호법)
                    </p>
                </section>

                <button className="termall-close-btn" onClick={termcondition} style={{ cursor: 'pointer' }}> 닫기 </button>
            </div>
        </div>
    )
}