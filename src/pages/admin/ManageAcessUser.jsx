import Header from "../../components/common/Header";
import rsvInfo from "../../css/admin/RsvInfo.module.css"
import AcessInfo from "../../components/admin/AcessInfo";
import search from '../../img/search.svg'
import { useState } from "react";
import ManageReserveHeader from "../../components/admin/ManageReserveHeader";
import { useEffect } from "react";
import { authAPI } from "../../components/common/apiClient";
import scroll from "../../css/common/scroll.module.css"
import { useLocation } from "react-router-dom";

import sortUp from "../../img/sort-up.svg"
import sortDown from "../../img/sort-down.svg"

function ManageAcessUser() {
    const location = useLocation();

    const [sortBy, setSortBy] = useState("")
    const [nameSort, setNameSort] = useState('asc')
    const [attendanceSort, setAttendanceSort] = useState('asc')
    const [signDateSort, setSignDateSort] = useState('asc')
    const [acessInfoList, setAcessInfo] = useState([])
    const [searchNickname, setSearchNickname] = useState("");

    const handleDeleteUser = (userId) => {
        setAcessInfo((prevList) => prevList.filter(user => user.userId !== userId));
    };


    const fetchList = async (currentSearch = searchNickname) => {
        try {
            let response;
            if (currentSearch) {
                response = await authAPI.managerAcessUserList({ keyword: currentSearch });
            } else {
                response = await authAPI.managerAcessUserList();
            }

            setAcessInfo(response.data);
        } catch (err) {
            console.error("데이터 로드 실패:", err);
        }
    };

    const togleSort = (setSort) => {
        setSort(prev => prev === 'asc' ? 'desc' : 'asc');
    }

    const sortList = async (currentSearch = searchNickname, sort, direction) => {

        try {
            let response;
            if (currentSearch) {
                response = await authAPI.managerAcessUserList({ keyword: currentSearch, sortBy: sort, direction: direction });
            } else {
                response = await authAPI.managerAcessUserList({ sortBy: sort, direction: direction });
            }

            setAcessInfo(response.data)
        } catch (err) {

        }
    }


    useEffect(() => {

        if (sortBy !== "") {
            sortList(searchNickname, sortBy, sortBy === 'name' ? nameSort : sortBy === "date" ? signDateSort : sortBy === "attendance" ? attendanceSort : "")
        }

    }, [sortBy, nameSort, attendanceSort, signDateSort])


    useEffect(() => {

        fetchList(searchNickname);

    }, [searchNickname]);

    useEffect(() => {
        setSearchNickname("");
        setSortBy("");
        fetchList("");
    }, [location.key]);



    const handleSearch = (e) => {
        if (e) e.preventDefault();
        fetchList(searchNickname);
    };

    return (
        <div className={scroll.scroll}>
            <Header />
            <ManageReserveHeader page={"acess"} />


            <section className={scroll.scroll_section}>
                <div className={rsvInfo.sub_title}>
                    <p>미승인 학생 조회</p>
                    <form className={rsvInfo.search_div} onSubmit={handleSearch}>
                        <input
                            placeholder="가입자 성함"
                            value={searchNickname}
                            onChange={(e) => { setSearchNickname(e.target.value) }}
                        />
                        <button type="submit"><img src={search} /></button>
                    </form>
                </div>

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
            </section>



        </div>
    )
}

export default ManageAcessUser;