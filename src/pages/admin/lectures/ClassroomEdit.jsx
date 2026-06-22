function ClassroomEdit({ classroomModal, setClassroom, classroomList, classroomInput, setClassroomInput, modiClassroom, modiSeat, setModiClassroom, setModiSeat, fetchModiClassroom }) {
    return (
        <div>
            <label>강의실</label>
            <div className={classModi.select_input}>
                <div>
                    <select onChange={(e) => setClassroom(e.target.value)} value={classroom}>
                        {classroomList.map((c) => (
                            <option key={c.id} value={c.id}>{c.classroomNum} (좌석: {c.totalSeat})</option>
                        ))}
                    </select>
                    <button
                        className={classroomInput ? classModi.modi_btn : ""}
                        onClick={() => classroomInput ? classroomModal.openModal() : clickModi(classroomInput, setClassroomInput)}>
                        {classroomInput ? "삭제하기" : "수정하기"}
                    </button>
                </div>
                {classroomInput && (
                    <div>
                        <div className={classModi.input_group}>
                            <input placeholder="강의실 입력" type="text" value={modiClassroom} onChange={(e) => setModiClassroom(e.target.value)} />
                            <input placeholder="좌석 수" type="number" value={modiSeat} onChange={(e) => setModiSeat(e.target.value)} />
                        </div>
                        <button onClick={fetchModiClassroom}>수정완료</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ClassroomEdit;
