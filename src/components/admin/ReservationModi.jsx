import rsvRegi from "../../css/admin/RsvRegi.module.css";
import { useState, useEffect } from 'react';
import { authAPI } from '../common/apiClient';
import TimeForm from "./TimeForm";
import DateForm from "./DateForm";
import HeadSub from '../../css/common/HeaderSub.module.css';
import Navigation from "../common/Navigate";

function ReservationModi() {
    const now = new Date();
    const currentYear = now.getFullYear();

    const [lectureId, setLectureId] = useState("");

    const { reservationmedit, moveclassinfo } = Navigation();

    // 리스트 상태
    const [instructorList, setInstructorList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [classroomList, setClassroomList] = useState([]);

    // 선택된 값 상태
    const [instructor, setInstructor] = useState("");
    const [subject, setSubject] = useState("");
    const [classroom, setClassroom] = useState("");

    // 날짜 및 시간 상태
    const [classYear, setClassYear] = useState(currentYear);
    const [classMonth, setClassMonth] = useState(now.getMonth() + 1);
    const [classDay, setClassDay] = useState(now.getDate());

    const [startYear, setStartYear] = useState(currentYear);
    const [startMonth, setStartMonth] = useState(now.getMonth() + 1);
    const [startDay, setStartDay] = useState(now.getDate());

    const [endYear, setEndYear] = useState(currentYear);
    const [endMonth, setEndMonth] = useState(now.getMonth() + 1);
    const [endDay, setEndDay] = useState(now.getDate());

    const [startHour, setStartHour] = useState("00");
    const [startMin, setStartMin] = useState("00");
    const [endHour, setEndHour] = useState("00");
    const [endMin, setEndMin] = useState("00");

    const [rsvStartHour, setRsvStartHour] = useState("00");
    const [rsvStartMin, setRsvStartMin] = useState("00");
    const [rsvEndHour, setRsvEndHour] = useState("00");
    const [rsvEndMin, setRsvEndMin] = useState("00");

    // 강의 조회 데이터 상태
    const [classInfo, setClassInfo] = useState(null);

    // [수정] 데이터를 인자로 받아 안전하게 세팅하는 함수
    const valueSetting = (data) => {
        if (!data) return;

        const {
            classroomId,
            instructorId,
            subjectId,
            startTime,
            endTime,
            reservationOpenAt,
            reservationCloseAt,
        } = data;

        const dateChange = (date, setYear, setMonth, setDay) => {
            if (date && typeof date === 'string') {
                setYear(date.slice(0, 4));
                setMonth(date.slice(5, 7));
                setDay(date.slice(8, 10));
            }
        };

        const timeChange = (time, setHour, setMin) => {
            if (time && typeof time === 'string') {
                setHour(time.slice(11, 13));
                setMin(time.slice(14, 16));
            }
        };

        dateChange(startTime, setClassYear, setClassMonth, setClassDay);
        dateChange(reservationOpenAt, setStartYear, setStartMonth, setStartDay);
        dateChange(reservationCloseAt, setEndYear, setEndMonth, setEndDay);

        timeChange(startTime, setStartHour, setStartMin);
        timeChange(endTime, setEndHour, setEndMin);
        timeChange(reservationOpenAt, setRsvStartHour, setRsvStartMin);
        timeChange(reservationCloseAt, setRsvEndHour, setRsvEndMin);

        setInstructor(instructorId);
        setSubject(subjectId);
        setClassroom(classroomId);
    };

    // [수정] 리스트 정렬 후 상태 업데이트
    const filterAndSetList = (list, targetId, setList, setData) => {
        if (!list || list.length === 0) return;
        const sortedData = [
            ...list.filter(item => item.id === targetId || item.classroomId === targetId), // 강의실은 id가 classroomId일 수 있음
            ...list.filter(item => item.id !== targetId && item.classroomId !== targetId)
        ];
        setList(sortedData);
        setData(sortedData[0].id);
        console.log(sortedData[0].id)
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. 기초 정보(강사, 과목, 강의실) 먼저 로드
                const [resInstructors, resSubjects, resClassrooms] = await Promise.all([
                    authAPI.instructorsAdd(),
                    authAPI.subjectsAdd(),
                    authAPI.classroomsAdd()
                ]);

                let currentInstList = resInstructors.data;
                let currentSubList = resSubjects.data;
                let currentRoomList = resClassrooms.data;

                // 2. localStorage에서 강의 ID 확인 후 상세 정보 로드
                const lectureString = window.localStorage.getItem('lecture');
                if (lectureString) {
                    const parsedData = JSON.parse(lectureString);
                    const response = await authAPI.checkLectureInfo(parsedData.lectureId);
                    setLectureId(parsedData.lectureId);
                    const info = response.data;

                    setClassInfo(info);
                    valueSetting(info); // 상세 정보로 입력 필드 채우기

                    // 3. 받아온 상세 정보의 ID를 기준으로 리스트 재정렬
                    filterAndSetList(currentInstList, info.instructorId, setInstructorList, setInstructor);
                    filterAndSetList(currentSubList, info.subjectId, setSubjectList, setSubject);
                    filterAndSetList(currentRoomList, info.classroomId, setClassroomList, setClassroom);
                } else {
                    setInstructorList(currentInstList);
                    setSubjectList(currentSubList);
                    setClassroomList(currentRoomList);
                }
            } catch (err) {
                console.error("데이터 로딩 실패:", err);
            }
        };

        fetchData();
    }, []);

    const nextLectureModi = () => {
        const startTime = `${classYear}-${classMonth}-${classDay}T${startHour}:${startMin}:00`;
        const endTime = `${classYear}-${classMonth}-${classDay}T${endHour}:${endMin}:00`;
        const reservationOpenAt = `${startYear}-${startMonth}-${startDay}T${rsvStartHour}:${rsvStartMin}:00`;
        const reservationCloseAt = `${endYear}-${endMonth}-${endDay}T${rsvEndHour}:${rsvEndMin}:00`;
        const selectedRoom = classroomList.find((room) => String(room.id) === String(classroom));
        const requestData = {
            lectureId: lectureId,
            classroomId: classroom,
            instructorId: instructor,
            subjectId: subject,
            startTime,
            endTime,
            reservationOpenAt,
            reservationCloseAt,
            classroomNum: selectedRoom ? selectedRoom.classroomNum : ""
        };

        return requestData;
    };

    return (
        <>
            <div className={HeadSub.sub_title}>
                <p>강의 수정</p>
                <div>
                    <button
                        className={rsvRegi.prev_btn}
                        onClick={() => {
                            moveclassinfo()
                        }}>이전</button>
                    <button onClick={() => {
                        const data = nextLectureModi();
                        reservationmedit(data);
                    }}>다음</button>
                </div>
            </div>
            <div className={rsvRegi.class_form}>
                <form className={rsvRegi.reservation_form} onSubmit={(e) => e.preventDefault()}>
                    <section className={rsvRegi.select_top}>
                        <div>
                            <label className={rsvRegi.labels} htmlFor="subject">과목명</label>
                            <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
                                {subjectList.map((sub) => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={rsvRegi.labels} htmlFor="lecturer">강사</label>
                            <select id="lecturer" value={instructor} onChange={(e) => setInstructor(e.target.value)}>
                                {instructorList.map((inst) => (
                                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={rsvRegi.labels} htmlFor="classroom">강의실</label>
                            <select id="classroom" value={classroom} onChange={(e) => setClassroom(e.target.value)}>
                                {classroomList.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.classroomNum} {room.totalSeat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </section>

                    <section className={rsvRegi.select_bottom}>
                        <div>
                            <p className={rsvRegi.labels}>수업날짜</p>
                            <DateForm
                                stateYear={classYear} stateSetYear={setClassYear}
                                stateMonth={classMonth} stateSetMonth={setClassMonth}
                                stateDay={classDay} stateSetDay={setClassDay}
                            />
                        </div>
                        <div>
                            <p className={rsvRegi.labels}>수업시간</p>
                            <TimeForm stateHour={startHour} stateSetHour={setStartHour} stateMin={startMin} stateSetMin={setStartMin} />
                            <span className={rsvRegi.spansapn}> - </span>
                            <TimeForm stateHour={endHour} stateSetHour={setEndHour} stateMin={endMin} stateSetMin={setEndMin} />
                        </div>
                        <div className={rsvRegi.gray_line}></div>
                        <div>
                            <p className={rsvRegi.labels}>예약시작</p>
                            <DateForm
                                stateYear={startYear} stateSetYear={setStartYear}
                                stateMonth={startMonth} stateSetMonth={setStartMonth}
                                stateDay={startDay} stateSetDay={setStartDay}
                            />
                            <span className={rsvRegi.spansapn}> - </span>
                            <TimeForm stateHour={rsvStartHour} stateSetHour={setRsvStartHour} stateMin={rsvStartMin} stateSetMin={setRsvStartMin} />


                        </div>
                        <div>
                            <p className={rsvRegi.labels}>예약마감</p>
                            <DateForm
                                stateYear={endYear} stateSetYear={setEndYear}
                                stateMonth={endMonth} stateSetMonth={setEndMonth}
                                stateDay={endDay} stateSetDay={setEndDay}
                            />
                            <span className={rsvRegi.spansapn}> - </span>
                            <TimeForm stateHour={rsvEndHour} stateSetHour={setRsvEndHour} stateMin={rsvEndMin} stateSetMin={setRsvEndMin} />
                        </div>
                    </section>
                </form>
            </div>
        </>
    );
}

export default ReservationModi;