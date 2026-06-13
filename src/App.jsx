import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import './App.css';
import './reset.css'
import Sidebar from './components/common/Sidebar.jsx'
import Login from './pages/auth/Login.jsx';
import SignUp from './pages/auth/SignUp.jsx';
import SignUpNormal from './pages/auth/LocalSignUp.jsx';
import Home from './pages/main/Home.jsx';
import ClassApply from './pages/main/ClassApply.jsx';
import TimeCheck from './pages/calendar/TimeCheck.jsx';
import SignUpComplete from './pages/auth/SignUpComplete.jsx';
import ReservationPg from './pages/lecture/ReservationPg.jsx';
import ManagerRsvRegi from './pages/admin/ManagerRsvRegi.jsx';
import ManagerRsvRegiInfo from './pages/admin/ManageRsvRegiInfo.jsx';
import ManagerRsvInfo from './pages/admin/ManageRsvInfo.jsx';
import TermConditionAgree from './pages/auth/Terms_Condition._Agree.jsx';

import MyPage from './pages/mypage/MyPage.jsx';
import MyClassInfo from './pages/mypage/MyClassInfo.jsx';
import MyInfo from './pages/mypage/MyInfo.jsx';
import CheckPassword from './pages/mypage/CheckPassword.jsx';
import ParentPassword from './pages/mypage/ParentPassword.jsx';
import ChangeInfo from './pages/mypage/ChangeInfo.jsx';
import TermAllAgree from './pages/auth/TermAllAgree.jsx';
import TermPersonalInf from './pages/auth/TermPersonalInf.jsx';
import TermMarketing from './pages/auth/TermMarketing.jsx';
import PasswordFind from './pages/auth/PasswordFind.jsx';
import IdFind from './pages/auth/IdFind.jsx';
import IdFind2 from './pages/auth/IdFind2.jsx';
import PswRessting from './pages/auth/PswResetting.jsx';
import PswChangeComplete from './pages/auth/PswChangeComplete.jsx';
import ClassInfoRegi from './pages/admin/ClassInfoRegi.jsx';
import ManageAcessUser from './pages/admin/ManageAcessUser.jsx';
import ManageUserInfo from './pages/admin/ManageUserInfo.jsx';
import ManageClassInfo from './pages/admin/ManageClassInfo.jsx';
import ManagerRsvModi from './pages/admin/ManagerRsvModi.jsx';
import ClassInfoModi from './pages/admin/ClassInfoModi.jsx';
import ReservationEdit from './pages/lecture/ReservationEdit.jsx';
import ReservationMEdit from './pages/admin/ReservationMEdit.jsx';
import ReservationMRegi from './pages/admin/ReservationMRegi.jsx';
import SNSCookie from './pages/auth/SNSCookie.jsx';
import ReservationEditAdmin from './pages/admin/ReservationEditAdmin.jsx';
import SNSsignup from './pages/auth/SNSsignup.jsx';
import ExistingMemberSignUp from './pages/auth/ExistingMemberSignUp.jsx';
import ExistingSignup2 from './pages/auth/ExistingSignup2.jsx';



function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route element={<Sidebar />}>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/snssignup" element={<SNSsignup />} />
            <Route path="/signup-normal" element={<SignUpNormal />} />
            <Route path="/existingsignup" element={<ExistingMemberSignUp />} />
            <Route path="/existingsignup2" element={<ExistingSignup2 />} />
            <Route path="/signupComplete" element={<SignUpComplete />} />
            <Route path="/termcondition" element={<TermConditionAgree />} />
            <Route path="/idfind" element={<IdFind />} />
            <Route path="/idfind2" element={<IdFind2 />} />
            <Route path="/pswfind" element={<PasswordFind />} />
            <Route path="/pswreseting" element={<PswRessting />} />
            <Route path="/pswchangecomplete" element={<PswChangeComplete />} />
            <Route path="/termallagree" element={<TermAllAgree />} />
            <Route path="/termpersoninf" element={<TermPersonalInf />} />
            <Route path="/termmarketing" element={<TermMarketing />} />
            <Route path="/cookie" element={<SNSCookie />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/reservation" element={<ReservationPg />} />
              <Route path="/reservationedit" element={<ReservationEdit />} />
              <Route path="/reservationeditadmin" element={<ReservationEditAdmin />} />
              <Route path="/home" element={<Home />} />
              <Route path="/apply" element={<ClassApply />} />
              <Route path="/time" element={<TimeCheck />} />
              <Route path="/ReservationRegi" element={<ManagerRsvRegi />} />
              <Route path="/ReservationRegiInfo" element={<ManagerRsvRegiInfo />} />
              <Route path="/ReservationInfo" element={<ManagerRsvInfo />} />
              <Route path="/reservationmedit" element={<ReservationMEdit />} />
              <Route path='/reservationmregi' element={<ReservationMRegi />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/myClassInfo" element={<MyClassInfo />} />
              <Route path='/myInfo' element={<MyInfo />} />
              <Route path="/password" element={<CheckPassword />} />
              <Route path="/parent-password" element={<ParentPassword />} />
              <Route path='/change-info' element={<ChangeInfo />} />
              <Route path='/class-info-regi' element={<ClassInfoRegi />} />
              <Route path='/manage-user-info' element={<ManageUserInfo />} />
              <Route path='/manage-acess-info' element={<ManageAcessUser />} />
              <Route path='/manage-check-class' element={<ManageClassInfo />} />
              <Route path='/manage-modi-class' element={<ManagerRsvModi />} />
              <Route path='/manage-modi-class-info' element={<ClassInfoModi />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter >
    </AuthProvider>
  );
}

export default App;
