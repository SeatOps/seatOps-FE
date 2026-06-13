import classC from '../../css/main/ClassCt.module.css';
import Navigation from '../common/Navigate';
import { useDayOfWeek } from '../../hooks/useDayOfWeek';
import Modal from '../common/Modal';
import { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';



function ClassCtApply({ lectureData, setSelectLectureId, selectLectureId }) {
    const isAdmin = useAdmin();

    const [isModal, setIsModal] = useState(false)
    const [onModal, setOnModal] = useState(false)


    const {
        lectureId,
        classroomName,
        instructorName,
        subjectName,
        startTime,
        endTime,
        reservationOpenAt,
        reservationCloseAt,
        totalSeats,
        reservedSeats,
        isReserved,
        reservationStatus
    } = lectureData;

    const dayOfWeek = useDayOfWeek(startTime.slice(0, 10));

    const date = startTime.slice(5, 10).replace('-', ".").replaceAll("0", "")

    const start = startTime.slice(11, 16)
    const end = endTime.slice(11, 16)
    const reservationOpen = reservationOpenAt.replace('T', ' ').slice(2, 16).replaceAll('-', '.')
    const reservationClose = reservationCloseAt.replace('T', ' ').slice(2, 16).replaceAll('-', '.')

    return (
        <div className={`${classC.class_ct} ${selectLectureId === lectureId ? classC.select_class_ct : ''}`} onClick={() => {

            if (reservationStatus === "OPEN" && !isAdmin) {
                if (isReserved === false) {
                    setSelectLectureId(lectureId)
                } else {
                    setIsModal(true)
                }
            } else if (reservationStatus === "NOT_OPEN_YET" && !isAdmin) {
                setOnModal(true)
            } else if (reservationStatus === "CLOSED" && !isAdmin) {
                setOnModal(true)
            } else (
                console.log("관리자")
            )
        }}>
            <div className={`${classC.class_time} ${selectLectureId === lectureId ? classC.select_class_time : ''}`}>
                <p className={classC.start_t}>{start}</p>
                <p className={classC.ent_t}>~{end}</p>
                <div className={`${classC.can_seat} ${selectLectureId === lectureId ? classC.select_can_seat : ''}`}>
                    <p>{reservedSeats}</p><p>|</p><p>{totalSeats}</p>
                </div>            </div>
            <div className={classC.class_info}>
                <p>{instructorName} | {classroomName} | {date}({dayOfWeek})</p>
                <p>{subjectName}</p>
                <p className={classC.blue_p}>예약 기간: {reservationOpen}~{reservationClose}</p>

            </div>
            {isModal === true && (
                <Modal text="이미 예약한 강의 입니다." event={() => {
                    setIsModal(false);
                }} />
            )
            }
            {onModal === true && (
                <Modal text="예약 가능 시간이 아닙니다." event={() => {
                    setOnModal(false)
                }} />
            )
            }
        </div>
    )
}

export default ClassCtApply;