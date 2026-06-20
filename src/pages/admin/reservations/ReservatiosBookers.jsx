import rsvInfo from "../../../css/admin/RsvInfo.module.css"


function ReservationsBookers({ setSortBy, togleSort, reservationUser }) {
    //SetDateSort, setSeatNumSort 받아와야함 다른 정렬있는 페이지들도 마찬가지
    return (
        <div className={`${rsvInfo.reservations_ct}`}>
            <div className={rsvInfo.top}>
                <p className={rsvInfo.info_0_9}>예약자</p>
                <div className={rsvInfo.info_1}>
                    <p>자리번호</p>
                    <button onClick={() => {
                        setSortBy("seat");
                        togleSort(setSeatNumSort);
                    }}>
                        <img src={seatNumSort === 'asc' ? sortUp : sortDown} />
                    </button>
                </div>
                <p className={rsvInfo.info_1}>출결번호</p>
                <p className={rsvInfo.info_1_7}>학부모 전화번호</p>
                <div className={rsvInfo.info_1_9}>
                    <p>예약일시</p>
                    <button onClick={() => {
                        setSortBy("time");
                        togleSort(setDateSort);
                    }}>
                        <img src={dateSort === 'asc' ? sortUp : sortDown} />
                    </button>
                </div>
                <p className={rsvInfo.info_2_1}></p>
                <p className={rsvInfo.info_1_4}></p>
            </div>


            {reservationUser.map((data) => (
                <ReservationInfo
                    key={data.reservationId}
                    reservationData={data}
                    lectureId={lectureData.lectureId}
                    onDelete={handleDeleteRow}
                    isFinished={lectureData.isFinished}
                />
            ))}

        </div>
    )
}

export default ReservationsBookers;