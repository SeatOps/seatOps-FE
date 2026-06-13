import mo from '../../css/common/Modal.module.css'

function TwoBtnModal({ text, btn1T, btn2T, btn1E, btn2E }) {
    return (
        <div className={mo.modal_parent}>
            <section className={mo.modal}>
                <div>
                    <p>{text}</p>
                    <div>
                        <button onClick={btn1E}>{btn1T}</button>
                        <button onClick={btn2E}>{btn2T}</button>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default TwoBtnModal;