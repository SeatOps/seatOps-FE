import search from '../../../img/search.svg';
import rsvInfo from "../../../css/admin/RsvInfo.module.css"


function StudentInfoTop({ handleSearch, searchNickname, setSearchNickname }) {
    return (
        <div className={rsvInfo.sub_title}>
            <p>전체 학생 조회</p>
            <form className={rsvInfo.search_div} onSubmit={handleSearch}>
                <input
                    placeholder="학생 성함"
                    value={searchNickname}
                    onChange={(e) => {
                        setSearchNickname(e.target.value);
                    }} />
                <button type="submit" ><img src={search} /></button>
            </form>
        </div>
    )
}

export default StudentInfoTop;