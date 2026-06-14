function ClassroomRegister({ setSeat, setClassroom, handleclassroom, classroom, seat }) {
    return (
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
    )
}

export default ClassroomRegister;