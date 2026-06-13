import ClassCtMy from "../../components/mypage/ClassCtMy";
import myp from '../../css/mypage/MyPage.module.css';
import profileImg from '../../img/profile-img2.svg';
import backBtn from '../../img/back-btn.svg';
import Header from "../../components/common/Header";
import ClassCtWeb2 from "../../components/mypage/ClassCtWeb2";
import { useState, useEffect } from "react";
import { authAPI } from '../../components/common/apiClient';
import Navigation from "../../components/common/Navigate";
import scroll from "../../css/common/scroll.module.css"



function MyPage() {

    const { movemyinfo, movemychangeinfo, movehome, loginpg } = Navigation();

    const [myReservationData, setMyReservationData] = useState([]);
    const [myInfo, setMyInfo] = useState({});



    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const handleDeleteReservation = (reservationId) => {
        setMyReservationData((prevList) => prevList.filter(Reservation => Reservation.reservationId !== reservationId));
    };


    useEffect(() => {
        // 로그인확인
        const atoken = localStorage.getItem('accessToken');

        const isValidToken = atoken && atoken !== "null" && atoken !== "undefined";

        if (!isValidToken) {
            setIsLoggedIn(false);
            return;
        }


        setIsLoggedIn(true);

        //연동
        const fetchData = async () => {
            setLoading(true);
            try {
                const [resReservation, resInfo] = await Promise.all([
                    authAPI.getMyReservations(),
                    authAPI.getMyInfo()
                ]);

                setMyReservationData(resReservation.data);
                setMyInfo(resInfo.data);


            } catch (err) {
                console.error("데이터 로딩 실패:", err);
                if (err.response?.status === 401) {
                    setIsLoggedIn(false);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    return (
        <div className={scroll.scroll}>
            <div className={scroll.scroll_section} >
                <div className={myp.header_app}>
                    <Header />
                </div>
                <header className={myp.mypage_header}>
                    <div>
                        <button onClick={movehome}><img src={backBtn}></img></button>
                        <p>My</p>
                    </div>
                </header>
                <section>
                    {isLoggedIn ? (
                        <section className={myp.profile_section}>
                            <div><img src={profileImg} alt="프로필" /></div>
                            <p className={myp.my_name}>{myInfo.nickname || "사용자"}님</p>
                            <p className={myp.my_id}>{myInfo.username || "아이디 정보 없음"}</p>
                            <button className={myp.app} onClick={movemyinfo}>내 정보</button>
                            <button className={myp.web} onClick={() => { movemychangeinfo(myInfo.nickname) }}>내 정보</button>

                        </section>
                    ) : (
                        /* 비로그인 상태일 때 */
                        <section className={myp.profile_section}>
                            <div><img src={profileImg} alt="프로필" /></div>
                            <p className={myp.my_name}>로그인 해주세요</p>
                            <p className={myp.my_id}>{myInfo.username || "아이디 정보 없음"}</p>
                            <button onClick={loginpg}>로그인</button>
                        </section>
                    )}




                    <div className={myp.gray_div}></div>

                    <section>
                        <div className={myp.my_class_info_header}>
                            <p>좌석 예약 정보</p>
                        </div>
                        <div className={myp.my_classes}>
                            {myReservationData.map((reservation) => (
                                <ClassCtMy
                                    key={reservation.reservationId}
                                    reservationData={reservation}
                                    nickname={myInfo.nickname}

                                />
                            ))}
                        </div>
                        <div className={myp.my_classes_web}>
                            {myReservationData.map((reservation) => (
                                <ClassCtWeb2
                                    key={reservation.reservationId}
                                    reservationData={reservation}
                                    onSuccess={() => { handleDeleteReservation(reservation.reservationId) }}

                                />
                            ))}
                        </div>
                    </section>
                </section>
            </div>
        </div>
    )
}

export default MyPage;