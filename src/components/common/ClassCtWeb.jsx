import Navigation from './Navigate';

// src/components/ClassCtWeb.jsx
import classC from '../../css/main/ClassCt.module.css';
import { useDayOfWeek } from '../../hooks/useDayOfWeek';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import { authAPI } from './apiClient';
import { useAdmin } from '../../hooks/useAdmin';


function ClassCtWeb({ lectureData, btnText, click }) {
  const isAdmin = useAdmin();
  const [isModal, setIsModal] = useState(false)
  const [onModal, setOnModal] = useState(false)
  const { reservationpg } = Navigation();

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

  const monthDate = startTime.slice(5, 7).replace('0', '')
  const dayDate = startTime.slice(8, 10)
  const time = startTime.slice(11, 16)

  const classStartTime = startTime.replace('T', ' ').slice(0, 16)

  const reservationOpen = reservationOpenAt.replace('T', ' ').slice(0, 16)
  const reservationClose = reservationCloseAt.replace('T', ' ').slice(0, 16)


  return (
    <div className={classC.class_ct_web}>
      <div className={classC.date_time_ct_web}>
        <p>{monthDate}.{dayDate}({dayOfWeek})</p>
        <p>{time}</p>
      </div>
      <div>
        <p className={classC.class_infos_web}>{instructorName} | {classroomName} | 수업일:{classStartTime}</p>
        <p className={classC.class_name_web}>{subjectName}</p>
        <p className={classC.class_book_web}>예약 기간: {reservationOpen}~{reservationClose}</p>
      </div>
      <button onClick={() => {
        if (reservationStatus === "OPEN" && !isAdmin) {
          if (isReserved === false) {
            reservationpg(lectureId)
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
      }}>{btnText}</button>

      {isModal === true && (
        <Modal text="이미 예약한 강의 입니다." event={() => {
          setIsModal(false)
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
  );
}

export default ClassCtWeb;