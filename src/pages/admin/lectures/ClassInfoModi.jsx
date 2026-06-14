import Header from "../../../components/common/Header";
import ManageReserveHeader from "../../../components/admin/ManageReserveHeader";
import rsvInfo from "../../css/admin/RsvInfo.module.css";
import Modal from "../../../components/common/Modal";
import { useState, useEffect } from "react";
import { authAPI } from '../../../components/common/apiClient';
import classModi from '../../css/admin/ClassModi.module.css';
import TwoBtnModal from "../../../components/admin/TwoBtnModal";
import scroll from "../../css/common/scroll.module.css";
import { useLocation } from "react-router-dom";
import InstructorEdit from "./InstructorEdit";
import ClassroomEdit from "./ClassroomEdit";

function ClassInfoModi() {
    const location = useLocation();

    const [onModal, setOnModal] = useState(false);
    const [instructorList, setInstructorList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [classroomList, setClassroomList] = useState([]);

    const [instructor, setInstructor] = useState("");
    const [subject, setSubject] = useState("");
    const [classroom, setClassroom] = useState("");

    const [modiSubject, setModiSubject] = useState("");
    const [modiInstructor, setModiInstructor] = useState("");
    const [modiClassroom, setModiClassroom] = useState("");
    const [modiSeat, setModiSeat] = useState("");

    const [instructorInput, setInstructorInput] = useState(false);
    const [subjectInput, setSubjectInput] = useState(false);
    const [classroomInput, setClassroomInput] = useState(false);

    const [instructorModal, setInstructorModal] = useState(false);
    const [classroomModal, setClassroomModal] = useState(false);
    const [subjectModal, setSubjectModal] = useState(false);

    const [deleteOk, setDeleteOk] = useState(false);

    const [deleteError, setDeleteError] = useState(false)
    const [modiError, setModiError] = useState(false)
    const [onModal2, setOnModal2] = useState(false)


    const clickModal = (setIsModal) => setIsModal(true);
    const closeModal = (setIsModal) => setIsModal(false);
    const clickModi = (input, setInput) => setInput(!input);
    const [classError, setClassError] = useState(false)


    const fetchData = async () => {
        try {
            const [resInstructors, resSubjects, resClassrooms] = await Promise.all([
                authAPI.instructorsAdd(),
                authAPI.subjectsAdd(),
                authAPI.classroomsAdd()
            ]);
            setInstructorList(resInstructors.data);
            if (resInstructors.data.length > 0) setInstructor(resInstructors.data[0].id);

            setSubjectList(resSubjects.data);
            if (resSubjects.data.length > 0) setSubject(resSubjects.data[0].id);

            setClassroomList(resClassrooms.data);
            if (resClassrooms.data.length > 0) setClassroom(resClassrooms.data[0].id);
        } catch (err) {
            console.error("데이터 로딩 실패:", err);
        }
    };

    useEffect(() => {
        setModiClassroom("")
        setModiInstructor("")
        setModiSeat("")
        setModiSubject("")
        setInstructorInput(false)
        setSubjectInput(false)
        setClassroomInput(false)
        fetchData();
    }, [location.key]);

    const fetchModiSubject = async () => {
        if (!modiSubject) {
            setOnModal2(true);
            return;
        }

        try {
            const response = await authAPI.modisubject(subject, { name: modiSubject });
            if (response.status === 200) {
                setOnModal(true);
                setModiSubject("");
                setSubjectInput(false);
                await fetchData();
            }
        } catch (err) {
            console.error(err);
            if (err.response.data === "해당 과목으로 등록된 예약이 존재하여 수정할 수 없습니다.") {
                setModiError(true);
            }
            if (err.response.data.message === "이미 존재하는 과목명입니다.") {
                setClassError(err.response.data.message);
            }

        }
    };

    const fetchModiInstructor = async () => {
        if (!modiInstructor) {
            setOnModal2(true);
            return;
        }

        try {
            const response = await authAPI.modiinstructor(instructor, { name: modiInstructor });
            if (response.status === 200) {
                setOnModal(true);
                setModiInstructor("");
                setInstructorInput(false);
                await fetchData();
            }
        } catch (err) {
            console.error(err);
            if (err.response.data === "해당 강사가 강의에 등록되어 있어 이름을 수정할 수 없습니다."
            ) {
                setModiError(true);
            }
            if (err.response.data.message === "이미 존재하는 강사 이름입니다.") {
                setClassError(err.response.data.message);
            }
        }
    };

    const fetchModiClassroom = async () => {
        if (!modiClassroom || !modiSeat) {
            setOnModal2(true);
            return;
        }

        const formattedClassroom = modiClassroom.trim().endsWith("호")
            ? modiClassroom.trim()
            : `${modiClassroom.trim()}호`;

        try {
            const response = await authAPI.modiclassroom(classroom, { name: formattedClassroom, totalSeat: modiSeat });
            if (response.status === 200) {
                setOnModal(true);
                setModiClassroom("");
                setModiSeat("");
                setClassroomInput(false);
                await fetchData();
            }
        } catch (err) {
            console.error(err);
            if (err.response.data === "해당 강의에 예약이 존재하여 강의실 정보(이름/좌석수)를 수정할 수 없습니다.") {
                setModiError(true);
            }
            if (err.response.data.message === "이미 존재하는 강의실 이름입니다.") {
                setClassError(err.response.data.message);
            }
        }

    };


    const deleteSubject = async () => {
        try {
            await authAPI.deletesubject(subject);
            fetchData();
            setSubjectModal(false);
            setDeleteOk(true)

        } catch (err) {
            console.log(err)
            if (err.response && err.response.status === 400) {
                setSubjectModal(false);
                if (err.response.data === "해당 과목으로 등록된 예약이 존재하여 삭제할 수 없습니다.") {
                    setDeleteError(true);
                }
            }
        }
    }

    const deleteInstructor = async () => {
        try {
            await authAPI.deleteinstructor(instructor);
            fetchData();
            setInstructorModal(false);
            setDeleteOk(true)

        } catch (err) {
            console.log(err)
            if (err.response && err.response.status === 400) {
                setInstructorModal(false);
                console.log(err.response.data)
                if (err.response.data === "해당 강사이름이 등록된 강의가 존재하여 삭제할 수 없습니다.") {
                    setDeleteError(true);
                }
            }
        }
    }

    const deleteClassroom = async () => {
        try {
            await authAPI.deleteclassroom(classroom);
            fetchData();
            setClassroomModal(false);
            setDeleteOk(true);
        } catch (err) {
            console.log(err)
            if (err.response && err.response.status === 400) {
                setClassroomModal(false);
                if (err.response.data === "해당 강의실의 좌석에 예약이 존재하여 삭제할 수 없습니다. 먼저 예약을 취소해주세요.") {
                    setDeleteError(true);
                }

            }
        }
    }

    return (
        <div className={scroll.scroll}>
            <Header />
            <ManageReserveHeader page={"registrationM"} />
            <section className={scroll.scroll_section}>
                <div className={rsvInfo.sub_title}>
                    <p>과목명 / 강사 / 강의실 수정</p>
                </div>

                <section className={classModi.form_ct}>
                    {/* 과목명 섹션 */}
                    <ClassNameEidt subjectList={subjectList} setSubject={setSubject} subject={subject} subjectInput={subjectInput} setSubjectModal={setSubjectModal} clickModal={clickModal} setSubjectInput={setSubjectInput} modiSubject={modiSubject} setModiSubject={setModiSubject} fetchModiSubject={fetchModiSubject} />

                    {/* 강사 섹션 */}
                    <InstructorEdit instructorList={instructorList} setInstructor={setInstructor} instructor={instructor} instructorInput={instructorInput} clickModal={clickModal} setInstructorModal={setInstructorModal} setInstructorInput={setInstructorInput} modiInstructor={modiInstructor} setModiInstructor={setModiInstructor} fetchModiInstructor={fetchModiInstructor} />

                    {/* 강의실 섹션 */}
                    <ClassroomEdit setClassroom={setClassroom} classroomList={classroomList} classroomInput={classroomInput} setClassroomModal={setClassroomModal} setClassroomInput={setClassroomInput} modiClassroom={modiClassroom} modiSeat={modiSeat} setModiClassroom={setModiClassroom} setModiSeat={setModiSeat} fetchModiClassroom={fetchModiClassroom} clickModal={clickModal} />
                </section>

                {/* 모달 컴포넌트들 */}
                {onModal && <Modal text='수정이 완료되었습니다.' event={() => setOnModal(false)} />}
                {instructorModal && <TwoBtnModal text="정말로 삭제하시겠습니까?" btn1T="네" btn2T="아니오"
                    btn1E={deleteInstructor}
                    btn2E={() => closeModal(setInstructorModal)} />}
                {subjectModal && <TwoBtnModal text="정말로 삭제하시겠습니까?" btn1T="네" btn2T="아니오"
                    btn1E={deleteSubject}
                    btn2E={() => closeModal(setSubjectModal)} />}
                {classroomModal && <TwoBtnModal text="정말로 삭제하시겠습니까?" btn1T="네" btn2T="아니오"
                    btn1E={deleteClassroom}
                    btn2E={() => closeModal(setClassroomModal)} />}
                {deleteOk &&
                    <Modal text="삭제되었습니다." event={() => { setDeleteOk(false) }} />
                }


                {deleteError && <Modal text={"해당 정보로 등록된 강의가 있어\n삭제할 수 없습니다."} event={() => setDeleteError(false)} />}
                {modiError && <Modal text={"해당 정보로 등록된 강의가 있어\n수정할 수 없습니다."} event={() => setModiError(false)} />}

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
    );
}

export default ClassInfoModi;