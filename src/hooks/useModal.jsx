import { useState } from "react"


function useModal(activefunc, noneActivefunc) {
    const [isModal, setIsModal] = useState(false);

    //모달 여는 함수 
    const openModal = () => {
        setIsModal(true);
    }

    //모달 닫는 함수
    const closeModal = () => {
        setIsModal(false);
    }

    //필요시 사용
    const noneActiveModal = () => {
        setIsModal(false);
        noneActivefunc?.();
    }

    //모달이 실행될 때 함수
    const activeModal = () => {
        setIsModal(false);
        activefunc?.();
    }

    return { openModal, closeModal, activeModal, noneActiveModal, isModal }
}

export default useModal