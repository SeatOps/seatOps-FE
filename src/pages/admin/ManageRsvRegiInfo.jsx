import Header from "../../components/common/Header";
import ManageHeaderSub from "../../components/admin/ManageHeaderSub";
import rsvRegiInfo from "../../css/admin/RsvRegiInfo.module.css";
import ClassCtManage from "../../components/admin/ClassCtManage";
import ManageReserveHeader from "../../components/admin/ManageReserveHeader";
import { useEffect, useState } from "react"; // ⭐️ useState 훅을 가져옵니다.
import Navigation from "../../components/common/Navigate";
import { authAPI } from "../../components/common/apiClient";
import Pagination from "../../components/admin/Pagination";
import scroll from "../../css/common/scroll.module.css";
import { useLocation } from "react-router-dom";
import Pagination2 from "../../components/admin/Pagination2";


function ManagerRsvRegiInfo() {
    const location = useLocation();
    const { movereservationRegi } = Navigation();

    const [lectureList, setLectureList] = useState([]);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState()
    const [noAdmin, setNoAdmin] = useState(false);
    const [pages, setPages] = useState({})



    useEffect(() => {
        const fetchManageLectures = async () => {

            try {
                const response = await authAPI.managerLectureList(page);
                setNoAdmin(false)
                setLectureList(response.data.content);
                console.log(response.data.page)
                setTotalPages(response.data.page.totalPages)
                console.log(response.data.page.totalPages)
                setPages(response.data.page)
            } catch (err) {
                console.log("예약 조회 실패:", err)
                if (err.status === 401) {
                    setNoAdmin(true)
                }
            }
        }

        fetchManageLectures();
    }, [page, location.key])


    return (
        <div className={scroll.scroll}>
            <Header />
            {noAdmin ? (
                <div className={rsvRegiInfo.no_admin}>
                    <p >관리자 페이지에 접근할 권한이 없습니다.</p>
                </div>
            ) : (
                <>
                    <ManageReserveHeader page={"reservation"} />
                    <section className={scroll.scroll_section}>
                        <ManageHeaderSub text="예약등록정보" button="등록하기" onButtonClick={movereservationRegi} />
                        <div className={rsvRegiInfo.class_ct}>
                            {lectureList.length > 0 ? (
                                lectureList.map((lecture) => (
                                    <ClassCtManage key={lecture.lectureId} lectureData={lecture} />
                                ))
                            ) : (
                                <p>등록된 예약 정보가 없습니다.</p>
                            )}
                        </div>



                        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
                        {/* <Pagination2 page={page} setPage={setPage} pages={pages} /> */}
                    </section>
                </>
            )}


        </div>
    )
}

export default ManagerRsvRegiInfo;