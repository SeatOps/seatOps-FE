function ClassNameEidt({ subjectList, setSubject, subject, subjectInput, setSubjectModal, clickModal, setSubjectInput, modiSubject, setModiSubject, fetchModiSubject }) {
    return (
        <div>
            <label>과목명</label>
            <div className={classModi.select_input}>
                <div>
                    <select onChange={(e) => setSubject(e.target.value)} value={subject}>
                        {subjectList.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                    <button
                        className={subjectInput ? classModi.modi_btn : ""}
                        onClick={() => subjectInput ? clickModal(setSubjectModal) : clickModi(subjectInput, setSubjectInput)}>
                        {subjectInput ? "삭제하기" : "수정하기"}
                    </button>
                </div>
                {subjectInput && (
                    <div>
                        <div className={classModi.input_group}>
                            <input placeholder="과목명 입력" type="text" value={modiSubject} onChange={(e) => setModiSubject(e.target.value)} />
                        </div>
                        <button onClick={fetchModiSubject}>수정완료</button>
                    </div>
                )}
            </div>
        </div>
    )
}