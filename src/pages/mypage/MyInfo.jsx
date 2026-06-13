import { useEffect, useState } from "react";
import MyPageDatail from "../../components/mypage/MyPageDetail";
import myp from '../../css/mypage/MyPage.module.css'
import profileImg from '../../img/profile-img2.svg';
import backBtn from '../../img/back-btn.svg';
import Header from "../../components/common/Header";
import { authAPI } from '../../components/common/apiClient';
import Navigation from "../../components/common/Navigate";
import myc from '../../css/mypage/MyClassInfo.module.css';
import Modal from "../../components/common/Modal";
import mo from '../../css/common/Modal.module.css'
import scroll from "../../css/common/scroll.module.css"


function MyInfo() {

    const { movechangeparentphone, movechangepassword, movemypage, loginpg } = Navigation();

    const [myInfo, setMyInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [infoChange, setInfoChange] = useState(false);
    const [isModal, setIsModal] = useState(false);

    const [onModal, setOnModal] = useState(false)
    const [leaveModal, setLeaveModal] = useState(false)

    const clickModal = () => {
        setIsModal(true)
    }

    const closeModal = () => {
        setIsModal(false);
    }

    useEffect(() => {

        //연동
        const fetchData = async () => {
            setLoading(true);
            try {
                const [resInfo] = await Promise.all([
                    authAPI.getMyInfo()
                ]);

                setMyInfo(resInfo.data);
            } catch (err) {
                console.error("데이터 로딩 실패:", err);

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const fetchSecession = async () => {
        try {
            const response = await authAPI.deleteUser()

            setIsModal(false);
            setLeaveModal(true)

            localStorage.clear();
        } catch (err) {
            console.error("탈퇴 실패:", err);
            setIsModal(false);

            if (err.status === 400) {
                setOnModal(true);
            }
        }
    }

    //화면 바뀜
    const userInfoClick = () => {
        setInfoChange(true);
    }

    const sendData = () => {
        const myData = {
            username: myInfo.username,
            attendanceNumber: myInfo.attendanceNumber,
            nickname: myInfo.nickname,
            parentPhoneNumber: myInfo.parentPhoneNumber
        }

        const myString = JSON.stringify(myData);

        window.localStorage.setItem('myInfo', myString);
    }

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');

        try {
            if (refreshToken) {
                await authAPI.logout(refreshToken);
            }
        } catch (error) {
            console.error('로그아웃 API 실패:', error);
        } finally {
            // 1) 토큰 제거
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            loginpg();
            window.location.reload();
        }
    };



    return (
        <div className={scroll.scroll}>
            <div className={scroll.scroll_section} >

                <div className={myp.header_app}>
                    <Header />
                </div>

                {infoChange ? (
                    <header className={myp.mypage_header}>
                        <div>
                            <button onClick={() => { setInfoChange(false) }}><img src={backBtn}></img></button>
                            <p>회원정보 관리</p>
                        </div>
                    </header>
                ) : (
                    <header className={myp.mypage_header}>
                        <div>
                            <button onClick={movemypage}><img src={backBtn}></img></button>
                            <p>내 정보</p>
                        </div>
                    </header>
                )}
                <section className={scroll.turn_display_app}>
                    <p>계속하시려면<br />화면을 세로로 돌려주세요.</p>
                    <div></div>
                </section>
                <section className={myp.none_profile_section_info}>
                    <div><img src={profileImg} alt="프로필" /></div>
                    <p className={myp.my_name}>{myInfo.nickname || "사용자"}님</p>
                    <p className={myp.my_id_info}>{myInfo.username || "아이디 정보 없음"}</p>
                    <button className={myp.app} onClick={handleLogout}>로그아웃</button>

                </section>

                <div className={myp.gray_div}></div>
                {infoChange ? (
                    <section className={myp.detail_section}>
                        <MyPageDatail text="비밀번호 변경" event={() => {
                            movechangepassword();
                            sendData();
                        }} />
                        <MyPageDatail text="내 정보 변경" event={() => {
                            movechangeparentphone();
                            sendData();
                        }} />
                    </section >
                ) : (
                    <section className={myp.detail_section}>
                        <MyPageDatail text="회원정보 관리" event={userInfoClick} />
                        <MyPageDatail text="회원 탈퇴" event={clickModal} />
                    </section >
                )
                }

                {
                    isModal === true && (
                        <section className={mo.modal}>
                            <div>
                                <p>회원 탈퇴를 하시겠습니까?<br />탈퇴 후엔 다시 회원가입 해야 합니다.</p>
                                <div>
                                    <button onClick={fetchSecession}>네</button>
                                    <button onClick={closeModal}>아니오</button>
                                </div>
                            </div>
                        </section>

                    )
                }

                {
                    onModal === true && (
                        <Modal text="예약된 강의 취소 후 탈퇴해주세요." event={() => { setOnModal(false) }} />
                    )
                }

                {
                    leaveModal === true && (
                        <Modal text="탈퇴 완료되었습니다." event={() => {
                            window.location.href = "/"; // 메인 페이지로 강제 이동
                        }} />
                    )
                }
            </div>
        </div>
    )
}

export default MyInfo;