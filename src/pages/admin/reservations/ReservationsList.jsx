import ClassCtManage from "../../../components/admin/ClassCtManage";
import rsvRegiInfo from "../../../css/admin/RsvRegiInfo.module.css";


function ReservationsList({ lectureList }) {
    return (
        <div className={rsvRegiInfo.class_ct}>
            {lectureList.length > 0 ? (
                lectureList.map((lecture) => (
                    <ClassCtManage key={lecture.lectureId} lectureData={lecture} />
                ))
            ) : (
                <p>등록된 예약 정보가 없습니다.</p>
            )}
        </div>
    )
}