import Header from "../../../components/common/Header";
import ManageReserveHeader from "../../../components/admin/ManageReserveHeader";
import rsvInfo from "../../../css/admin/RsvInfo.module.css"
import classRegi from "../../../css/admin/ClassRegi.module.css"
import Modal from "../../../components/common/Modal";
import { useEffect, useState } from "react";
import { authAPI } from '../../../components/common/apiClient';
import scroll from "../../../css/common/scroll.module.css"
import { useLocation } from "react-router-dom";



function ClassInfoRegi() {
    const location = useLocation();

    const [onModal, setOnModal] = useState(false)
    const [onModal2, setOnModal2] = useState(false)
    const [subject, setSubject] = useState("")
    const [instructor, setInstructor] = useState("")
    const [classroom, setClassroom] = useState("")
    const [seat, setSeat] = useState("")

    const [classError, setClassError] = useState('')

    useEffect(() => {
        setInstructor("")
        setClassroom("")
        setSubject("")
        setSeat("")
    }, [location.key])

    const handlesubject = async () => {

        if (!subject) {
            setOnModal2(true);
            return;
        }
        const requestData = {
            name: subject,
        };
        try {
            const response = await authAPI.regiSubjects(requestData);
            setOnModal(true);
            setSubject("");

        } catch (err) {
            console.error("강의명 등록 실패:", err);
            if (err.response.data.message === "이미 존재하는 과목명입니다.") {
                setClassError(err.response.data.message);
            }
        }
    };

    const handleinstructor = async () => {

        if (!instructor) {
            setOnModal2(true);
            return;
        }
        const requestData = {
            name: instructor,
        };
        try {
            const response = await authAPI.regiInstructors(requestData);
            setOnModal(true);
            setInstructor("");

        } catch (err) {
            console.error("강사명 등록 실패:", err);
            if (err.response.data.message === "이미 등록된 강사 이름입니다.") {
                setClassError(err.response.data.message);
            }
        }


    };

    const handleclassroom = async () => {
        if (!classroom || !seat) {
            setOnModal2(true);
            return;
        }

        const formattedClassroom = classroom.trim().endsWith("호")
            ? classroom.trim()
            : `${classroom.trim()}호`;

        const requestData = {
            name: formattedClassroom,
            totalSeat: seat
        };
        try {
            const response = await authAPI.regiClassrooms(requestData);
            setOnModal(true);
            setClassroom("");
            setSeat("");

        } catch (err) {
            console.error("강의실 등록 실패:", err);
            if (err.response.data.message === "이미 존재하는 강의실 이름입니다.") {
                setClassError(err.response.data.message);
            }
        }
    };




    return (
        <div className={scroll.scroll}>
            <Header />
            <ManageReserveHeader page={"registrationR"} />
            <section className={scroll.scroll_section}>
                <div className={rsvInfo.sub_title}>
                    <p>과목명 / 강사 / 강의실 등록</p>
                </div>
                <section className={classRegi.form_ct}>
                    <div>
                        <label>과목명</label>
                        <input
                            required
                            placeholder="과목명 입력"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)} />
                        <button type="button" onClick={() => { handlesubject() }}>등록하기</button>
                    </div>
                    <div>
                        <label>강사</label>
                        <input
                            required
                            placeholder="이름 입력"
                            type="text"
                            value={instructor}
                            onChange={(e) => setInstructor(e.target.value)} />
                        <button type="button" onClick={() => { handleinstructor() }}>등록하기</button>
                    </div>
                    <div>
                        <label>강의실</label>
                        <div>
                            <input
                                required
                                placeholder="강의실 입력"
                                type="text"
                                value={classroom}
                                onChange={(e) => setClassroom(e.target.value)} />
                            <input
                                required
                                placeholder="좌석 수"
                                type="number"
                                value={seat}
                                onChange={(e) => setSeat(e.target.value)} />
                        </div>
                        <button type="button" onClick={() => { handleclassroom() }}>등록하기</button>
                    </div>
                </section>
                {
                    onModal === true && (
                        <Modal text='등록이 완료되었습니다.' event={() => { setOnModal(false) }} />
                    )
                }

                {
                    onModal2 === true && (
                        <Modal text='값을 입력해주세요.' event={() => { setOnModal2(false) }} />
                    )
                }
                {
                    classError && (
                        <Modal text={classError} event={() => { setClassError('') }} />
                    )
                }
            </section>
        </div>
    )
}

export default ClassInfoRegi;