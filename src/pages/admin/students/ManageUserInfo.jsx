import Header from "../../../components/common/Header";
import rsvInfo from "../../css/admin/RsvInfo.module.css"
import UserInfo from "../../../components/admin/UserInfo";

import { useEffect, useState } from "react";
import ManageReserveHeader from "../../../components/admin/ManageReserveHeader";
import { authAPI } from "../../../components/common/apiClient";
import scroll from "../../css/common/scroll.module.css"
import { useLocation } from "react-router-dom";

import sortUp from "../../img/sort-up.svg"
import sortDown from "../../img/sort-down.svg"
import StudentInfoBottom from "./StudentInfoBottom";


function ManageUserInfo() {
    const location = useLocation();

    const [sortBy, setSortBy] = useState("")
    const [nameSort, setNameSort] = useState('asc')
    const [attendanceSort, setAttendanceSort] = useState('asc')
    const [signDateSort, setSignDateSort] = useState('asc')
    const [userInfoList, setUserInfo] = useState([])
    const [searchNickname, setSearchNickname] = useState("")

    const handleDeleteUser = (userId) => {
        setUserInfo((prevList) => prevList.filter(user => user.userId !== userId));
    };


    const fetchList = async (currentSearch = searchNickname) => {
        try {
            let response;
            if (currentSearch) {
                response = await authAPI.managerUserList({ keyword: currentSearch });
            } else {
                response = await authAPI.managerUserList();
            }
            setUserInfo(response.data);
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
                response = await authAPI.managerUserList({ keyword: currentSearch, sortBy: sort, direction: direction });
            } else {
                response = await authAPI.managerUserList({ sortBy: sort, direction: direction });
            }

            setUserInfo(response.data)
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
            <ManageReserveHeader page={"user"} />


            <section className={scroll.scroll_section}>
                <StudentInfoTop handleSearch={handleSearch} searchNickname={searchNickname} setSearchNickname={setSearchNickname} />

                <StudentInfoBottom setSortBy={setSortBy} togleSort={togleSort} userInfoList={userInfoList} handleDeleteUser={handleDeleteUser} />
            </section>
        </div>
    )
}

export default ManageUserInfo;