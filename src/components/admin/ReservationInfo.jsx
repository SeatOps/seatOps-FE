import { useState } from 'react';
import rsvInfo from "../../css/admin/RsvInfo.module.css"
import TwoBtnModal from './TwoBtnModal';
import { authAPI } from '../common/apiClient';
import { useNavigate } from 'react-router-dom'; // 추가

function ReservationInfo({ reservationData, lectureId, onDelete, isFinished }) {
    const [isModal, setIsModal] = useState(false);
    const [onModal, setOnModal] = useState(false);

    const navigate = useNavigate(); // 추가

    const clickModal = () => {
        setIsModal(true)
    }

    const closeModal = () => {
        setIsModal(false);
    }



    const {
        reservationId,
        userId,
        attendanceNumber,
        parentPhoneNumber,
        nickname,
        seatNumber,
        reservedAt
    } = reservationData;

    const seat = seatNumber.slice(5, 8)
    const reservationAt1 = reservedAt.replaceAll('-', '.');
    const reservationAt2 = reservationAt1.replace('T', ' ');
    const reservationAt = reservationAt2.slice(2, 16);


    // 자리 변경 핸들러 추가
    const handleChangeSeat = () => {
        navigate('/reservationeditadmin', { // ReservationEdit 경로로 이동
            state: {
                lectureId: lectureId,
                reservationId: reservationId,
                mySeatNumber: seatNumber // 전체 seatNumber 전달 (예: "601호-10")
            }
        });
    };

    const deleteRsvUser = async () => {
        try {
            const id = reservationId
            await authAPI.managerLectureUserDelete(id);
            closeModal();
            onDelete(id);
        } catch (err) {
            console.error("취소 실패:", err)
        }
    }

    return (
        <div className={rsvInfo.infos}>
            <div>
                <p className={rsvInfo.info_0_9}>{nickname}</p>
                <p className={rsvInfo.info_1}>{seat}</p>
                <p className={rsvInfo.info_1}>{attendanceNumber}</p>
                <p className={rsvInfo.info_1_7}>{parentPhoneNumber}</p>
                <p className={rsvInfo.info_1_9}>{reservationAt}</p>
                <div className={rsvInfo.info_2_1}>
                    {isFinished ? (<></>) : (<button className={rsvInfo.btn} onClick={() => { setOnModal(true) }}>자리 변경</button>)}

                </div>

                <div className={rsvInfo.info_1_4}>
                    {isFinished ? (<></>) : (<button className={rsvInfo.btn} onClick={clickModal}>예약 취소</button>)}

                </div>
            </div>
            {onModal === true && (
                <TwoBtnModal text={`${nickname} 님 자리를 변경하시겠습니까?`} btn1T="네" btn2T="아니오" btn1E={handleChangeSeat} btn2E={() => { setOnModal(false) }} />
            )}
            {isModal === true && (
                <TwoBtnModal text={`${nickname} 님 예약을 취소하시겠습니까?`} btn1T="네" btn2T="아니오" btn1E={deleteRsvUser} btn2E={closeModal} />
            )}
        </div>
    )
}

export default ReservationInfo;
