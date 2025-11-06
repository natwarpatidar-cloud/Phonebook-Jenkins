import ContactTable from "../components/ContactTable/ContactTable";
import Navbar from "../components/Navbar/Navbar";

export default function Contacts () {
    return (
        <div className="space-y-6 px-12 h-[100vh]">
            <Navbar />
            <ContactTable />
        </div>
    )
}