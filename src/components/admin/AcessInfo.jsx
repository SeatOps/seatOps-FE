import rsvInfo from "../../css/admin/RsvInfo.module.css"
import { authAPI } from '../common/apiClient';
import TwoBtnModal from "./TwoBtnModal";
import { useState } from "react";

function AcessInfo({ userInfo, onSuccess }) {

    const [isModal, setIsModal] = useState(false);
    const closeModal = () => {
        setIsModal(false);
    }

    const {
        userId,
        username,
        nickname,
        attendanceNumber,
        parentPhoneNumber,
        createdDate,
        rowNum
    } = userInfo;

    const createdAt1 = createdDate.replaceAll('-', '.');
    const createdAt2 = createdAt1.replace('T', ' ');
    const createdAt = createdAt2.slice(0, 16);

    const fetchAcessUser = async () => {
        try {
            const id = userId;
            await authAPI.managerAcessUser(id)
            onSuccess();
        } catch (err) {
            console.error("회원 승인 실패:", err)
        }
    }


    const fetchAcessRefusal = async () => {
        try {
            const id = userId;
            await authAPI.managerAcessRefusal(id)
            onSuccess();
        } catch (err) {
            console.error("회원 승인 거절 실패:", err)
        }
    }



    return (
        <div className={rsvInfo.infos}>
            <div>
                <p className={rsvInfo.info_0_8}>{rowNum}</p>

                <p className={rsvInfo.info_1_2}>{attendanceNumber}</p>
                <p className={rsvInfo.info_1_2}>{nickname}</p>
                <p className={rsvInfo.info_1_8}>{parentPhoneNumber}</p>
                <p className={rsvInfo.info_1_8}>{createdAt}</p>
                <p className={rsvInfo.info_1_2}>{username}</p>
                <p className={rsvInfo.info_1}>
                    <button className={rsvInfo.btn} onClick={() => (setIsModal(true))}>승인거절</button>
                </p>
                <div className={rsvInfo.info_1_btn}>
                    <button className={rsvInfo.btn} onClick={() => (fetchAcessUser())}>승인하기</button>
                </div>
            </div>

            {isModal === true && (
                <TwoBtnModal text={`${nickname}님의 승인을 거절하시겠습니까?`} btn1T="네" btn2T="아니오" btn1E={fetchAcessRefusal} btn2E={closeModal} />
            )}
        </div>

    )
}

export default AcessInfo;