import Navigation from '../common/Navigate';
import classC from '../../css/main/ClassCt.module.css';
import { authAPI } from '../common/apiClient';
import { useDayOfWeek } from '../../hooks/useDayOfWeek';

function ClassCtManage({ lectureData }) {
    const { movereservationInfo, moveclassinfo } = Navigation();

    const {
        lectureId,
        subjectName,
        instructorName,
        classroomName,
        startTime,
        endTime, // 비교 대상
        reservationOpenAt,
        reservationCloseAt,
        totalSeats,
        reservedSeats,
        availableSeats,
        isFinished
    } = lectureData;

    const dayOfWeek = useDayOfWeek(startTime.slice(0, 10));


    const monthDate = startTime.slice(5, 7).replace('0', '')
    const dayDate = startTime.slice(8, 10)
    const time = startTime.slice(11, 16)

    const reservationOpen = reservationOpenAt.replace('T', ' ').slice(0, 16)
    const reservationClose = reservationCloseAt.replace('T', ' ').slice(0, 16)

    const sendData = () => {
        const lectureData = {
            lectureId: lectureId,
            isFinished: isFinished
        }
        const lectureString = JSON.stringify(lectureData);
        window.localStorage.setItem('lecture', lectureString);
    }

    return (
        /* ✅ isPast가 true일 경우 classC.gray_ct 클래스를 추가 */
        <div className={`${classC.class_ct_web} ${isFinished ? classC.gray_ct : ''}`}>
            <div className={classC.date_time_ct_web}>
                <p>{monthDate}.{dayDate}({dayOfWeek})</p>
                <p>{time}</p>
            </div>
            <div>
                <p className={classC.class_infos_web}>
                    {instructorName} | {classroomName} | 전체 좌석: {totalSeats} | 예약된 좌석: {reservedSeats}
                </p>
                <p className={classC.class_name_web}>{subjectName} </p>
                <p className={classC.class_book_web}>예약 기간: {reservationOpen}~{reservationClose}</p>
            </div>
            <div className={classC.two_button_ct_manage}>
                <button onClick={() => {
                    sendData();
                    movereservationInfo();
                }}>예약자 조회</button>
                <button onClick={() => {
                    sendData();
                    moveclassinfo();
                }}>강의 조회</button>
            </div>
        </div>
    );
}

export default ClassCtManage;