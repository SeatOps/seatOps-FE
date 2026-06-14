import rsvInfo from "../../css/admin/RsvInfo.module.css"

function ApprovalInfoBottom({ setSortBy, togleSort, handleDeleteUser, acessInfoList }) {
    return (
        <div className={rsvInfo.reservations_ct}>
            <div className={rsvInfo.top}>
                <p className={rsvInfo.info_0_8}>NO</p>
                <div className={rsvInfo.info_1_2}>
                    <p>출결번호</p>
                    <button onClick={() => {
                        setSortBy("attendance");
                        togleSort(setAttendanceSort);
                    }}>
                        <img src={attendanceSort === 'asc' ? sortUp : sortDown} />
                    </button>
                </div>
                <div className={rsvInfo.info_1_2}>
                    <p>학생이름</p>
                    <button onClick={() => {
                        setSortBy("name");
                        togleSort(setNameSort);
                    }}>
                        <img src={nameSort === 'asc' ? sortUp : sortDown} />
                    </button>
                </div>
                <p className={rsvInfo.info_1_8}>학부모 전화번호</p>
                <div className={rsvInfo.info_1_8}>
                    <p>가입일시</p>
                    <button onClick={() => {
                        setSortBy("date")
                        togleSort(setSignDateSort);
                    }}>
                        <img src={signDateSort === 'asc' ? sortUp : sortDown} />
                    </button>
                </div>
                <p className={rsvInfo.info_1_2}>학생ID</p>
                <p className={rsvInfo.info_1}></p>
                <p className={rsvInfo.info_1}></p>
            </div>
            {acessInfoList.map((data) => (
                <AcessInfo
                    key={data.userId}
                    userInfo={data}
                    onSuccess={() => handleDeleteUser(data.userId)}
                />
            ))}

        </div>
    )
}

export default ApprovalInfoBottom;