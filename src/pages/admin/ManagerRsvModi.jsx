import Header from "../../components/common/Header.jsx";
import ManageReserveHeader from "../../components/admin/ManageReserveHeader.jsx";
import ReservationModi from "../../components/admin/ReservationModi.jsx";
import scroll from "../../css/common/scroll.module.css"

function ManagerRsvModi() {
    return (
        <div className={scroll.scroll}>
            <Header />
            <ManageReserveHeader page={"reservation"} />


            <section className={scroll.scroll_section}>
                <ReservationModi />
            </section>
        </div>
    )
}

export default ManagerRsvModi;