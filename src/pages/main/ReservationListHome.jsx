function ReservationListHome({ classData }) {
    return (
        <section className={hom.home_bottom}>
            <div className={hom.gray_hr}>
                <div>수강정보</div>
            </div>
            <div className={hom.class_apply_app_ct}>
                {classData.map((lecture) => (
                    <ClassCt
                        key={lecture.lectureId}
                        lectureData={lecture}
                    />
                ))}
            </div>
            <div className={hom.class_apply_web_ct}>
                {classData.map((lecture) => (
                    <ClassCtWeb
                        key={lecture.lectureId}
                        lectureData={lecture}
                        btnText="신청하기"
                    />
                ))}
            </div>
        </section>
    )
}

export default ReservationListHome;