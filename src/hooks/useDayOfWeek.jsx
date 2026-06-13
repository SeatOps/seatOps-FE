import { useState, useEffect } from 'react';

export const useDayOfWeek = (dateString) => {
    const [dayName, setDayName] = useState("");

    useEffect(() => {
        if (!dateString) {
            setDayName("");
            return;
        }

        const week = ['일', '월', '화', '수', '목', '금', '토'];
        const year = dateString.slice(0, 4);
        const month = dateString.slice(5, 7);
        const day = dateString.slice(8, 10);

        const date = new Date(year, parseInt(month) - 1, day);
        const dayIndex = date.getDay();

        setDayName(week[dayIndex]);
    }, [dateString]);

    return dayName;
};