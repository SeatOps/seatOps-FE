import HeadSub from '../../css/common/HeaderSub.module.css';
import xBtn from "../../img/xBtn.svg"
import Navigation from './Navigate';


function HeaderSub({ title }) {
    const { movehome } = Navigation();
    return (
        <div className={HeadSub.sub_h_ct}>
            <p>{title}</p>
            <img src={xBtn} onClick={movehome} />
        </div>
    )
}

export default HeaderSub;