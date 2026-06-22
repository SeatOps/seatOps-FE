import Navigation from '../common/Navigate';
import classC from '../../css/main/ClassCt.module.css';
import { authAPI } from '../common/apiClient';
import { useState } from 'react';
import { useDayOfWeek } from '../../hooks/useDayOfWeek';
import { useNavigate } from 'react-router-dom';
import useModal from '../../hooks/useModal';
import TwoButtonModal from '../common/TwoButtonModal';

function ClassCtWeb2({ reservationData, onSuccess }) {

    const navigate = useNavigate();
    const { reservationpg } = Navigation();

    const {
        lectureId,
        reservationId,
        subjectName,
        instructorName,
        classroomName,
        mySeatNumber,
        startTime,
        endTime,
        reservationCloseAt,
        reservationOpenAt,
        reservedSeats,
        totalSeats
    } = reservationData || {};

    const navigateToEdit = (lectureId, reservationId, mySeatNumber) => {
        navigate('/reservationedit', {
            state: {
                lectureId,
                reservationId,
                mySeatNumber
            }
        });
    };
    const dayOfWeek = useDayOfWeek(startTime.slice(0, 10));

    const monthDate = startTime.slice(5, 7).replace('0', '')

    const dayDate = startTime.slice(8, 10) || "";
    const time = startTime.slice(11, 16) || "";

    const classStartTime = startTime.replace('T', ' ').slice(0, 11)

    const reservationOpen = reservationOpenAt.replace('T', ' ').slice(0, 16)
    const reservationClose = reservationCloseAt.replace('T', ' ').slice(0, 16)
    const seat = mySeatNumber.slice(5, 8)
    const formatseat = String(seat).padStart(3, '0');
    const end = endTime.slice(11, 16) || "";

    //예약 취소 연동
    const deleteSeat = async () => {
        try {
            const id = reservationId;

            await authAPI.deleteMySeat(id);
            onSuccess();
            modal.closeModal();

        } catch (err) {
            console.error("취소 실패:", err);
        }
    };

    const modal = useModal(deleteSeat);

    return (
        <div className={classC.class_ct_web}>
            <div className={classC.date_time_ct_web}>
                <p className={classC.class_seat_web}>{formatseat}번</p>
                <p>{time}</p>
                <p className={classC.end_time}>~{end}</p>
            </div>
            <div>
                <p className={classC.class_infos_web}>{instructorName} | {classroomName} | 수업일: {classStartTime}({dayOfWeek})</p>
                <p className={classC.class_name_web}>{subjectName}</p>
                <p className={classC.class_book_web}>예약 기간: {reservationOpen}~{reservationClose}</p>
            </div>
            <div className={classC.two_button_ct}>
                <button
                    onClick={() => navigateToEdit(lectureId, reservationId, mySeatNumber)}
                >
                    변경하기
                </button>
                <button onClick={modal.openModal}>취소하기</button>
            </div>
            <TwoButtonModal isModal={modal.isModal} closeModal={modal.closeModal} activeModal={modal.activeModal} noneActiveModal={modal.noneActiveModal} text={"취소하시겠습니까?\n취소 후엔 수업을 다시 예약해야 합니다."} />

        </div>
    );
}

export default ClassCtWeb2;