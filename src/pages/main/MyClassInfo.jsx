function MyClassInfo({ NoneClass, blockClass, moveclassaply, date, time, seatNum, myClassData, movemypage }) {
    return (
        <div className={hom.my_class}>
            <div className={hom.my_class_top}>
                <p>내 강의 확인</p>
            </div>

            {/* 강의 정보 없음 */}
            <div className={`${NoneClass} ${hom.none_class}`}>
                <p>강의 정보가 없습니다.</p>
                <button onClick={moveclassaply}>강의 신청 바로가기</button>
            </div>

            {/* 강의 정보 있음 */}
            <div className={`${hom.my_class_info} ${blockClass}`}>
                <div className={hom.date_time_ct}>
                    <p>{date}</p>
                    <p>{time}</p>
                    <div className={hom.gray_line}></div>
                    <p className={hom.seat_num}>{seatNum}번</p>
                </div>
                <div className={hom.class_info_div}>
                    <div className={hom.gray_ct}>수업명</div>
                    <p>
                        {myClassData.subjectName}
                    </p>
                </div>
                <div>
                    <div className={hom.gray_ct}>강사</div>
                    <p>{myClassData.instructorName}</p>
                </div>
                <button onClick={movemypage}>강의 정보 확인하기</button>
            </div>
        </div>
    )
}

export default MyClassInfo;