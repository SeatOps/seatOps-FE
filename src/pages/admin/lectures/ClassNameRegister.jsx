function ClassNameRegister({ subject, setSubject, handlesubject }) {
    return (
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
    )
}

export default ClassNameRegister;