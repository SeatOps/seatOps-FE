import { useEffect, useState } from 'react';
import HeadSub from '../../css/common/HeaderSub.module.css';
import { Link } from 'react-router-dom';
import Navigation from '../common/Navigate';


function ManageReserveHeader({ page }) {
    const { movemanageclassdetailregi, movemanageclassdetailmodi, movereservationRegiInfo, movemanageuserinfo, movemanageacessinfo } = Navigation();
    const [reserve, setReserve] = useState(false);
    const [detailregi, setDetailregi] = useState(false);
    const [reserveHover, setReserveHover] = useState("")
    const [regiHover, setRegiHover] = useState("")


    const enterReserve = () => {
        setReserve(true)
    }

    const leaveReserve = () => {
        setReserve(false)
    }

    const enterDetail = () => {
        setDetailregi(true)
    }

    const leaveDetail = () => {
        setDetailregi(false)
    }

    useEffect(() => {
        setReserve(false)
        setDetailregi(false)
    }, [])

    return (
        <div className={HeadSub.sub_header_reserve}>
            <div onClick={movereservationRegiInfo} className={(page === "reservation") ? `${HeadSub.active_header}` : ""}>좌석 예약</div>
            <div onMouseEnter={enterDetail} onMouseLeave={leaveDetail} className={(page === "registrationR" || page === "registrationM") ? `${HeadSub.active_header}` : ""}>강의 정보</div>
            {detailregi === true && (
                <section
                    className={HeadSub.detail}
                    onMouseEnter={enterDetail}
                    onMouseLeave={leaveDetail}>
                    <div
                        className={(regiHover === "r") || ((regiHover !== "m") && (page === "registrationR")) ? HeadSub.underline : ""}
                        onMouseEnter={() => setRegiHover("r")}
                        onMouseLeave={() => setRegiHover("")}
                        onClick={movemanageclassdetailregi}>
                        과목명/강사/강의실 등록
                    </div>
                    <div
                        className={(regiHover === "m") || ((regiHover !== "r") && (page === "registrationM")) ? HeadSub.underline : ""}
                        onMouseEnter={() => setRegiHover("m")}
                        onMouseLeave={() => setRegiHover("")}
                        onClick={movemanageclassdetailmodi}>
                        과목명/강사/강의실 수정
                    </div>
                </section>
            )}
            <div onMouseEnter={enterReserve} onMouseLeave={leaveReserve} className={(page === "user" || page === "acess") ? `${HeadSub.active_header}` : ""}> 학생 관리</div>
            {
                reserve === true && (
                    <section
                        className={HeadSub.reserve}
                        onMouseEnter={enterReserve}
                        onMouseLeave={leaveReserve}>
                        <div
                            className={(reserveHover === "u") || ((reserveHover !== "a") && (page === "user")) ? HeadSub.underline : ""}
                            onMouseEnter={() => setReserveHover("u")}
                            onMouseLeave={() => setReserveHover("")}
                            onClick={movemanageuserinfo}>
                            전체 학생 조회
                        </div>
                        <div
                            className={(reserveHover === "a") || ((reserveHover !== "u") && (page === "acess")) ? HeadSub.underline : ""}
                            onMouseEnter={() => setReserveHover("a")}
                            onMouseLeave={() => setReserveHover("")}
                            onClick={movemanageacessinfo}>
                            미승인 학생 조회
                        </div>
                    </section>
                )
            }

        </div >
    )
}

export default ManageReserveHeader;