import { useState } from "react";
import Navigation from "../../components/common/Navigate.jsx";
import "../../css/auth/SignUp.css";
import SignupTop from "../../components/auth/SignupTop.jsx";
import Header from "../../components/common/Header.jsx";
import SignupTermDesktop from "../../components/auth/SignupTermDesktop.jsx";
import NewMember from "../../img/NewMember.svg";
import ExistingMember from "../../img/ExistingMember.svg";

export default function SignUp() {
    const { loginpg, termcondition } = Navigation();

    // 선택 상태
    const [selectedType, setSelectedType] = useState(null); // "existing" | "new" | null

    const handleExistingClick = () => {
        setSelectedType("existing");
    };

    const handleNewClick = () => {
        setSelectedType("new");
    };

    const isSelected = (type) => selectedType === type;

    const handleNextClick = () => {
        if (!selectedType) return; // 선택 안했으면 막거나 토스트

        //  선택된 회원 타입 localStorage에 저장
        localStorage.setItem('signupType', selectedType);

        // termcondition 페이지로 이동 (회원 타입 정보와 함께)
        termcondition();
    };

    return (
        <div className="term-all-scroll-ct">
            <SignupTop title="회원가입" onBack={loginpg} />
            <Header />
            <section className="signup-ct">
                <p className="signup-choose-pharse"> 시대원학원 통합 회원가입 </p>

                <section className="signup-choose-guide-ct">
                    <p className="signup-guide-left"></p>
                    <div className="signup-guide-right">
                        <p className="guide-right-title">학생 정보를 선택해 주세요.</p>
                        <p className="guide-right-content">
                            2026년 01월 04일 이후로 학원을 등록한 학생은 신규 학생으로 등록해주시기 바랍니다.
                        </p>
                    </div>
                </section>

                <div className="signup-choose-desktop-ct">
                    <div
                        className={
                            "existing-member" + (isSelected("existing") ? " selected-member" : "")
                        }
                        onClick={handleExistingClick}
                    >
                        <div className="member-text-wrap">
                            기존 학생
                            <p></p>
                        </div>
                        <img src={ExistingMember} alt="기존 회원 이미지" />
                    </div>

                    {/* 신규 회원 카드 */}
                    <div
                        className={
                            "new-member" + (isSelected("new") ? " selected-member" : "")
                        }
                        onClick={handleNewClick}
                    >
                        <div className="member-text-wrap">
                            신규 학생
                            <p></p>
                        </div>
                        <img src={NewMember} alt="신규 회원 이미지" />
                    </div>
                </div>

                {/* 모바일 다음 버튼 (fixed) */}
                <button
                    className={
                        "signup-mobile-next-btn" +
                        (selectedType ? " signup-mobile-next-btn-active" : "")
                    }
                    onClick={handleNextClick}
                >
                    다음
                </button>

                {/* 데스크톱 버튼 영역 */}
                <div className="signup-choose-desktop-btn-ct">
                    <button className="signup-choose-back-btn"
                        onClick={loginpg}
                    > 이전 </button>

                    <button className={
                        "signup-choose-next-btn"
                        + (selectedType ? " signup-mobile-next-btn-active" : "")
                    }
                        onClick={handleNextClick}
                    > 다음 </button>
                </div>
            </section>
        </div>
    );
}
