function InstructorEdit({ instructorList, setInstructor, instructor, instructorInput, clickModal, setInstructorModal, setInstructorInput, modiInstructor, setModiInstructor, fetchModiInstructor }) {
    return (
        <div>
            <label>강사</label>
            <div className={classModi.select_input}>
                <div>
                    <select onChange={(e) => setInstructor(e.target.value)} value={instructor}>
                        {instructorList.map((i) => (
                            <option key={i.id} value={i.id}>{i.name}</option>
                        ))}
                    </select>
                    <button
                        className={instructorInput ? classModi.modi_btn : ""}
                        onClick={() => instructorInput ? clickModal(setInstructorModal) : clickModi(instructorInput, setInstructorInput)}>
                        {instructorInput ? "삭제하기" : "수정하기"}
                    </button>
                </div>
                {instructorInput && (
                    <div>
                        <div className={classModi.input_group}>
                            <input placeholder="강사명 입력" type="text" value={modiInstructor} onChange={(e) => setModiInstructor(e.target.value)} />
                        </div>
                        <button onClick={fetchModiInstructor}>수정완료</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InstructorEdit;