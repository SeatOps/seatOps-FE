function ReservationDateSelector({ calenderInfo, selectedDay, setSelectedDay, classData, setSelectLectureId, setSelectData }) {
    //클릭값 가져오기
    const clickDate = (day) => {

        setSelectedDay(day)
        const selectClassDate = classData.filter((classTime) => {
            const lectureDay = Number(classTime.startTime.slice(8, 10));

            return lectureDay === day;
        });
        setSelectLectureId("")


        setSelectData(selectClassDate);
    }

    return (
        <section className={classA.select_date_ct}>
            <p>날짜</p>
            <div>
                {calenderInfo.map((i, index) => (
                    <Dates
                        key={index}
                        month={i.month}
                        day={i.date}
                        clickDate={() => clickDate(i.date)}
                        isSelected={selectedDay === i.date} />
                ))}

            </div>
        </section>
    )
}

export default ReservationDateSelector;