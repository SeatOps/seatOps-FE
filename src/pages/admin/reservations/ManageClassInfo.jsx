import rsvRegi from '../../css/admin/RsvRegi.module.css'
import DateShow from '../../../components/admin/DateShow';
import TimeShow from '../../../components/admin/TimeShow';
import Header from '../../../components/common/Header';
import { useState, useEffect } from 'react';
import { authAPI } from '../../../components/common/apiClient';
import HeadSub from '../../css/common/HeaderSub.module.css';
import Navigation from '../../../components/common/Navigate';
import ManageReserveHeader from "../../../components/admin/ManageReserveHeader";
import scroll from "../../css/common/scroll.module.css"
import LectureInfo from './LectureInfo';


function ManageClassInfo() {

    const { movemanageclassmodi, movereservationRegiInfo } = Navigation();

    const [classInfo, setClassInfo] = useState(null);
    const [lectureData, setLectureData] = useState(null);

    useEffect(() => {
        const lectureString = window.localStorage.getItem('lecture');

        if (lectureString) {
            const parsedData = JSON.parse(lectureString);
            setLectureData(parsedData);

            const fetchClassInfo = async (id) => {
                try {
                    const response = await authAPI.checkLectureInfo(id);
                    setClassInfo(response.data);
                } catch (err) {
                    console.log('강의 세부 조회 실패: ', err);
                }
            };

            fetchClassInfo(parsedData.lectureId);
        }
    }, []);

    if (!classInfo) {
        return (
            <>
                <Header />
                <div style={{ padding: '20px', textAlign: 'center' }}>데이터를 불러오는 중입니다...</div>
            </>
        );
    }

    return (
        <div className={scroll.scroll}>
            <Header />
            <ManageReserveHeader page={"reservation"} />
            <section className={scroll.scroll_section}>
                <LectureInfo classInfo={classInfo} movereservationRegiInfo={movereservationRegiInfo} movemanageclassmodi={movemanageclassmodi} />
            </section>
        </div>
    );
}

export default ManageClassInfo;