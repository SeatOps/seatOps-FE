import classC from '../../css/main/ClassCt.module.css';
import Navigation from '../common/Navigate';
import { useDayOfWeek } from '../../hooks/useDayOfWeek';


function ClassCtMy({ reservationData, nickname }) {
    const { movemyclassinfo } = Navigation();

    const {
        reservationId,
        subjectName,
        instructorName,
        lectureId,
        classroomName,
        mySeatNumber,
        startTime,
        endTime,
        reservationCloseAt,
        reservationOpenAt,
        reservedSeats,
        totalSeats,
    } = reservationData || {};

    const dayOfWeek = useDayOfWeek(startTime.slice(0, 10));

    const startDate = startTime?.slice(2, 10).replaceAll('-', '.') || "";
    const start = startTime?.slice(11, 16) || "";
    const end = endTime?.slice(11, 16) || "";
    const seat = mySeatNumber?.slice(5, 8) || "";
    const formatseat = String(seat).padStart(3, '0');
    const reservationOpen = reservationOpenAt.replace('T', ' ').slice(2, 16).replaceAll('-', '.')
    const reservationClose = reservationCloseAt.replace('T', ' ').slice(2, 16).replaceAll('-', '.')


    const sendData = () => {
        const classData = {
            reservationId: reservationId,
            lectureId: lectureId,
            subjectName: subjectName,
            instructorName: instructorName,
            classroomName: classroomName,
            seat: seat,
            start: start,
            end: end,
            startDate: startTime?.slice(5, 10),
            dayOfWeek: dayOfWeek
        };



        const classString = JSON.stringify(classData);
        window.localStorage.setItem('class', classString);
    };

    return (
        <div className={classC.class_ct} onClick={() => {
            sendData();
            movemyclassinfo(nickname);

        }}>
            <div className={classC.class_time}>
                <p className={classC.seat_num}>{formatseat}번</p>
                <p className={classC.start_time}>{start}</p>
                <p className={classC.ent_time}>~{end}</p>
                <div className={classC.can_seat}>
                    <p>{reservedSeats}</p><p>|</p><p>{totalSeats}</p>
                </div>
            </div>
            <div className={classC.class_info}>
                <p>{instructorName} | {classroomName} | 수업일: {startDate}({dayOfWeek})</p>
                <p>{subjectName}</p>
                <p className={classC.blue_p}>예약 기간: {reservationOpen}~{reservationClose}</p>

            </div>
        </div>
    );
}

export default ClassCtMy;
