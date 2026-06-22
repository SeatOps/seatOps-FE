import Header from "../../../components/common/Header";
import ManageReserveHeader from "../../../components/admin/ManageReserveHeader";
import rsvInfo from "../../../css/admin/RsvInfo.module.css";
import Modal from "../../../components/common/Modal";
import { useState, useEffect } from "react";
import { authAPI } from '../../../components/common/apiClient';
import classModi from '../../../css/admin/ClassModi.module.css';
import scroll from "../../../css/common/scroll.module.css";
import { useLocation } from "react-router-dom";
import InstructorEdit from "./InstructorEdit";
import ClassroomEdit from "./ClassroomEdit";
import ClassNameEdit from "./ClassNameEdit";
import useModal from "../../../hooks/useModal";
import TwoButtonModal from "../../../components/common/TwoButtonModal";

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
            nullModal.openModal();
            return;
        }

        try {
            const response = await authAPI.modisubject(subject, { name: modiSubject });
            if (response.status === 200) {
                updateCompModal.openModal();
                setModiSubject("");
                setSubjectInput(false);
                await fetchData();
            }
        } catch (err) {
            console.error(err);
            if (err.response.data === "해당 과목으로 등록된 예약이 존재하여 수정할 수 없습니다.") {
                errorUpdateModal.openModal();
            }
            if (err.response.data.message === "이미 존재하는 과목명입니다.") {
                setClassError(err.response.data.message);
                errorClassModal.openModal();
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
                updateCompModal.openModal();
                setModiInstructor("");
                setInstructorInput(false);
                await fetchData();
            }
        } catch (err) {
            console.error(err);
            if (err.response.data === "해당 강사가 강의에 등록되어 있어 이름을 수정할 수 없습니다."
            ) {
                errorUpdateModal.openModal();
            }
            if (err.response.data.message === "이미 존재하는 강사 이름입니다.") {
                setClassError(err.response.data.message);
                errorClassModal.openModal();
            }
        }
    };

    const fetchModiClassroom = async () => {
        if (!modiClassroom || !modiSeat) {
            nullModal();
            return;
        }

        const formattedClassroom = modiClassroom.trim().endsWith("호")
            ? modiClassroom.trim()
            : `${modiClassroom.trim()}호`;

        try {
            const response = await authAPI.modiclassroom(classroom, { name: formattedClassroom, totalSeat: modiSeat });
            if (response.status === 200) {
                updateCompModal.openModal();
                setModiClassroom("");
                setModiSeat("");
                setClassroomInput(false);
                await fetchData();
            }
        } catch (err) {
            console.error(err);
            if (err.response.data === "해당 강의에 예약이 존재하여 강의실 정보(이름/좌석수)를 수정할 수 없습니다.") {
                errorUpdateModal.openModal();
            }
            if (err.response.data.message === "이미 존재하는 강의실 이름입니다.") {
                setClassError(err.response.data.message);
                errorClassModal.openModal();
            }
        }

    };


    const deleteSubject = async () => {
        try {
            await authAPI.deletesubject(subject);
            fetchData();
            subjectModal.closeModal();
            deleteCompModal.openModal();

        } catch (err) {
            console.log(err)
            if (err.response && err.response.status === 400) {
                subjectModal.closeModal();
                if (err.response.data === "해당 과목으로 등록된 예약이 존재하여 삭제할 수 없습니다.") {
                    errorDeleteModal.openModal();
                }
            }
        }
    }

    const deleteInstructor = async () => {
        try {
            await authAPI.deleteinstructor(instructor);
            fetchData();
            instructorModal.closeModal();
            deleteCompModal.openModal();

        } catch (err) {
            console.log(err)
            if (err.response && err.response.status === 400) {
                instructorModal.closeModal();
                console.log(err.response.data)
                if (err.response.data === "해당 강사이름이 등록된 강의가 존재하여 삭제할 수 없습니다.") {
                    errorDeleteModal.openModal();
                }
            }
        }
    }

    const deleteClassroom = async () => {
        try {
            await authAPI.deleteclassroom(classroom);
            fetchData();
            classroomModal.closeModal();
            deleteCompModal.openModal();
        } catch (err) {
            console.log(err)
            if (err.response && err.response.status === 400) {
                classroomModal.closeModal();
                if (err.response.data === "해당 강의실의 좌석에 예약이 존재하여 삭제할 수 없습니다. 먼저 예약을 취소해주세요.") {
                    errorDeleteModal.openModal();
                }

            }
        }
    }
    const updateCompModal = useModal();
    const instructorModal = useModal(deleteInstructor);
    const subjectModal = useModal(deleteSubject);
    const classroomModal = useModal(deleteClassroom);
    const deleteCompModal = useModal();
    const errorDeleteModal = useModal();
    const errorUpdateModal = useModal();
    const nullModal = useModal();
    const errorClassModal = useModal();
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
                    <ClassNameEdit subjectList={subjectList} setSubject={setSubject} subject={subject} subjectInput={subjectInput} subjectModal={subjectModal} setSubjectInput={setSubjectInput} modiSubject={modiSubject} setModiSubject={setModiSubject} fetchModiSubject={fetchModiSubject} />

                    {/* 강사 섹션 확인해야됨*/}
                    <InstructorEdit instructorList={instructorList} setInstructor={setInstructor} instructor={instructor} instructorInput={instructorInput} instructorModal={instructorModal} setInstructorInput={setInstructorInput} modiInstructor={modiInstructor} setModiInstructor={setModiInstructor} fetchModiInstructor={fetchModiInstructor} />

                    {/* 강의실 섹션 */}
                    <ClassroomEdit classroomModal={classroomModal} setClassroom={setClassroom} classroomList={classroomList} classroomInput={classroomInput} setClassroomInput={setClassroomInput} modiClassroom={modiClassroom} modiSeat={modiSeat} setModiClassroom={setModiClassroom} setModiSeat={setModiSeat} fetchModiClassroom={fetchModiClassroom} />
                </section>

                {/* 모달 컴포넌트들 */}
                <Modal isModal={updateCompModal.isModal} closeModal={updateCompModal.closeModal} activeModal={updateCompModal.activeModal} text='수정이 완료되었습니다.' />
                <TwoButtonModal isModal={instructorModal.isModal} closeModal={instructorModal.closeModal} activeModal={instructorModal.activeModal} noneActiveModal={instructorModal.noneActiveModal} text="정말로 삭제하시겠습니까?" />
                <TwoButtonModal isModal={subjectModal.isModal} closeModal={subjectModal.closeModal} activeModal={subjectModal.activeModal} noneActiveModal={subjectModal.noneActiveModal} text="정말로 삭제하시겠습니까?" />
                <TwoButtonModal isModal={classroomModal.isModal} closeModal={classroomModal.closeModal} activeModal={classroomModal.activeModal} noneActiveModal={classroomModal.noneActiveModal} text="정말로 삭제하시겠습니까?" />


                <Modal text="삭제되었습니다." isModal={deleteCompModal.isModal} closeModal={deleteCompModal.closeModal} activeModal={deleteCompModal.activeModal} />
                <Modal isModal={errorDeleteModal.isModal} closeModal={errorDeleteModal.closeModal} activeModal={errorDeleteModal.activeModal} text={"해당 정보로 등록된 강의가 있어\n삭제할 수 없습니다."} />
                <Modal isModal={errorUpdateModal.isModal} closeModal={errorUpdateModal.closeModal} activeModal={errorUpdateModal.activeModal} text={"해당 정보로 등록된 강의가 있어\n수정할 수 없습니다."} />
                <Modal isModal={nullModal.isModal} closeModal={nullModal.closeModal} activeModal={nullModal.activeModal} text='값을 입력해주세요.' />
                <Modal isModal={errorClassModal.isModal} closeModal={errorClassModal.closeModal} activeModal={errorClassModal.activeModal} text={classError} />

            </section>
        </div>
    );
}

export default ClassInfoModi;