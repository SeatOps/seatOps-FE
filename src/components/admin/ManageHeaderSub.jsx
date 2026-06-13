import HeadSub from '../../css/common/HeaderSub.module.css';

function ManageHeaderSub({ text, button, onButtonClick }) {
    return (
        <div className={HeadSub.sub_title}>
            <p>{text}</p>
            <button onClick={onButtonClick}>{button}</button>
        </div>
    )
}

export default ManageHeaderSub;