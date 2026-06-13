import classA from '../../css/main/ClassApply.module.css';
import Dates from '../../components/main/Dates.jsx';
import HeaderSub from '../../components/common/HeaderSub.jsx';
import { useEffect, useState } from 'react';
import { authAPI } from '../../components/common/apiClient.jsx';
import scroll from "../../css/common/scroll.module.css"
import Header from '../../components/common/Header.jsx';
import ClassCtApply from '../../components/main/ClassCtApply.jsx';
import Navigation from '../../components/common/Navigate.jsx';
import Modal from '../../components/common/Modal.jsx';



function ClassApply() {
    const { reservationpg } = Navigation();

    const [classData, setClassData] = useState([]);
    const [selectData, setSelectData] = useState([])
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [calenderInfo, setCalenderInfo] = useState([])
    const [selectLectureId, setSelectLectureId] = useState("")
    const [isModal, setIsModal] = useState(false);

    const [totalDates, setTotalDates] = useState([]);
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    useEffect(() => {
        getCalendarData()
    }, []);


    /* 현재 시점의 달력 정보만 반환하는 함수 */
    function getCalendarData() {
        const today = new Date();
        const tempArray = [];

        for (let i = 0; i < 5; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);

            const month = futureDate.getMonth() + 1;
            const date = futureDate.getDate();

            tempArray.push({
                month: month,
                date: date
            });
        }

        setCalenderInfo(tempArray);
    }

    //연동
    useEffect(() => {

        const fetchLectures = async () => {
            try {
                setLoading(true);
                const response = await authAPI.getLectureList();
                setClassData(response.data);
                const today = new Date().getDate();
                const todayLectures = response.data.filter(lecture =>
                    Number(lecture.startTime.slice(8, 10)) === today
                );
                setSelectData(todayLectures);
            } catch (err) {
                console.error("강의 목록 로딩 실패:", err);
                setError(err.response?.status || 500);
            } finally {
                setLoading(false);
            }
        };

        fetchLectures();

    }, []);

    //클릭값 가져오기
    const clickDate = (day) => {

        setSelectedDay(day)
        const selectClassDate = classData.filter((classTime) => {
            const lectureDay = Number(classTime.startTime.slice(8, 10));

            return lectureDay === day;
        });
        setSelectLectureId("")


        setSelectData(selectClassDate);
    }



    return (
        <div className={scroll.scroll}>
            <div className={scroll.scroll_section}>
                <div className={classA.header_app}>
                    <Header />
                </div>
                <HeaderSub title="좌석 예약" />
                <section className={scroll.turn_display_app}>
                    <p>계속하시려면<br />화면을 세로로 돌려주세요.</p>
                    <div></div>
                </section>
                <section className={classA.select_date_ct}>
                    <p>날짜</p>
                    <div>
                        {calenderInfo.map((i, index) => (
                            <Dates
                                key={index}
                                month={i.month}
                                day={i.date}
                                clickDate={() => clickDate(i.date)}
                                isSelected={selectedDay === i.date} />
                        ))}

                    </div>
                </section>

                {selectData.length > 0 ? (
                    <section className={classA.classes_ct}>
                        {selectData.map((lecture) => (
                            <ClassCtApply
                                key={lecture.lectureId}
                                lectureData={lecture}
                                setSelectLectureId={setSelectLectureId}
                                selectLectureId={selectLectureId}
                            />
                        ))}
                    </section>
                ) : (
                    <p className={classA.classes_p}>해당 날짜에 등록된 강의가 없습니다.</p>
                )}

                <button className={classA.book_button} onClick={() => selectLectureId ? (reservationpg(selectLectureId)) : (setIsModal(true))}>
                    예약하기
                </button>

            </div>
            {isModal && <Modal text="예약할 강의를 선택해주세요." event={() => setIsModal(false)} />}
        </div>
    )
}

export default ClassApply;