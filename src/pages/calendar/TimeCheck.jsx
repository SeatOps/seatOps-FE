// import HeaderSub from "../../components/common/HeaderSub";
// import TimeC from '../../css/calendar/TimeCheck.module.css';
// import ClassCt from "../../components/common/ClassCt";
// import Calender from "../../components/calendar/Calender";
// import ClassCtWeb from "../../components/common/ClassCtWeb";
// import Header from "../../components/common/Header";
// import { useState, useEffect } from "react";
// import { authAPI } from '../../components/common/apiClient';
// import scroll from "../../css/common/scroll.module.css"

function TimeCheck() {

    // const [classData, setClassData] = useState([]);
    // const [selectData, setSelectData] = useState([])

    // const [error, setError] = useState(null);
    // const [loading, setLoading] = useState(null);

    // useEffect(() => {

    //     const fetchLectures = async () => {
    //         try {
    //             setLoading(true);
    //             const response = await authAPI.getLectureList();
    //             setClassData(response.data);
    //         } catch (err) {
    //             console.error("강의 목록 로딩 실패:", err);
    //             setError(err.response?.status || 500);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchLectures();

    // }, []);

    // //클릭값 가져오기
    // const clickDate = ({ year, month, day }) => {
    //     const selectClassDate = classData.filter((classTime) => {
    //         // classTime.startTime 예시: "2025-12-01T18:00:00"
    //         const lectureDate = new Date(classTime.startTime);

    //         const lectureYear = lectureDate.getFullYear();
    //         const lectureMonth = lectureDate.getMonth() + 1; // getMonth는 0부터 시작하므로 +1
    //         const lectureDay = lectureDate.getDate();

    //         // 연, 월, 일이 모두 일치하는지 확인
    //         return (
    //             lectureYear === year &&
    //             lectureMonth === month &&
    //             lectureDay === day
    //         );
    //     });

    //     setSelectData(selectClassDate);
    // };

    return (
        <>
        </>
        // <div className={scroll.scroll}>
        //     <div className={scroll.scroll_section}>
        //         <Header />
        //         <section className={scroll.turn_display}>
        //             <p>계속하시려면<br />화면을 가로로 돌려주세요.</p>
        //             <div></div>
        //         </section>
        //         <section className={`${TimeC.main_time_ct}`}>
        //             <div>
        //                 <section className={TimeC.calender_section}>
        //                     <p className={TimeC.web_calender_p}>일정안내</p>
        //                     <Calender clickDate={clickDate} classData={classData} />
        //                 </section>



        //                 <section className={TimeC.classes_ct_web}>
        //                     {selectData.length > 0 ? (
        //                         selectData.map((lecture) => (
        //                             <ClassCtWeb
        //                                 key={lecture.lectureId}
        //                                 lectureData={lecture}
        //                                 btnText="신청하기"
        //                             />
        //                         ))
        //                     ) : (
        //                         <div className={TimeC.no_data_web}>해당 날짜에 등록된 강의가 없습니다.</div>
        //                     )}
        //                 </section>
        //             </div>
        //         </section>
        //     </div>
        // </div>

    )
}

export default TimeCheck;