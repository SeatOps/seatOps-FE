import mo from '../../css/common/Modal.module.css'

function Modal({ text, event }) {
    return (
        <div className={mo.modal_parent}>
            <section
                className={mo.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <div>
                    <p className={mo.black_p}>{text}</p>
                    <div>

                        <button onClick={(e) => {
                            e.stopPropagation();
                            event();
                        }}>
                            확인
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Modal;