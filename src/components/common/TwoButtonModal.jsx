function TwoButtonModal({ isModal, closeModal, activeModal, noneActiveModal, text }) {
    if (!isModal) return null;
    return (
        <div className="z-[999] bg-black/50 fixed top-0 left-0 w-screen h-screen"
            onClick={closeModal} >
            <section
                className="rounded-[10px] p-[13px] border border-[#2C8FFF] bg-[#FCFCFC] h-[170px] z-[1000] w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                onClick={(e) => e.stopPropagation()}
            >
                <div className='h-[105px] flex justify-center items-center text-[#4D4D4D] text-[24px] font-medium'>{text}</div>
                <div className="flex w-full h-[50px] border-t border-[#A2A2A2] text-sm font-medium leading-normal ">
                    <button onClick={activeModal} className="w-full text-[#2C8FFF]">확인</button>
                    <button onClick={noneActiveModal} className="w-full border-r border-[#A2A2A2] text-[#4D4D4D]" >취소</button>
                </div>

            </section>
        </div>
    )
}

export default TwoButtonModal;