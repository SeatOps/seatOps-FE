import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/main/Home";
import Login from "../pages/auth/Login";
import IdFind from "../pages/auth/IdFind";
import IdFind2 from "../pages/auth/IdFind2";
import PasswordFind from "../pages/auth/PasswordFind";
import PswRessting from "../pages/auth/PswResetting";
import PswChangeComplete from "../pages/auth/PswChangeComplete";
import SignUp from "../pages/auth/SignUp";
import SNSsignup from "../pages/auth/SNSsignup";
import SignUpNormal from "../pages/auth/LocalSignUp";
import ExistingMemberSignUp from "../pages/auth/ExistingMemberSignUp";
import ExistingSignup2 from "../pages/auth/ExistingSignup2";
import SignUpComplete from "../pages/auth/SignUpComplete";
import SNSCookie from "../pages/auth/SNSCookie";
import MyPage from "../pages/mypage/MyPage";
import ReservationPg from "../pages/lecture/ReservationPg";
import Header from "../components/common/Header";
import ManageReserveHeader from "../components/admin/ManageReserveHeader";

export const SeatOpsRouter = createBrowserRouter([
    {
        path: '/',
        element: <Header />,//레이아웃
        children =[
            {
                index: true,
                element: <Home />
            },
            {
                path: 'calendar',
                element: <TimeCheck />
            },
            {
                path: 'schedule',
                element: <ClassApply />
            },
            //로그인
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'login/find-id',
                element: <IdFind />
            },
            {
                path: 'login/id/check',
                element: <IdFind2 />
            },
            {
                path: 'login/pwd/find',
                element: <PasswordFind />
            },
            {
                path: 'login/pwd/reset',
                element: <PswRessting />
            },
            {
                path: 'login/pwd/change',
                element: <PswChangeComplete />
            },
            //회원가입
            {
                path: 'regist',
                element: <SignUp />
            },
            {
                path: 'regist/sns',
                element: <SNSsignup />
            },
            {
                path: 'regist/normal',
                element: <SignUpNormal />
            },
            {
                path: 'regist/exist1',
                element: <ExistingMemberSignUp />
            },
            {
                path: 'regist/exist2',
                element: <ExistingSignup2 />
            },
            {
                path: 'regist/comp',
                element: <SignUpComplete />
            },
            {
                path: 'regist/cookies',
                element: <SNSCookie />
            },
            //예약
            {
                path: 'reservation/:id',
                element: <ReservationPg />
            },
            //마이페이지
            {
                path: 'mypage',
                element: <MyPage />
            },
            //관리자
            {
                path: 'admin',
                element: <ManageReserveHeader />,
                children: [
                    {
                        path: 'reservations',
                    },
                    {
                        path: 'reservations/:id/bookers',
                    },
                    {
                        path: 'reservations/:id/lecture',
                    },
                    {
                        path: 'reservations/:id/lecture/edit1',
                    },
                    {
                        path: 'reservations/:id/lecture/edit2',
                    },
                    {
                        path: 'reservations/:id/bookers/:userId',
                    },
                    {
                        path: 'reservations/regist1',
                    },
                    {
                        path: 'reservations/regist2',
                    },
                    {
                        path: 'lectures/regist',
                    },
                    {
                        path: 'lectures/edit',
                    },
                    {
                        path: 'students',
                    },
                    {
                        path: 'lectures/approval',
                    }
                ]
            }
        ]
    }
])