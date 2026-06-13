// hooks/useAdmin.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const useAdmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkAdmin = () => {
            const token = localStorage.getItem("accessToken");
            if (!token) return false;

            try {
                const decoded = jwtDecode(token);
                // 토큰 만료 여부도 함께 체크해주면 더 안전합니다.
                return decoded.role === "ROLE_ADMIN";
            } catch (error) {
                return false;
            }
        };

        setIsAdmin(checkAdmin());
    }, [location]);

    return isAdmin;
};