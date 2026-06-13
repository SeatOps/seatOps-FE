import '../../css/calendar/Calender.css';

function CalenderDate({ date, month, currentMonth, clickDate, isToday, isActive, hasLecture }) {
    const baseClassName = (month === currentMonth) ? 'prev-date-div' : 'current-date-div';
    // (기존 코드에서 클래스명이 반대로 되어있던 부분을 수정함: 현재달이 current-date-div)

    const finalClassName = [
        baseClassName,
        isActive ? 'click' : '',
        isToday ? 'today' : ''
    ].join(' ').trim();

    return (
        <div className={finalClassName} onClick={() => clickDate()}>
            {/* 수업이 있을 때만 점 표시 */}
            {hasLecture && <span className="lecture-dot"></span>}
            {date}
        </div>
    )
}

export default CalenderDate;