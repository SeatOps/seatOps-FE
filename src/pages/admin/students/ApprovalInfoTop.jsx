import rsvInfo from "../../css/admin/RsvInfo.module.css"
import search from '../../img/search.svg'


function ApprovalInfoTop({ handleSearch, searchNickname, setSearchNickname }) {
    return (
        <div className={rsvInfo.sub_title}>
            <p>미승인 학생 조회</p>
            <form className={rsvInfo.search_div} onSubmit={handleSearch}>
                <input
                    placeholder="가입자 성함"
                    value={searchNickname}
                    onChange={(e) => { setSearchNickname(e.target.value) }}
                />
                <button type="submit"><img src={search} /></button>
            </form>
        </div>
    )
}

export default ApprovalInfoTop;