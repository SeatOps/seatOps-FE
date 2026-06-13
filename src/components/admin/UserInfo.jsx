import { useState } from 'react';
import rsvInfo from "../../css/admin/RsvInfo.module.css"
import { authAPI } from '../common/apiClient';
import TwoBtnModal from './TwoBtnModal';
import Modal from '../common/Modal';

function UserInfo({ userInfo, onSuccess }) {
    const [isModal, setIsModal] = useState(false);
    const [onModal, setOnModal] = useState(false)
    const [errModal, setErrModal] = useState(false);
    const closeModal = () => {
        setIsModal(false);
    }


    const {
        userId,
        username,
        nickname,
        email,
        attendanceNumber,
        parentPhoneNumber,
        createdDate,
        rowNum
    } = userInfo;

    const createdAt1 = createdDate.replaceAll('-', '.');
    const createdAt2 = createdAt1.replace('T', ' ');
    const createdAt = createdAt2.slice(0, 16);

    const fetchUserDelete = async () => {
        try {
            const targetUserId = userId;
            await authAPI.managerDeleteUser(targetUserId)
            setOnModal(true)
        } catch (err) {
            console.error("회원 삭제 실패:", err)
            if (err.response.status === 500) {
                setIsModal(false)
                setErrModal(true)
            }
        }
    }



    return (
        <div className={rsvInfo.infos}>
            <div>
                <p className={rsvInfo.info_1}>{rowNum}</p>
                <p className={rsvInfo.info_1_2}>{attendanceNumber}</p>
                <p className={rsvInfo.info_1_2}>{nickname}</p>
                <p className={rsvInfo.info_2}>{parentPhoneNumber}</p>
                <p className={rsvInfo.info_2}>{createdAt}</p>
                <p className={rsvInfo.info_1_6}>{username}</p>
                <div className={rsvInfo.info_1_btn}>
                    <button className={rsvInfo.btn} onClick={() => (setIsModal(true))}>삭제하기</button>
                </div>
            </div>
            {isModal === true && (
                <TwoBtnModal text={`정말로 회원 삭제를 진행하시겠습니까? \n 삭제 시 계정 및 관련 정보는 복구할 수 없습니다.`} btn1T="네" btn2T="아니오" btn1E={fetchUserDelete} btn2E={closeModal} />
            )}
            {onModal === true && (
                <Modal text='삭제되었습니다.' event={() => {
                    setOnModal(false);
                    onSuccess();
                }} />
            )}
            {errModal === true && (
                <Modal text={`해당 계정으로 예약된 강의가 있습니다.\n취소 후 삭제해주세요.`} event={() => {
                    setErrModal(false);
                }} />
            )}
        </div>
    )
}

export default UserInfo;