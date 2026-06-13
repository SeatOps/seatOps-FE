import { Outlet, NavLink, useLocation } from 'react-router-dom';
import '../../css/common/Sidebar.css';

import SideActiveUser from '../../img/side-myinfo-img.svg';
import SideHome from '../../img/side-home-img.svg';
import SideSchedule from '../../img/side-schedule-img.svg';
import SideManager from '../../img/sidemanagerimg.svg';
import SideUser from '../../img/side-user-img2.svg';
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';

const Sidebar = () => {
  const location = useLocation();
  const isAdmin = useAdmin();

  // 예시: 로그인 페이지(/login)와 회원가입(/signup)에서는 관리자 메뉴 숨기기
  const hideManager =
    location.pathname === '/' ||
    location.pathname === '/signup' ||
    location.pathname === '/signup-normal' ||
    location.pathname === '/signupComplete';

  // ✅ 내 정보 메뉴 활성화 여부 확인
  const activePaths = ["/mypage", "/change-info"];
  const isMyPageActive = activePaths.includes(location.pathname);

  return (
    <div className="sidebar-ct">
      <aside className='side-ct'>
        <section className='side-content-ct'>

          <NavLink
            to="/home"
            className={({ isActive }) =>
              `side-home ${isActive ? 'side-active' : ''}`
            }
          >
            <img src={SideHome} alt="사이드 홈 이미지" />
            <p>홈</p>
          </NavLink>

          <NavLink
            to="/time"
            className={({ isActive }) =>
              `side-schedule ${isActive ? 'side-active' : ''}`
            }
          >
            <img src={SideSchedule} alt="사이드 일정 이미지" />
            <p>일정</p>
          </NavLink>

          {/* ✅ 내 정보 메뉴: 조건부 이미지 표시 */}
          <NavLink
            to="/mypage"
            className={() => `side-manager ${isMyPageActive ? 'side-active' : ''}`}
          >
            {/* 선택 시 SideActiveUser, 미선택 시 SideUser */}
            <img
              src={isMyPageActive ? SideActiveUser : SideUser}
              alt="사이드바 유저 이미지"
            />
            <p>내 정보</p>
          </NavLink>

          {/* ✅ 특정 페이지에서 관리자 숨기기 */}
          {!hideManager && isAdmin && (
            <NavLink
              to="/ReservationRegiInfo"
              className={() => {
                // 활성화하고 싶은 경로들을 배열에 담습니다.
                const activePaths = ["/ReservationInfo",
                  "/ReservationRegiInfo",
                  "/reservationeditadmin",
                  "/manage-check-class",
                  "/manage-modi-class",
                  "/reservationmedit",
                  "/class-info-regi",
                  "/manage-modi-class-info",
                  "/manage-user-info",
                  "/manage-acess-info",
                ];

                // 현재 경로(location.pathname)가 배열에 포함되어 있는지 확인합니다.
                const isCustomActive = activePaths.includes(location.pathname);

                return `side-manager ${isCustomActive ? 'side-active' : ''}`;
              }}
            >
              <img src={SideManager} alt="사이드 관리자 이미지" />
              <p>관리자</p>
            </NavLink>
          )}

        </section>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;
