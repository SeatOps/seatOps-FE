import rsvRegi from '../../css/admin/RsvRegi.module.css';

function TimeShow({ classInfo }) {

    const hour = (classInfo || "").slice(11, 13)
    const min = (classInfo || "").slice(14, 16)

    return (
        <>
            <p className={rsvRegi.showP}>{hour}</p>
            <label>시</label>
            <p className={rsvRegi.showP}>{min}</p>
            <label>분</label>
        </>
    )
}

export default TimeShow;