import hom from '../../css/main/Home.module.css';
import ClassCtWeb from '../../components/common/ClassCtWeb';
import Navigation from '../../components/common/Navigate';
import Header from '../../components/common/Header';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { authAPI } from '../../components/common/apiClient';
import ClassCt from '../../components/common/ClassCt';
import scroll from "../../css/common/scroll.module.css";
import banner from "../../img/bannerLast.svg";
import cafe from "../../img/cafe.svg";
import classApplyBtn from "../../img/class-apply-btn.svg"
import MobileHeader from '../../components/main/MobileHeader'
import { useMediaQuery } from 'react-responsive'; import MyClassInfo from './MyClassInfo';
import ReservationListHome from './ReservationListHome';
;



function Home() {
  const { moveclassaply, movemypage } = Navigation();
  const location = useLocation();

  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const [myClassData, setMyClassData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [token, setToken] = useState(null);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seatNum, setSeatNum] = useState('');

  const handleClick = () => {
    window.open('https://blog.naver.com/daechanyt', '_blank');  // 새 탭
  };





  const changeDate = (data) => {
    if (!data || !data.startTime) return;
    const date1 = data.startTime.slice(5, 10);
    const date2 = date1.replace('-', '.');
    setDate(date2);
    const time1 = data.startTime.slice(11, 16);
    setTime(time1);
    const seat = data.mySeatNumber.slice(5, 8)
    setSeatNum(seat);


  }
  useEffect(() => {
    const preloadBanner = new Image();
    preloadBanner.src = banner;
  }, []);


  useEffect(() => {

    const fetchMyLectures = async () => {
      try {
        const response = await authAPI.getMyReservations();

        if (response.data && response.data.length > 0) {

          const firstLecture = response.data[0];
          setMyClassData(firstLecture);
          changeDate(firstLecture);
        } else {
          setToken(true);
        }
      } catch (err) {
        console.error("내 예약 로딩 실패:", err);
      }
    };

    //전체 강의 목록 조회
    const fetchLectures = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getLectureList();
        setClassData(response.data);

      } catch (err) {
        console.error("강의 목록 로딩 실패:", err);
        setError(err.response?.status || 500);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();

    const atoken = localStorage.getItem('accessToken');

    if (atoken) {
      setToken(false);
      fetchMyLectures();
    }
  }, []);



  const NoneClass = token ? hom.block : hom.none;
  const blockClass = token ? hom.none : hom.block;


  return (
    <div className={scroll.scroll}>
      <div className={scroll.scroll_section}>
        {isDesktop ? <Header /> : <MobileHeader />}
        <section className={`${hom.main_home_ct}`}>
          <div>
            <MyClassInfo NoneClass={NoneClass} blockClass={blockClass} moveclassaply={moveclassaply} date={date} time={time} seatNum={seatNum} myClassData={myClassData} movemypage={movemypage} />

            <div className={hom.my_class_web}>
              <img src={banner} />
              <button onClick={handleClick}>시대원 영통 블로그 바로가기<img src={cafe}></img></button>
            </div>

            <div className={hom.class_button_ct}>
              <button className={hom.class_apply_btn} onClick={moveclassaply}>
                <p>좌석 예약</p><img src={classApplyBtn} />
              </button>
              {/*<button className={hom.class_check_btn} onClick={moveclassaply}>
              <p>인강 신청</p>
            </button>*/}

            </div>

            <ReservationListHome classData={classData} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
