function ReservationList({ selectData, setSelectLectureId, selectLectureId }) {
    return (
        <>
            {selectData.length > 0 ? (
                <section className={classA.classes_ct}>
                    {selectData.map((lecture) => (
                        <ClassCtApply
                            key={lecture.lectureId}
                            lectureData={lecture}
                            setSelectLectureId={setSelectLectureId}
                            selectLectureId={selectLectureId}
                        />
                    ))}
                </section>
            ) : (
                <p className={classA.classes_p}>해당 날짜에 등록된 강의가 없습니다.</p>
            )}
        </>
    )
}

export default ReservationList;