import Header from "../../../components/common/Header";
import rsvInfo from "../../../css/admin/RsvInfo.module.css"
import ReservationInfo from "../../../components/admin/ReservationInfo";
import search from '../../../img/search.svg';
import ManageReserveHeader from "../../../components/admin/ManageReserveHeader";
import { useState, useEffect } from "react";
import { authAPI } from "../../../components/common/apiClient";
import scroll from "../../../css/common/scroll.module.css"

import sortUp from "../../../img/sort-up.svg"
import sortDown from "../../../img/sort-down.svg"
import ReservationsBookers from "./ReservatiosBookers";

function ManagerRsvInfo() {

    const [reservationUser, setReservationUser] = useState([])
    const [searchNickname, setSearchNickname] = useState("")
    const [sortBy, setSortBy] = useState("")
    const [seatNumSort, setSeatNumSort] = useState('asc')
    const [dateSort, setDateSort] = useState('asc')



    const [lectureData, setLectureData] = useState(null)

    const handleDeleteRow = (reservationId) => {
        setReservationUser((prev) =>
            prev.filter((user) => user.reservationId !== reservationId)
        );
    };

    const fetchReservationUser = async (id, currentSearch = searchNickname) => {
        if (!id) return;
        try {
            let response;
            if (currentSearch) {
                response = await authAPI.managerLectureRsvList(id, { nickname: currentSearch });
            } else {
                response = await authAPI.managerLectureRsvList(id);

            }
            setReservationUser(response.data);
        } catch (err) {
            console.error("강의 예약자 조회 실패: ", err);
        }
    };

    const togleSort = (setSort) => {
        setSort(prev => prev === 'asc' ? 'desc' : 'asc');
    }

    const sortList = async (id, currentSearch = searchNickname, sort, direction) => {

        try {
            let response;
            if (currentSearch) {
                response = await authAPI.managerLectureRsvList(id, { nickname: currentSearch, sortBy: sort, direction: direction });
            } else {
                response = await authAPI.managerLectureRsvList(id, { sortBy: sort, direction: direction });
            }

            setReservationUser(response.data)
        } catch (err) {

        }
    }

    useEffect(() => {

        if (sortBy !== "") {
            sortList(lectureData.lectureId, searchNickname, sortBy, sortBy === 'time' ? dateSort : sortBy === "seat" ? seatNumSort : "")
        }

    }, [sortBy, dateSort, seatNumSort])

    useEffect(() => {
        const lectureString = window.localStorage.getItem('lecture');

        if (lectureString) {
            const parsed = JSON.parse(lectureString);
            setLectureData(parsed);


            fetchReservationUser(parsed.lectureId, searchNickname);
        }
    }, [searchNickname]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        fetchReservationUser(lectureData.lectureId, searchNickname);
    };








    return (
        <div className={scroll.scroll}>
            <Header />
            <ManageReserveHeader page={"reservation"} />


            <section className={scroll.scroll_section}>
                <div className={rsvInfo.sub_title}>
                    <p>예약자 정보</p>
                    <form className={rsvInfo.search_div} onSubmit={handleSearch}>
                        <input
                            placeholder="예약자 성함"
                            value={searchNickname}
                            onChange={(e) => { setSearchNickname(e.target.value) }} />
                        <button type="submit"><img src={search} /></button>
                    </form>
                </div>

                <ReservationsBookers setSortBy={setSortBy} togleSort={togleSort} reservationUser={reservationUser} />

            </section>



        </div>
    )
}

export default ManagerRsvInfo;