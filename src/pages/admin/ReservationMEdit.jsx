import React, { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import { useNavigate, useLocation } from "react-router-dom";
import '../../css/lecture/ReservationPg.css'
import '../../css/lecture/ReservationModal.css'
import '../../css/lecture/ReservationEdit.css'
import '../../css/lecture/ReservationMEdit.css'
import MobileProfileimg from '../../img/mobile-profile.svg'
import MobileBackbtn from '../../img/backbtn.svg'
import reservationLogo from '../../img/reservation-logo-img.svg'
import { authAPI } from "../../components/common/apiClient"
import Navigation from "../../components/common/Navigate";
import TwoBtnModal from "../../components/admin/TwoBtnModal";
import Modal from "../../components/common/Modal";

// 좌석 배치 설정
const Row_seat_chart = [
    { id: 1, seatCount: 7 },
    { id: 2, seatCount: 7 },
    { id: 3, seatCount: 7 },
    { id: 4, seatCount: 6, door2row: true },
    { id: 5, seatCount: 6, Wall: true },
    { id: 6, seatCount: 8 },
    { id: 7, seatCount: 8 },
    { id: 8, seatCount: 0, tv: true },
    { id: 9, seatCount: 8 },
    { id: 10, seatCount: 8 },
    { id: 11, seatCount: 8 },
    { id: 12, seatCount: 8 },
    { id: 13, seatCount: 8 },
    { id: 14, seatCount: 6, doorrow: true, Wall: true },
    { id: 15, seatCount: 7 },
    { id: 16, seatCount: 7 },
    { id: 17, seatCount: 7 },
];

const ReservationMEdit = () => {
    const [selectedSeat, setSelectedSeat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lectureData, setLectureData] = useState(null);
    const [reservedSeats, setReservedSeats] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);

    // 모달 상태 (3가지 타입)
    const [modalType, setModalType] = useState(null); // 'already' | 'success' | 'no-seat' | null
    // 📌 새로 추가: 백엔드 에러 메시지 상태
    const [errorMessage, setErrorMessage] = useState(null);

    const navigate = useNavigate();
    const { movehome, movereservationRegiInfo, movemanageclassmodi } = Navigation();
    const location = useLocation();

    // lectureId 가져오기
    const datas = location.state?.data || {};
    const lectureId = datas?.lectureId

    // ✅ 정확한 좌석 번호 파싱 함수
    const parseSeatNumber = (seatString) => {
        if (!seatString) return null;
        const match = seatString.match(/(\d+호-)?(\d+)/);
        return match ? parseInt(match[2], 10) : null;
    };

    // 페이지 로드시 강의실 정보 및 좌석 상태 조회
    useEffect(() => {
        const fetchLectureInfo = async () => {
            try {
                setInitialLoading(true);

                console.log("🚀 API 호출: getLectureInfo(", lectureId, ")");
                const response = await authAPI.getLectureInfo(lectureId);

                console.log("✅ API 응답 받음");
                setLectureData(response.data);

                // ✅ 정확한 예약좌석 파싱
                const reserved = response.data.seats
                    ?.filter(seat => seat.status === "RESERVED")
                    ?.map(seat => {
                        const seatNum = parseSeatNumber(seat.seatNumber);
                        if (seatNum !== null) {
                            console.log(`🔒 예약좌석 파싱: ${seat.seatNumber} → ${seatNum}`);
                        }
                        return seatNum;
                    })
                    ?.filter(num => num !== null) || [];

                console.log("📋 최종 reservedSeats 배열:", reserved);
                setReservedSeats(reserved);

                const blocked = response.data.seats
                    ?.filter(seat => seat.status === "BLOCKED")
                    ?.map(seat => {
                        const seatNum = parseSeatNumber(seat.seatNumber);
                        if (seatNum !== null) {
                            console.log(`🔒 예약좌석 파싱: ${seat.seatNumber} → ${seatNum}`);
                        }
                        return seatNum;
                    })
                    ?.filter(num => num !== null) || [];

                console.log("📋 최종 blockedSeats 배열:", blocked);
                setSelectedSeat(blocked);

            } catch (error) {
                console.error("❌ 강의 정보 조회 실패:", error);
                alert("강의 정보를 불러오는데 실패했습니다.");
            } finally {
                setInitialLoading(false);
                console.log("🏁 데이터 로딩 완료!");
            }
        };

        if (lectureId) {
            fetchLectureInfo();
        } else {
            console.error("❌ lectureId가 없습니다!");
            setInitialLoading(false);
        }
    }, [lectureId]);

    let currentSeatNumber = 1;

    // 1. 다중 선택을 위한 클릭 핸들러 수정
    const handleSeatClick = (seatNo) => {
        if (loading) return;
        console.log(selectedSeat)
        setSelectedSeat((prev) => {
            // 이미 선택된 좌석 목록(배열)에 클릭한 번호가 있는지 확인
            if (prev.includes(seatNo)) {
                // 이미 있다면: 배열에서 해당 번호를 제거
                return prev.filter((id) => id !== seatNo);
            } else {
                // 없다면: 기존 배열에 새 번호 추가
                return [...prev, seatNo];
            }
        });
    };

    // 2. 좌석 렌더링 부분 수정
    const mapSeats = (count) => {
        return Array.from({ length: count }, (_, i) => {
            const seatNo = currentSeatNumber + i;
            const isReserved = reservedSeats.includes(seatNo);

            // [수정] selectedSeat가 배열이므로 includes를 사용해 체크
            const isSelected = selectedSeat.includes(seatNo);

            let className = `rsr-seat rsr-seat-${seatNo}`;
            if (isReserved) className += " rsr-seat-reserved";

            // 선택된 모든 좌석에 클래스 적용
            if (isSelected) className += " rsr-seat-selected";

            return (
                <button
                    key={seatNo}
                    className={className}
                    type="button"
                    disabled={loading || initialLoading}
                    onClick={() => handleSeatClick(seatNo)}
                >
                    {seatNo}
                </button>
            );
        });
    };

    //삭제하기 버튼 클릭 시
    const handleDelete = async () => {
        try {
            await authAPI.deleteclassreservation(lectureId);
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message ||
                "강의 삭제 중 오류가 발생했습니다. 다시 시도해 주세요."
            );
        }
    }

    // 📌 수정: 백엔드 message를 모달로 표시하는 handleEdit
    const handleEdit = async () => {
        const blockedSeatNumbers = selectedSeat.map((seat) => `${datas.classroomNum}-${seat}`);

        // 2. 서버가 요구하는 데이터 구조 생성
        const requestData = {
            classroomId: datas.classroomId,
            instructorId: datas.instructorId,
            subjectId: datas.subjectId,
            startTime: datas.startTime,
            endTime: datas.endTime,
            reservationOpenAt: datas.reservationOpenAt,
            reservationCloseAt: datas.reservationCloseAt,
            blockedSeatNumbers: blockedSeatNumbers // 가공한 배열 삽입
        };

        console.log("최종 전송 데이터:", requestData);
        try {
            const response = await authAPI.editclassreservation(lectureId, requestData);
            setModalType("success");
        } catch (error) {
            console.error("❌ 에러 응답:", error.response?.data);
            
            // 백엔드에서 message 필드가 오는 경우
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } 
            // 기존 특정 메시지 처리
            else if (error.response?.data === "예약자가 존재합니다. 삭제 후 다시 시도해주세요.") {
                setErrorMessage("예약자가 존재합니다. 삭제 후 다시 시도해주세요.");
            } 
            // 기본 에러 메시지
            else {
                setErrorMessage(
                    error.response?.data?.message ||
                    "강의 수정 중 오류가 발생했습니다. 다시 시도해 주세요."
                );
            }
        }
    }

    // 수정: 모달 닫기 (errorMessage도 리셋)
    const closeModal = () => {
        // 성공 모달이면 홈으로 이동
        if (modalType === "success") {
            movehome()
        }
        setModalType(null);
        setErrorMessage(null); 
    };

    if (initialLoading) {
        return (
            <div className="media-ct">
                <Header />
                <div className="loading-ct">좌석 상태를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="media-ct">
            <Header />
            <nav className="reservation-top-ct">
                <img src={MobileBackbtn} alt="모바일 뒤로가기 이미지" />
                <img src={reservationLogo} alt="중앙로고 이미지" />
                <img src={MobileProfileimg} alt="모바일 마이페이지 이미지" />
            </nav>

            <div className="reservation-total-ct">
                <div className="reservation-scroll-ct">
                    <p className="lecture-inf"> 예약 불가 자리 지정(복수 선택 가능) </p>

                    <section className="rsr-ct">
                        {/* 상단(음향, 칠판, 교탁) */}
                        <div className="rsr-header-ct">
                            <p className="rsr-sound-equipment"> 음향장비</p>
                            <article className="rsr-header-flex">
                                <p className="rsr-board">칠판</p>
                                <p className="rsr-desk">교탁</p>
                            </article>
                        </div>

                        <div className="rsr-rows-ct">
                            {Row_seat_chart.map((row) => {
                                const seats = row.seatCount > 0 ? mapSeats(row.seatCount) : null;

                                if (row.seatCount > 0) {
                                    currentSeatNumber += row.seatCount;
                                }

                                return (
                                    <div
                                        key={row.id}
                                        className={`rsr-row rsr-row-${row.id}`}
                                    >
                                        {row.door2row && <div className="rsr-door door2row" />}
                                        {row.doorrow && <div className="rsr-door doorrow" />}

                                        {row.tv ? (
                                            <div className="rsr-tv-ct">
                                                <p className="rsr-tv">TV</p>
                                                <p className="rsr-tv">TV</p>
                                            </div>
                                        ) : (
                                            <div className="rsr-seat-ct">{seats}</div>
                                        )}

                                        {row.Wall && <div className="rsr-wall" />}
                                    </div>
                                );
                            })}
                            <div className="seat-mobile-ct">
                                <section className="pick-seat-ct">
                                    <div className="pick-possible">
                                        <p className="e-seat-color-pp"></p>
                                        <p> 예약 가능 좌석 </p>
                                    </div>

                                    <div className="pick-already-complete">
                                        <p className="e-seat-color-ac"></p>
                                        <p> 예약 불가 좌석 지정 시 </p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </section>
                </div>

                {/* 오른쪽 예약 정보 영역 */}
                <div className="rsr-right-ct">
                    <p className="rsr-right-inf"> 예약 정보</p>

                    <section className="lector-inf-ct">
                        <p className="rsr-right-date">
                            {lectureData?.startTime
                                ? new Date(lectureData.startTime).toLocaleString("ko-KR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : "로딩 중..."}
                        </p>
                        <p className="rsr-right-date">
                            {lectureData?.lectureName || "로딩 중..."}
                        </p>
                    </section>

                    <article className="lector-classroom-ct">
                        <p>{lectureData?.instructorName || "로딩 중..."}</p>
                        <p className="lector-middle"> | </p>
                        <p>{lectureData?.classroomName || "로딩 중..."}</p>
                    </article>

                    <button
                        className='rsr-back-btn'
                        type="button"
                        onClick={() => { setModalType("prev") }}
                    >
                        이전
                    </button>
                    <button
                        className='rsr-delete-btn'
                        type="button"
                        onClick={() => { setModalType("delete") }}
                    >
                        삭제하기
                    </button>
                    <button
                        className='rsr-edit-btn'
                        type="button"
                        onClick={handleEdit}
                    >
                        수정완료
                    </button>
                </div>
            </div>

            {modalType && (
                <div className="reservation-modal-ct">
                    {modalType === "delete" && (
                        <TwoBtnModal
                            text="정말로 삭제하시겠습니까?"
                            btn1T="네"
                            btn2T="아니오"
                            btn1E={() => {
                                closeModal();
                                handleDelete();
                                setModalType("deleteCheck");
                            }}
                            btn2E={closeModal}
                        />
                    )}

                    {modalType === "deleteCheck" && (
                        <Modal text="삭제되었습니다." event={() => {
                            closeModal();
                            movereservationRegiInfo();
                        }} />
                    )}

                    {modalType === "success" && (
                        <Modal text="수정 완료되었습니다." event={() => {
                            closeModal();
                            movereservationRegiInfo();
                        }} />
                    )}

                    {modalType === "prev" && (
                        <TwoBtnModal
                            text={"수정사항이 저장되지 않습니다.\n되돌아가시겠습니까?"}
                            btn1T="네"
                            btn2T="아니오"
                            btn1E={() => {
                                closeModal();
                                movemanageclassmodi()
                            }}
                            btn2E={closeModal}
                        />
                    )}
                </div>
            )}

            {errorMessage && (
                <div className="reservation-modal-ct">
                    <Modal 
                        text={errorMessage} 
                        event={() => {
                            setErrorMessage(null);
                        }} 
                    />
                </div>
            )}
        </div>
    );
};

export default ReservationMEdit;
