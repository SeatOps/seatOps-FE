import myp from '../../css/mypage/MyPage.module.css'
import nextBtn from '../../img/next-page-btn.svg'

function MyPageDatail({ text, event }) {
    return (
        <>
            <div onClick={event}>
                <p>{text}</p><button><img src={nextBtn} /></button>
            </div>
        </>
    )
}

export default MyPageDatail;