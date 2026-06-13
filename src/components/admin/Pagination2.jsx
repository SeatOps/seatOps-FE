import nextPage from '../../img/page-next.svg'
import nextPageAll from '../../img/page-next-all.svg'
import prevPage from '../../img/page-prev.svg'
import prevPageAll from '../../img/page-prev-all.svg'
import rsvRegiInfo from "../../css/admin/RsvRegiInfo.module.css";

// pages는 
// "page": {
//      "size": 5, 한 페이지 갯수
//      "number": 0, 현재 페이지
//      "totalElements": 5, 총 갯수
//      "totalPages": 1 총 페이지
//     }
//의 구조

function Pagination2({ page, setPage, pages }) {

    const currentPage = page ?? 0;
    const paginationNum = Math.floor(currentPage / 4) + 1;
    const startPageNum = paginationNum * 4 - 4
    const lastPage = (pages?.totalPages ?? 0) - 1
    const pageNumbers = Array.from({ length: 4 }, (v, i) => startPageNum + i)
    const filterPageNum = pageNumbers.filter((n) => lastPage >= n)

    const clickPrevGroup = () => {
        if (paginationNum === 1) {
            setPage(0)
        } else {
            const prevGroup = (paginationNum - 1) * 4 - 1
            setPage(prevGroup)
        }
    }

    const clickPrevPage = () => {
        if (currentPage === 0) {
            return;
        } else {
            setPage(currentPage - 1)
        }
    }

    const clickNextPage = () => {
        if (currentPage === lastPage) {
            return;
        } else {
            setPage(currentPage + 1)

        }
    }

    const clickNextGroup = () => {
        if (paginationNum * 4 - 1 >= lastPage) {
            setPage(lastPage)
        } else {
            const nextGroup = (paginationNum) * 4
            setPage(nextGroup)
        }
    }



    return (
        <>
            <div className={rsvRegiInfo.pagination}>
                {/* << 버튼: 이전 그룹으로 이동 */}
                <button onClick={clickPrevGroup}>
                    <img src={prevPageAll} alt="이전 그룹" />
                </button>

                {/* < 버튼: 이전 페이지로 이동 */}
                <button onClick={clickPrevPage}>
                    <img src={prevPage} alt="이전 페이지" />
                </button>

                {/* 페이지 번호 목록 */}
                {filterPageNum.map((num) => (
                    <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={currentPage === num ? rsvRegiInfo.activePage : ""}
                    >
                        {num + 1}
                    </button>
                ))}

                {/* > 버튼: 다음 페이지로 이동 */}
                <button onClick={clickNextPage}>
                    <img src={nextPage} alt="다음 페이지" />
                </button>

                {/* >> 버튼: 다음 그룹으로 이동 */}
                <button onClick={clickNextGroup}>
                    <img src={nextPageAll} alt="다음 그룹" />
                </button>
            </div>
        </>
    )
}

export default Pagination2;