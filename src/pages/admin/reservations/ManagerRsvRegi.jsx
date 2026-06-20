import Header from "../../../components/common/Header.jsx";
import ReservationForm from "../../../components/admin/ReservationForm.jsx";
import ManageReserveHeader from "../../../components/admin/ManageReserveHeader.jsx";
import scroll from "../../../css/common/scroll.module.css"

function ManagerRsvRegi() {


    return (
        <div className={scroll.scroll}>
            <Header />
            <ManageReserveHeader page={"reservation"} />


            <section className={scroll.scroll_section}>
                <ReservationForm />
            </section>
        </div>
    )
}

export default ManagerRsvRegi;