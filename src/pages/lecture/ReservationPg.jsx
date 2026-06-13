import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/common/Header.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import '../../css/lecture/ReservationPg.css';
import '../../css/lecture/ReservationModal.css';
import MobileProfileimg from '../../img/mobile-profile.svg';
import MobileBackbtn from '../../img/backbtn.svg';
import reservationLogo from '../../img/reservation-logo-img.svg';
import { authAPI } from "../../components/common/apiClient.jsx";
import Navigation from "../../components/common/Navigate.jsx";
import '../../css/lecture/ReservationMedia.css'
import Modal from "../../components/common/Modal.jsx";

// 좌석 배치 설정 (레이아웃은 고정)
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

const ReservationPg = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lectureData, setLectureData] = useState(null);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const isSubmitting = React.useRef(false);

  // 모달 상태 
  const [modalType, setModalType] = useState(null); // 'already' | 'success' | 'no-seat' | 'sametime-reservation' | 'error-refresh'
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { movehome, movemypage } = Navigation();
  const location = useLocation();

  // 강의 구분 기준: lectureId (상위 페이지에서 반드시 넘겨줘야 함)
  const lectureId = location.state?.lectureId;

  useEffect(() => {
    const fetchLectureInfo = async () => {
      // lectureId가 없으면 API 호출하지 않게
      if (!lectureId) {
        setInitialLoading(false); // 무한 로딩 방지
        return;
      }

      try {
        setInitialLoading(true);
        const response = await authAPI.getLectureInfo(lectureId); 
        setLectureData(response.data);

        const classroomPrefix = `${response.data.classroomName}-`;

        // RESERVED, BLOCKED 좌석 번호만 추출
        const reserved = response.data.seats
          .filter(seat => seat.status === "RESERVED" || seat.status === "BLOCKED")
          .map(seat =>
            parseInt(seat.seatNumber.replace(classroomPrefix, ""), 10)
          );
        setReservedSeats(reserved);
      } catch (error) {
        setErrorMessage("강의 정보를 불러오는데 실패했습니다.");
        setModalType('error-refresh');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchLectureInfo();
  }, [lectureId]); 

  let currentSeatNumber = 1;

  const handleSeatClick = (seatNo) => {
    if (loading) return;

    // 이미 예약된 좌석 클릭 시 모달
    if (reservedSeats.includes(seatNo)) {
      setModalType("already");
      return;
    }

    setSelectedSeat((prev) => (prev === seatNo ? null : seatNo));
  };

  const mapSeats = (count) => {
    return Array.from({ length: count }, (_, i) => {
      const seatNo = currentSeatNumber + i;
      const isReserved = reservedSeats.includes(seatNo);
      const isSelected = selectedSeat === seatNo;

      let className = `rsr-seat rsr-seat-${seatNo}`;
      if (isReserved) className += " rsr-seat-reserved";
      else if (isSelected) className += " rsr-seat-selected";

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

  // 페이지 새로고침 함수
  const refreshPage = () => {
    window.location.reload();
  };

  // 예약하기 버튼 클릭 - 모든 alert 제거하고 모달로 통합
  const handleReserve = async () => {
    // 좌석 선택 안 했을 때
    if (!selectedSeat) {
      setModalType("no-seat");
      return;
    }

    // 아직 로딩 중이거나 lectureId/lectureData가 없으면 종료
    if (isSubmitting.current || loading || initialLoading || !lectureId || !lectureData) return;

    try {

      isSubmitting.current = true;

      setLoading(true);
      setModalType(null); // 기존 모달 닫기

      // classroomName 기반 seatNumber 생성
      const seatNumber = `${lectureData.classroomName}-${selectedSeat}`;

      const payload = {
        lectureId,   // 이 강의의 예약
        seatNumber,
      };

      await authAPI.reserveSeat(payload); // 좌석 예약 API 

      // 성공 모달
      setModalType("success");
    } catch (error) {
      console.error("예약 에러:", error);

      if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.message || "이미 예약된 좌석입니다.";

        // 동시 예약 충돌 감지
        if (errorMsg.includes("이미 예약된 좌석")) {
          setErrorMessage("이미 예약된 좌석입니다.");
          setModalType("sametime-reservation");
        } else {
          setErrorMessage(errorMsg);
          setModalType("error-refresh");
        }
      } else {
        // 기타 에러
        setErrorMessage("예약 중 오류가 발생했습니다.\n페이지를 새로고침해주세요.");
        setModalType("error-refresh");
      }
    } finally {
      setLoading(false);
      isSubmitting.current = false;

    }
  };

  // 모달 닫기
  // 모달 닫기 함수 수정
  const closeModal = () => {
    if (modalType === "success") {
      navigate("/home", {
        state: {
          dateText: lectureData?.startTime,
          title: lectureData?.lectureName,
          teacher: lectureData?.instructorName,
          classroom: lectureData?.classroomName,
          seatNumber: selectedSeat,
        },
      });
    } else if (modalType === "sametime-reservation") {
      // sametime-reservation 모달에서 확인 클릭 시 새로고침
      refreshPage();
    } else if (modalType === "error-refresh") {
      // 새로고침 모달에서는 닫지 않고 새로고침만
      return;
    }
    setModalType(null);
    setErrorMessage('');
  };


  // lectureId가 아예 없을 때 사용자에게 안내 (선택사항)
  if (!lectureId && !initialLoading) {
    return (
      <div className="media-ct">
        <Header />
        <div className="loading-ct">
          강의 정보가 없습니다. 강의를 먼저 선택해 주세요.
        </div>
      </div>
    );
  }

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
        <img src={MobileBackbtn} onClick={movehome} alt="모바일 뒤로가기 이미지" />
        <img src={reservationLogo} alt="중앙로고 이미지" />
        <img src={MobileProfileimg} onClick={movemypage} alt="모바일 마이페이지 이미지" />
      </nav>

      <div className="reservation-total-ct">
        <div className="reservation-scroll-ct">
          <p className="lecture-inf"> 강좌 정보 </p>

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
                    <p className="seat-color-pp"></p>
                    <p> 예약 가능 좌석 </p>
                  </div>

                  <div className="pick-already-complete">
                    <p className="seat-color-ac"></p>
                    <p> 예약 완료 좌석 </p>
                  </div>

                  <div className="pick-already-complete">
                    <p className="seat-color-ac2"></p>
                    <p> 내 좌석 선택 </p>
                  </div>
                </section>
              </div>
            </div>

            <button
              className={`rsr-reservation-btn2 ${selectedSeat && !loading ? "rsr-reservation-btn-active" : ""}`}
              type="button"
              disabled={loading || initialLoading}
              onClick={handleReserve}
            >
              {loading ? "예약 중..." : "예약하기"}
            </button>
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
            onClick={movehome}
          >
            이전
          </button>
          <button
            className={`rsr-reservation-btn ${selectedSeat && !loading ? "rsr-reservation-btn-active" : ""}`}
            type="button"
            disabled={loading || initialLoading}
            onClick={handleReserve}
          >
            {loading ? "예약 중..." : "예약하기"}
          </button>
        </div>
      </div>

      {modalType && (
        <div className="reservation-modal-ct">
          {modalType === "already" && (
            <Modal text="이미 예약된 좌석입니다." event={() => {
              closeModal();
            }} />
          )}
          {modalType === "success" && (

            <Modal text="예약이 완료되었습니다." event={() => {
              closeModal();
            }} />
          )}
          {modalType === "no-seat" && (
            <Modal text="자리를 먼저 선정해 주세요." event={() => {
              closeModal();
            }} />
          )}
          {modalType === "sametime-reservation" && (

            <Modal text={errorMessage} event={() => {
              closeModal();
            }} />
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationPg;
