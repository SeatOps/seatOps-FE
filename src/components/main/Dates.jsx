import date from '../../css/calendar/Date.module.css';

function Dates({ month, day, clickDate, isSelected }) {
    const selectClassName = isSelected ? date.select_ct : date.date_ct;

    return (
        <div className={selectClassName} onClick={() => clickDate(day)}>
            {month}.{day}
        </div>
    )
}

export default Dates;