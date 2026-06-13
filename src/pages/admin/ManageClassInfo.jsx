import rsvRegi from '../../css/admin/RsvRegi.module.css'
import DateShow from '../../components/admin/DateShow';
import TimeShow from '../../components/admin/TimeShow';
import Header from '../../components/common/Header';
import { useState, useEffect } from 'react';
import { authAPI } from '../../components/common/apiClient';
import HeadSub from '../../css/common/HeaderSub.module.css';
import Navigation from '../../components/common/Navigate';
import ManageReserveHeader from "../../components/admin/ManageReserveHeader";
import scroll from "../../css/common/scroll.module.css"


function ManageClassInfo() {

    const { movemanageclassmodi, movereservationRegiInfo } = Navigation();

    const [classInfo, setClassInfo] = useState(null);
    const [lectureData, setLectureData] = useState(null);

    useEffect(() => {
        const lectureString = window.localStorage.getItem('lecture');

        if (lectureString) {
            const parsedData = JSON.parse(lectureString);
            setLectureData(parsedData);

            const fetchClassInfo = async (id) => {
                try {
                    const response = await authAPI.checkLectureInfo(id);
                    setClassInfo(response.data);
                } catch (err) {
                    console.log('강의 세부 조회 실패: ', err);
                }
            };

            fetchClassInfo(parsedData.lectureId);
        }
    }, []);

    if (!classInfo) {
        return (
            <>
                <Header />
                <div style={{ padding: '20px', textAlign: 'center' }}>데이터를 불러오는 중입니다...</div>
            </>
        );
    }

    return (
        <div className={scroll.scroll}>
            <Header />
            <ManageReserveHeader page={"reservation"} />
            <section className={scroll.scroll_section}>
                <div className={HeadSub.sub_title}>
                    <p>강의 조회</p>
                    <div>
                        <button
                            type="button"
                            className={rsvRegi.prev_btn}
                            onClick={() => {
                                movereservationRegiInfo()
                            }}>이전</button>
                        <button type="button" onClick={movemanageclassmodi}>수정하기</button>
                    </div>
                </div>
                <div className={rsvRegi.class_form}>
                    <div className={rsvRegi.reservation_form}>
                        <section className={rsvRegi.select_top}>
                            <div>
                                <label className={rsvRegi.labels}>과목명</label>
                                <p className={rsvRegi.showP}>{classInfo.subjectName}</p>
                            </div>
                            <div>
                                <label className={rsvRegi.labels}>강사</label>
                                <p className={rsvRegi.showP}>{classInfo.instructorName}</p>
                            </div>
                            <div>
                                <label className={rsvRegi.labels}>강의실</label>
                                <p className={rsvRegi.showP}>
                                    {classInfo.classroomName} ({classInfo.totalSeats}명)
                                </p>
                            </div>
                        </section>

                        <section className={rsvRegi.select_bottom}>
                            <div>
                                <p className={rsvRegi.labels}>수업날짜</p>
                                <DateShow classInfo={classInfo.startTime} />
                            </div>
                            <div>
                                <p className={rsvRegi.labels}>수업시간</p>
                                <TimeShow classInfo={classInfo.startTime} />
                                <span className={rsvRegi.spansapn}> - </span>
                                <TimeShow classInfo={classInfo.endTime} />
                            </div>

                            <div className={rsvRegi.gray_line}></div>

                            <div>
                                <p className={rsvRegi.labels}>예약시작</p>
                                <DateShow classInfo={classInfo.reservationOpenAt} />
                                <span className={rsvRegi.spansapn}> - </span>
                                <TimeShow classInfo={classInfo.reservationOpenAt} />

                            </div>
                            <div>
                                <p className={rsvRegi.labels}>예약마감</p>
                                <DateShow classInfo={classInfo.reservationCloseAt} />
                                <span className={rsvRegi.spansapn}> - </span>
                                <TimeShow classInfo={classInfo.reservationCloseAt} />
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ManageClassInfo;