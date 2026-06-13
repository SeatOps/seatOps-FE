
function TimeForm({ stateHour, stateSetHour, stateMin, stateSetMin }) {

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = [0, 10, 20, 30, 40, 50];

    const formatNum = (num) => String(num).padStart(2, '0');

    const changeState = (e, setState) => {
        setState(e.target.value)
    }

    return (
        <>
            <select id="classStartHour" value={stateHour} onChange={(event) => changeState(event, stateSetHour)}>
                {hours.map(h => <option key={h} value={formatNum(h)}>{formatNum(h)}</option>)}
            </select>
            <label>시</label>
            <select id="classStartMin" value={stateMin} onChange={(event) => changeState(event, stateSetMin)}>
                {minutes.map(m => <option key={m} value={formatNum(m)}>{formatNum(m)}</option>)}
            </select>
            <label>분</label>

        </>
    )
}

export default TimeForm;