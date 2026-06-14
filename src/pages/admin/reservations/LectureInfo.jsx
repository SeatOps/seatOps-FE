import rsvRegi from '../../css/admin/RsvRegi.module.css'
import HeadSub from '../../css/common/HeaderSub.module.css';


function LectureInfo({ classInfo, movereservationRegiInfo, movemanageclassmodi }) {
    return (
        <>
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
        </>)
}

export default LectureInfo;