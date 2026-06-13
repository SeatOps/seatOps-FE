import nextPage from '../../img/page-next.svg'
import nextPageAll from '../../img/page-next-all.svg'
import prevPage from '../../img/page-prev.svg'
import prevPageAll from '../../img/page-prev-all.svg'
import rsvRegiInfo from "../../css/admin/RsvRegiInfo.module.css";

function Pagination({ page, setPage, totalPages }) {
    const PAGE_GROUP_SIZE = 4;
    const currentGroup = Math.floor(page / PAGE_GROUP_SIZE);
    const startPage = currentGroup * PAGE_GROUP_SIZE;
    const endPage = Math.min(startPage + PAGE_GROUP_SIZE, totalPages);

    const pageNumbers = [];
    for (let i = startPage; i < endPage; i++) {
        pageNumbers.push(i);
    }

    // 페이지 이동 이벤트
    const handlePrevGroup = () => {
        const prevGroupStart = startPage - PAGE_GROUP_SIZE;
        setPage(Math.max(0, prevGroupStart));
    };
    const handleNextGroup = () => {
        const nextGroupStart = startPage + PAGE_GROUP_SIZE;
        if (nextGroupStart < totalPages) {
            setPage(nextGroupStart);
        }
    };
    const handlePrevPage = () => setPage(Math.max(0, page - 1));
    const handleNextPage = () => setPage(Math.min(totalPages - 1, page + 1));

    return (
        <>
            {/* 페이지 이동 */}
            <div className={rsvRegiInfo.pagination}>
                {/* << 버튼: 이전 그룹으로 이동 */}
                <button onClick={handlePrevGroup} disabled={startPage === 0}>
                    <img src={prevPageAll} alt="이전 그룹" />
                </button>

                {/* < 버튼: 이전 페이지로 이동 */}
                <button onClick={handlePrevPage} disabled={page === 0}>
                    <img src={prevPage} alt="이전 페이지" />
                </button>

                {/* 페이지 번호 목록 */}
                {pageNumbers.map((num) => (
                    <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={page === num ? rsvRegiInfo.activePage : ""}
                    >
                        {num + 1}
                    </button>
                ))}

                {/* > 버튼: 다음 페이지로 이동 */}
                <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                    <img src={nextPage} alt="다음 페이지" />
                </button>

                {/* >> 버튼: 다음 그룹으로 이동 */}
                <button onClick={handleNextGroup} disabled={endPage >= totalPages}>
                    <img src={nextPageAll} alt="다음 그룹" />
                </button>
            </div>
        </>
    )
}

export default Pagination;