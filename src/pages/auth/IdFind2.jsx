// IdFind2.jsx
import Header from "../../components/common/Header.jsx";
import IdPswFindDesktop from "../../components/auth/IdPswFindDesktop.jsx";
import IdPswFindTop from "../../components/auth/IdPswFindTop.jsx";
import Navigation from "../../components/common/Navigate.jsx";
import '../../css/auth/IdPswFind.css';
import { useLocation} from "react-router-dom"; 

export default function IdFind2() {
    const { loginpg, pswfind } = Navigation();
    const location = useLocation();               

    // 이전 페이지에서 넘어온 값
    const { username, updatedDate, message } = location.state || {};

    const formattedDate = updatedDate
        ? updatedDate.replace(/-/g, '. ').trim()
        : '';

    return (
        <div className="term-all-scroll-ct">
            <IdPswFindTop step={1} onBack={loginpg}/>
            <Header />
            <IdPswFindDesktop step={1} />

            <p className="idfind2-coment">
                휴대전화번호 정보와 일치하는 아이디입니다
            </p>

            <section className="user-find-inf">
                <p>아이디 : {username || '-'}</p>
                <p>최종수정일 : {updatedDate || '-'}</p>
            </section>

            <div className="idfind2-btn-ct">
                <button className="idfind2-login-btn" onClick={loginpg}>
                    로그인
                </button>
                <button className="idfind2-pswfind-btn" onClick={pswfind}>
                    비밀번호 찾기
                </button>
            </div>
        </div>
    );
}
