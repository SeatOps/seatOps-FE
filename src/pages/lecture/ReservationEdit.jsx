import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/common/Header";
import { useNavigate, useLocation } from "react-router-dom";
import '../../css/lecture/ReservationPg.css'
import '../../css/lecture/ReservationModal.css'
import '../../css/lecture/ReservationEdit.css'
import MobileProfileimg from '../../img/mobile-profile.svg'
import MobileBackbtn from '../../img/backbtn.svg'
import reservationLogo from '../../img/reservation-logo-img.svg'
import { authAPI } from "../../components/common/apiClient"
import Navigation from "../../components/common/Navigate";
import Modal from "../../components/common/Modal";

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

const ReservationEdit = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lectureData, setLectureData] = useState(null);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [mySeatNumber, setMySeatNumber] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [modalType, setModalType] = useState(null); // 'already' | 'success' | 'no-seat' | 'sametime-reservation' | 'error-refresh'
  const [errorMessage, setErrorMessage] = useState('');

  const isInitialLog = useRef(true);
  const debugInfo = useRef({});

  const navigate = useNavigate();
  const { movehome } = Navigation();
  const location = useLocation();

  // 정확한 좌석 번호 파싱 함수
  const parseSeatNumber = (seatString) => {
    if (!seatString) return null;
    const match = seatString.match(/(\d+호-)?(\d+)/);
    return match ? parseInt(match[2], 10) : null;
  };

  // 페이지 새로고침 함수
  const refreshPage = () => {
    window.location.reload();
  };

  // location.state에서 데이터 가져오기
  const lectureId = location.state?.lectureId;
  const reservationId = location.state?.reservationId;
  const initialMySeatNumberRaw = location.state?.mySeatNumber;

  // 초기 진입 로그 (1회만)
  useEffect(() => {
    if (isInitialLog.current) {
      isInitialLog.current = false;
    }
  }, [lectureId, reservationId, initialMySeatNumberRaw]);

  useEffect(() => {
    const fetchLectureInfo = async () => {
      try {
        setInitialLoading(true);
        debugInfo.current.apiStart = Date.now();

        const response = await authAPI.getLectureInfo(lectureId);

        setLectureData(response.data);

        // 정확한 예약좌석 파싱
        const reserved = response.data.seats
          ?.filter(seat => seat.status === "RESERVED" || seat.status === "BLOCKED")
          ?.map(seat => {
            const seatNum = parseSeatNumber(seat.seatNumber);
            if (seatNum !== null) {
              console.log('예약좌석');
            }
            return seatNum;
          })
          ?.filter(num => num !== null) || [];

        setReservedSeats(reserved);

        // ✅ 정확한 내 자리 파싱
        const parsedMySeat = parseSeatNumber(initialMySeatNumberRaw);
        setMySeatNumber(parsedMySeat);

      } catch (error) {
        setErrorMessage("강의 정보를 불러오는데 실패했습니다.");
        setModalType('error-refresh');
      } finally {
        setInitialLoading(false);
      }
    };

    if (lectureId) {
      fetchLectureInfo();
    } else {
      setInitialLoading(false);
    }
  }, [lectureId, initialMySeatNumberRaw]);

  let currentSeatNumber = 1;

  const handleSeatClick = (seatNo) => {
    if (loading || initialLoading) return;

    console.log('좌석 클릭');

    // 이미 예약된 좌석 (내 좌석 제외) 클릭 시 모달
    if (reservedSeats.includes(seatNo) && seatNo !== mySeatNumber) {
      setModalType("already");
      return;
    }

    // 내 현재 좌석 클릭 시 선택 해제
    if (seatNo === mySeatNumber) {
      setSelectedSeat(null);
      return;
    }

    // 다른 자리 토글 선택
    setSelectedSeat((prev) => {
      const newSelected = prev === seatNo ? null : seatNo;
      return newSelected;
    });
  };

  const mapSeats = (count) => {
    return Array.from({ length: count }, (_, i) => {
      const seatNo = currentSeatNumber + i;
      const isReserved = reservedSeats.includes(seatNo);
      const isMySeat = seatNo === mySeatNumber;
      const isSelected = selectedSeat === seatNo;

      let className = `rsr-seat rsr-seat-${seatNo}`;

      //우선순위: 내자리 > 선택 > 예약
      if (isMySeat) {
        className += " rsredit-my-seat";
        // 내 자리 발견 로그 (1회만)
        if (!debugInfo.current.mySeatFound) {
          debugInfo.current.mySeatFound = true;
        }
      } else if (isSelected) {
        className += " rsredit-seat-selected";
      } else if (isReserved) {
        className += " rsredit-seat-reserved";
        // 예약 자리 발견 로그 (1회만)
        if (!debugInfo.current.reservedSeatsFound) {
          debugInfo.current.reservedSeatsFound = true;
        }
      }

      return (
        <button
          key={seatNo}
          className={className}
          type="button"
          disabled={loading || initialLoading}
          onClick={() => handleSeatClick(seatNo)}
          title={
            isMySeat ? `현재 내 자리 (${seatNo})` :
              isSelected ? `선택된 자리 (${seatNo})` :
                isReserved ? `예약된 자리 (${seatNo})` :
                  `선택 가능 (${seatNo})`
          }
        >
          {seatNo}
        </button>
      );
    });
  };

  // 좌석 변경 API 호출 - 400 에러 처리 추가 + alert 완전 제거
  const handleUpdateReservation = async () => {
    if (!selectedSeat) {
      setModalType("no-seat");
      return;
    }

    if (loading || initialLoading) return;

    try {
      setLoading(true);
      setModalType(null); // 기존 모달 닫기

      const payload = {
        seatNumber: `${lectureData?.classroomName || '603호'}-${selectedSeat}`,
      };

      await authAPI.updateMyReservation(reservationId, payload);

      setModalType("success");
    } catch (error) {
      console.error("❌ 좌석 변경 실패:");

      // 모든 에러를 모달로 처리
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
        setErrorMessage("좌석 변경 중 오류가 발생했습니다.\n페이지를 새로고침해주세요.");
        setModalType("error-refresh");
      }
    } finally {
      setLoading(false);
    }
  };

  // 모달 닫기 - sametime-reservation에서 새로고침
  const closeModal = () => {
    if (modalType === "success") {
      navigate("/mypage", {
        state: {
          dateText: lectureData?.startTime,
          title: lectureData?.lectureName,
          teacher: lectureData?.instructorName,
          classroom: lectureData?.classroomName,
          seatNumber: selectedSeat,
        },
      });
    } else if (modalType === "sametime-reservation") {
      refreshPage();
    } else if (modalType === "error-refresh") {
      // 새로고침 모달에서는 닫지 않고 새로고침만
      return;
    }
    setModalType(null);
    setErrorMessage('');
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
    <div className="media-c term-all-scroll-ct">
      <Header />
      <nav className="reservation-top-ct">
        <img src={MobileBackbtn} alt="뒤로가기" onClick={() => navigate(-1)} />
        <img src={reservationLogo} alt="로고" />
        <img src={MobileProfileimg} alt="프로필" />
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
                  <div key={row.id} className={`rsr-row rsr-row-${row.id}`}>
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
                    <p> 예약된 좌석 </p>
                  </div>
                  <div className="pick-already-complete">
                    <p className="e-seat-color-ac"></p>
                    <p> 현재 내 좌석 </p>
                  </div>
                  <div className="pick-already-complete">
                    <p className="e-seat-color-ac2"></p>
                    <p> 변경할 좌석 </p>
                  </div>
                </section>
              </div>
            </div>

            <button
              className={`rsr-reservation-btn2 ${selectedSeat && !loading ? "rsr-reservation-btn-active" : ""}`}
              type="button"
              disabled={loading || initialLoading || !mySeatNumber}
              onClick={handleUpdateReservation}
            >
              {loading ? "변경 중..." : "변경하기"}
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

          <button className='rsr-back-btn' type="button" onClick={() => navigate(-1)}>
            이전
          </button>
          <button
            className={`rsr-reservation-btn ${selectedSeat && !loading ? "rsr-reservation-btn-active" : ""}`}
            type="button"
            disabled={loading || initialLoading || !mySeatNumber}
            onClick={handleUpdateReservation}
          >
            {loading ? "변경 중..." : "변경하기"}
          </button>
        </div>
      </div>

      {modalType && (
        <div className="reservation-modal-ct">
          {modalType === "already" && (
            <Modal text={"이미 예약된 좌석입니다."} event={() => {
              closeModal();
            }} />

          )}
          {modalType === "success" && (
            <Modal text={"좌석 변경이 완료되었습니다!"} event={() => {
              closeModal();
            }} />
          )}
          {modalType === "no-seat" && (
            <Modal text={"변경할 자리를 먼저 선정해 주세요."} event={() => {
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

export default ReservationEdit;
