import rsvRegi from '../../css/admin/RsvRegi.module.css'

function DateShow({ classInfo }) {
    const year = (classInfo || "").slice(0, 4)
    const month = (classInfo || "").slice(5, 7)
    const day = (classInfo || "").slice(8, 10)

    return (
        <>
            <p className={`${rsvRegi.year} ${rsvRegi.showP}`} >{year}</p>
            <label>년</label>
            <p className={rsvRegi.showP}>{month}</p>
            <label>월</label>
            <p className={rsvRegi.showP}>{day}</p >
            <label>일</label>
        </>
    )
}

export default DateShow;