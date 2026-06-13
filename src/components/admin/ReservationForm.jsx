import rsvRegi from "../../css/admin/RsvRegi.module.css";
import { useState, useEffect } from 'react';
import { authAPI } from '../common/apiClient';
import TimeForm from "./TimeForm";
import DateForm from "./DateForm";
import ManageHeaderSub from "./ManageHeaderSub";
import Modal from "../common/Modal";
import Navigation from "../common/Navigate";

function ReservationForm() {



    const { reservationmregi } = Navigation();

    //강사, 과목, 강의실 조회
    const [instructorList, setInstructorList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [classroomList, setClassroomList] = useState([]);

    const [instructor, setInstructor] = useState("");
    const [subject, setSubject] = useState("");
    const [classroom, setClassroom] = useState("");


    const now = new Date();
    const currentYear = String(now.getFullYear()); // 문자열로 통일 권장

    // 숫자를 "01" 형태로 만들어주는 헬퍼 함수
    const f = (num) => String(num).padStart(2, '0');

    // 수업 날짜 초기값 수정
    const [classYear, setClassYear] = useState(currentYear);
    const [classMonth, setClassMonth] = useState(f(now.getMonth() + 1)); // "01" 형태로 저장
    const [classDay, setClassDay] = useState(f(now.getDate()));        // "06" 형태로 저장

    // 시작 날짜 초기값 수정
    const [startYear, setStartYear] = useState(currentYear);
    const [startMonth, setStartMonth] = useState(f(now.getMonth() + 1));
    const [startDay, setStartDay] = useState(f(now.getDate()));

    // 종료 날짜 초기값 수정
    const [endYear, setEndYear] = useState(currentYear);
    const [endMonth, setEndMonth] = useState(f(now.getMonth() + 1));
    const [endDay, setEndDay] = useState(f(now.getDate()));

    //수업 시작 시간, 끝 시간, 예약 시작 시간, 끝 시간
    const [startHour, setStartHour] = useState("00")
    const [startMin, setStartMin] = useState("00")
    const [endHour, setEndHour] = useState("00")
    const [endMin, setEndMin] = useState("00")

    const [rsvStartHour, setRsvStartHour] = useState("00")
    const [rsvStartMin, setRsvStartMin] = useState("00")
    const [rsvEndHour, setRsvEndHour] = useState("00")
    const [rsvEndMin, setRsvEndMin] = useState("00")

    const [onModal, setOnModal] = useState(false)



    //강사, 과목, 강의실 조회 연동
    useEffect(() => {
        const fetchData = async () => {

            try {
                const [resInstructors, resSubjects, resClassrooms] = await Promise.all([
                    authAPI.instructorsAdd(),
                    authAPI.subjectsAdd(),
                    authAPI.classroomsAdd()
                ]);

                setInstructorList(resInstructors.data); // 강사 목록
                setSubjectList(resSubjects.data);       // 과목 목록
                setClassroomList(resClassrooms.data);   // 강의실 목록

            } catch (err) {
                console.error("데이터 로딩 실패:", err);
            }
        };

        fetchData();
    }, []);



    const nextLectureRegi = () => {

        if (classroom === "" || instructor === "" || subject === "") {
            setOnModal(true)
            return;
        }

        const f = (num) => String(num).padStart(2, '0');

        const startTime = `${classYear}-${f(classMonth)}-${f(classDay)}T${f(startHour)}:${f(startMin)}:00`;
        const endTime = `${classYear}-${f(classMonth)}-${f(classDay)}T${f(endHour)}:${f(endMin)}:00`;
        const reservationOpenAt = `${f(startYear)}-${f(startMonth)}-${f(startDay)}T${f(rsvStartHour)}:${f(rsvStartMin)}:00`;
        const reservationCloseAt = `${f(endYear)}-${f(endMonth)}-${f(endDay)}T${f(rsvEndHour)}:${f(rsvEndMin)}:00`;
        const selectedRoom = classroomList.find((room) => String(room.id) === String(classroom));
        const lectureName = subjectList.find((s) => String(s.id) === String(subject));
        const instructorName = instructorList.find((i) => String(i.id) === String(instructor));
        console.log(lectureName)
        console.log(instructorName)

        const requestData = {
            classroomId: classroom,
            instructorId: instructor,
            subjectId: subject,
            startTime: startTime,
            endTime: endTime,
            reservationOpenAt: reservationOpenAt,
            reservationCloseAt: reservationCloseAt,
            classroomName: selectedRoom ? selectedRoom.classroomNum : "",
            lectureName: lectureName.name,
            instructorName: instructorName.name

        };

        return requestData
    }

    return (
        <>
            <ManageHeaderSub text="예약등록" button="다음" onButtonClick={() => {
                const data = nextLectureRegi();
                reservationmregi(data);
            }} />
            <div className={rsvRegi.class_form}>
                <form className={rsvRegi.reservation_form}>
                    {/* 기본 정보 입력 */}
                    <section className={rsvRegi.select_top}>
                        <div>
                            <label className={rsvRegi.labels} htmlFor="subject">과목명</label>
                            <select id="subject" onChange={(e) => setSubject(e.target.value)}>
                                <option value="">과목명 선택</option>
                                {subjectList.map((sub) => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={rsvRegi.labels} htmlFor="lecturer">강사</label>
                            <select id="lecturer" onChange={(e) => setInstructor(e.target.value)}>
                                <option value="">이름 선택</option>
                                {instructorList.map((inst) => (
                                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={rsvRegi.labels} htmlFor="classroom">강의실</label>
                            <select id="classroom" onChange={(e) => setClassroom(e.target.value)}>
                                <option value="">강의실 선택</option>
                                {classroomList.map((room) => (
                                    <option key={room.id} value={room.id}>{room.classroomNum} {room.totalSeat}좌석</option>
                                ))}
                            </select>
                        </div>
                    </section>


                    {/* 수업 날짜 섹션 */}
                    <section className={rsvRegi.select_bottom}>
                        <div>
                            <p className={rsvRegi.labels}>수업날짜</p>
                            <DateForm
                                stateYear={classYear}
                                stateSetYear={setClassYear}
                                stateMonth={classMonth}
                                stateSetMonth={setClassMonth}
                                stateDay={classDay}
                                stateSetDay={setClassDay}
                            />
                        </div>

                        {/* 수업 시간 섹션 */}
                        <div>
                            <p className={rsvRegi.labels}>수업시간</p>
                            <TimeForm
                                stateHour={startHour}
                                stateSetHour={setStartHour}
                                stateMin={startMin}
                                stateSetMin={setStartMin}
                            />
                            <span className={rsvRegi.spansapn}> - </span>
                            <TimeForm
                                stateHour={endHour}
                                stateSetHour={setEndHour}
                                stateMin={endMin}
                                stateSetMin={setEndMin}
                            />
                        </div>


                        <div className={rsvRegi.gray_line}></div>

                        {/* 예약 기간 섹션 */}
                        <div>
                            <p className={rsvRegi.labels}>예약시작</p>
                            {/* 시작 날짜 */}
                            <DateForm
                                stateYear={startYear}
                                stateSetYear={setStartYear}
                                stateMonth={startMonth}
                                stateSetMonth={setStartMonth}
                                stateDay={startDay}
                                stateSetDay={setStartDay}
                            />

                            <span className={rsvRegi.spansapn}> - </span>
                            {/* 예약 시작 */}
                            <TimeForm
                                stateHour={rsvStartHour}
                                stateSetHour={setRsvStartHour}
                                stateMin={rsvStartMin}
                                stateSetMin={setRsvStartMin}
                            />


                        </div>

                        {/* 예약 시간 섹션 */}
                        <div>
                            <p className={rsvRegi.labels}>예약마감</p>
                            {/* 종료 날짜 */}
                            <DateForm
                                stateYear={endYear}
                                stateSetYear={setEndYear}
                                stateMonth={endMonth}
                                stateSetMonth={setEndMonth}
                                stateDay={endDay}
                                stateSetDay={setEndDay}
                            />
                            <span className={rsvRegi.spansapn}> - </span>
                            {/* 예약 종료 */}
                            <TimeForm
                                stateHour={rsvEndHour}
                                stateSetHour={setRsvEndHour}
                                stateMin={rsvEndMin}
                                stateSetMin={setRsvEndMin}
                            />
                        </div>

                    </section>
                </form>
            </div>
            {onModal && (
                <Modal text="값을 모두 선택해주세요" evnet={() => {
                    setOnModal(false)
                }} />

            )}
        </>
    );
}

export default ReservationForm;