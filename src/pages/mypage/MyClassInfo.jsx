import myc from '../../css/mypage/MyClassInfo.module.css';
import profileImg from '../../img/profile-img2.svg';
import backBtn from '../../img/back-btn.svg';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../components/common/apiClient';
import Navigation from '../../components/common/Navigate';
import mo from '../../css/common/Modal.module.css';
import { useLocation } from 'react-router-dom';
import scroll from '../../css/common/scroll.module.css'


function MyClassInfo() {
    const navigate = useNavigate();

    const { movemypage } = Navigation();

    const [classObj, setClassObj] = useState(null);
    const [isModal, setIsModal] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const location = useLocation();


    const datas = location.state?.data || {};
    const nickname = datas?.nickname
    console.log(nickname)

    const clickModal = () => {
        setIsModal(true);
    };

    const closeModal = () => {
        setIsModal(false);
    };

    // ✅ 추가: 변경하기 이동 함수
    const navigateToEdit = (lectureId, reservationId, mySeatNumber) => {
        navigate('/reservationedit', {
            state: {
                lectureId,
                reservationId,
                mySeatNumber
            }
        });
    };

    useEffect(() => {
        const classString = window.localStorage.getItem('class');
        if (classString) {
            setClassObj(JSON.parse(classString));
        }
    }, []);

    if (!classObj) {
        return <div className={myc.loading}>데이터를 불러오는 중입니다...</div>;
    }

    const {
        reservationId,
        lectureId,
        subjectName,
        instructorName,
        classroomName,
        seat,
        start,
        end,
        startDate,
        dayOfWeek
    } = classObj;

    const deleteSeat = async () => {
        try {
            const id = reservationId;
            await authAPI.deleteMySeat(id);
            setIsDelete(true);
            closeModal();
        } catch (err) {
            console.error("취소 실패:", err);
        }
    };

    const formatseat = String(seat).padStart(3, '0');


    return (
        <>
            <section className={scroll.turn_display_app}>
                <p>계속하시려면<br />화면을 세로로 돌려주세요.</p>
                <div></div>
            </section>
            <header className={myc.mypage_header}>
                <div>
                    <button onClick={movemypage}><img src={backBtn}></img></button>
                    <p>My</p>
                </div>
            </header>

            <section className={myc.profile_section}>
                <div>
                    <img src={profileImg}></img>
                </div>
                <p>{nickname}</p>
            </section>

            <section className={myc.my_class_margin}>
                <div className={myc.my_class_info}>
                    <div className={myc.date_time_ct}>
                        <p>{startDate?.replace('-', '.')}({dayOfWeek})</p>
                        <p>{start}</p>
                        <div className={myc.gray_line}></div>
                        <p className={myc.seat_num}>{formatseat}번</p>
                    </div>

                    <div className={myc.flex_column}>
                        <div className={myc.gray_ct}>수업명</div>
                        <p>{subjectName}</p>
                    </div>

                    <div className={myc.flex_column}>
                        <div className={myc.gray_ct}>강사</div>
                        <p>{instructorName}</p>
                    </div>

                    {isDelete ? (
                        <div className={myc.my_class_btn}>
                            <button>취소완료</button>
                        </div>
                    ) : (
                        <div className={myc.my_class_btns}>
                            <button onClick={() => navigateToEdit(lectureId, reservationId, seat)} >
                                변경하기
                            </button>
                            <button onClick={clickModal}>취소하기</button>
                        </div>
                    )}
                </div>
            </section>

            {isModal === true && (
                <section className={mo.modal}>
                    <div>
                        <p>취소하시겠습니까?<br />취소 신청 후엔 다시 예약해야 합니다.</p>
                        <div>
                            <button onClick={deleteSeat}>네</button>
                            <button onClick={closeModal}>아니오</button>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

export default MyClassInfo;
