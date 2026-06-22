import rsvInfo from "../../css/admin/RsvInfo.module.css"
import useModal from "../../hooks/useModal";
import { authAPI } from '../common/apiClient';
import TwoButtonModal from "../common/TwoButtonModal";
import { useState } from "react";

function AcessInfo({ userInfo, onSuccess }) {
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

    const modal = useModal(fetchAcessRefusal);




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
                    <button className={rsvInfo.btn} onClick={modal.openModal}>승인거절</button>
                </p>
                <div className={rsvInfo.info_1_btn}>
                    <button className={rsvInfo.btn} onClick={() => (fetchAcessUser())}>승인하기</button>
                </div>
            </div>
            <TwoButtonModal isModal={modal.isModal} closeModal={modal.closeModal} activeModal={modal.activeModal} noneActiveModal={modal.noneActiveModal} text={`${nickname}님의 반려하시겠습니까?`} />
        </div>

    )
}

export default AcessInfo;