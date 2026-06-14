function InstructorRegister({ instructor, setInstructor, handleinstructor }) {
    return (
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
    )
}

export default InstructorRegister;