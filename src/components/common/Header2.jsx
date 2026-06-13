import AcademyLogo from '../../img/academy-logo.svg';
import AcademyLogoDesktop from '../../img/academy-logo-desktop.svg'
import MobileProfileImg from '../../img/mobile-profile.svg'
import Navigation from './Navigate';

export default function Header2() {
    const { movehome} = Navigation();
    return (
        <div className='top-header-style'>
            <header className='top-header-ct'>
                    <img onClick={movehome} className="academy-logo-desktop" media="(min-width: 1024px)" src={AcademyLogoDesktop} />
                <p className='desktop-ct logout'> 로그아웃 </p>
                </header>
            <div className="top-line desktop-ct"> </div>
        </div>

    )
}
// css는 Login.css에 작성했음