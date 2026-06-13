import { useEffect, useState } from 'react';
import '../../css/calendar/Calender.css';
import CalenderDate from './CalenderDate';
import nextBtn from '../../img/calender-next-btn.svg';
import prevBtn from '../../img/calender-prev-btn.svg';

function Calender({ clickDate, classData }) {
    const [calenderInfo, setCalenderInfo] = useState({
        year: 0,
        month: 0,
        monthIndex: 0,
        date: 0,
        firstDayOfWeek: 0,
        lastDate: 0,
        beforeLastdate: 0
    });

    const [totalDates, setTotalDates] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [viewDate, setViewDate] = useState(new Date());

    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth() + 1;
    const todayDate = now.getDate();

    const isCurrentMonth =
        viewDate.getMonth() === now.getMonth() &&
        viewDate.getFullYear() === now.getFullYear();

    useEffect(() => {
        getCalendarData(viewDate);
    }, [viewDate]);

    useEffect(() => {
        calenderList();
    }, [calenderInfo, classData]);

    // ✅ 달력 날짜 목록(totalDates)이 변경될 때 오늘 날짜를 찾아 선택 상태로 만듦
    useEffect(() => {
        if (totalDates.length > 0 && isCurrentMonth) {
            const todayItem = totalDates.find(item =>
                item.month === todayMonth && item.date === todayDate
            );

            if (todayItem) {
                setSelectedId(todayItem.id);
                // 부모 컴포넌트에도 초기 선택값으로 오늘 날짜를 전달
                clickDate({
                    year: todayYear,
                    month: todayMonth,
                    day: todayDate
                });
            }
        }
    }, [totalDates, isCurrentMonth]); // 달력 데이터가 생성되었을 때 실행

    function getCalendarData(baseDate) {
        const year = baseDate.getFullYear();
        const monthIndex = baseDate.getMonth();
        const month = monthIndex + 1;

        const beforeLastdate = new Date(year, monthIndex, 0).getDate();
        const firstDay = new Date(year, monthIndex, 1);
        const firstDayOfWeek = firstDay.getDay();
        const lastDate = new Date(year, month, 0).getDate();
        const date = baseDate.getDate();

        setCalenderInfo({
            year, month, monthIndex, date, firstDayOfWeek, lastDate, beforeLastdate,
        });
    }

    const handleNextMonth = () => {
        if (isCurrentMonth) {
            const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
            setViewDate(next);
            setSelectedId(null);
        }
    };

    const handlePrevMonth = () => {
        if (!isCurrentMonth) {
            setViewDate(new Date());
            setSelectedId(null);
        }
    };

    const calenderList = () => {
        const { year, firstDayOfWeek, lastDate, beforeLastdate, monthIndex } = calenderInfo;
        const currentMonth = monthIndex + 1;
        const prevMonth = (monthIndex === 0) ? 12 : monthIndex;
        const nextMonth = (monthIndex === 11) ? 1 : monthIndex + 2;

        const checkLecture = (m, d) => {
            if (!classData) return false;
            return classData.some(lecture => {
                const lDate = new Date(lecture.startTime);
                return (
                    lDate.getFullYear() === year &&
                    (lDate.getMonth() + 1) === m &&
                    lDate.getDate() === d
                );
            });
        };

        let totalDatesTemp = [];

        if (firstDayOfWeek === 0) {
            const currentDatas = Array.from({ length: lastDate }, (v, i) => ({
                date: i + 1,
                month: currentMonth,
                hasLecture: checkLecture(currentMonth, i + 1)
            }));
            const nextDates = Array.from({ length: 35 - lastDate }, (v, i) => ({
                date: i + 1,
                month: nextMonth,
                hasLecture: checkLecture(nextMonth, i + 1)
            }));
            totalDatesTemp = [...currentDatas, ...nextDates];
        } else {
            const prevDates = Array.from({ length: firstDayOfWeek }, (v, i) => {
                const day = beforeLastdate - firstDayOfWeek + 1 + i;
                return {
                    date: day,
                    month: prevMonth,
                    hasLecture: checkLecture(prevMonth, day)
                };
            });
            const currentDates = Array.from({ length: lastDate }, (v, i) => ({
                date: i + 1,
                month: currentMonth,
                hasLecture: checkLecture(currentMonth, i + 1)
            }));
            const nextDates = Array.from({ length: 35 - lastDate - firstDayOfWeek }, (v, i) => {
                const day = i + 1;
                return {
                    date: day,
                    month: nextMonth,
                    hasLecture: checkLecture(nextMonth, day)
                };
            });
            totalDatesTemp = [...prevDates, ...currentDates, ...nextDates];
        }

        const finalTotalDates = totalDatesTemp.map((dateItem, index) => ({
            ...dateItem,
            id: index
        }));

        setTotalDates(finalTotalDates);
    };

    return (
        <div className="calender-div">
            <div className='calender-month'>
                <button onClick={handlePrevMonth} disabled={isCurrentMonth} className={isCurrentMonth ? 'btn-disabled' : ''}>
                    <img src={prevBtn} alt="이전달" />
                </button>
                <p>{calenderInfo.month}월</p>
                <button onClick={handleNextMonth} disabled={!isCurrentMonth} className={!isCurrentMonth ? 'btn-disabled' : ''}>
                    <img src={nextBtn} alt="다음달" />
                </button>
            </div>

            <div className="total-date-ct">
                {totalDates.map((totalDate) => (
                    <CalenderDate
                        key={totalDate.id}
                        {...totalDate}
                        currentMonth={calenderInfo.month}
                        isActive={selectedId === totalDate.id}
                        isToday={
                            calenderInfo.year === todayYear &&
                            totalDate.month === todayMonth &&
                            totalDate.date === todayDate
                        }
                        clickDate={() => {
                            setSelectedId(totalDate.id);
                            clickDate({
                                year: calenderInfo.year,
                                month: totalDate.month,
                                day: totalDate.date
                            });
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default Calender;