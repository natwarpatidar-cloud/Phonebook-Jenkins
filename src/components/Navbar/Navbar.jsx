import { CircleUserRound, FilterIcon, LogOutIcon, Search } from "lucide-react";
import Plus from '/plus.png';
import { useDisclosure } from "@chakra-ui/react";
import ContactModal from "../Modal/ContactModal";
import { useEffect, useState } from "react";
import { useDebounce } from '../../hooks/useDebounce';
import { useDispatch } from "react-redux";
import { setRefreshKey, setSearchQuery } from "../../context/contactSlice";
import FilterModal from "../Modal/FilterModal";
import { logout } from '../../context/authSlice';

export default function Navbar () {

    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
    const [search, setSearch] = useState("");
    const debounceVal = useDebounce(search, 1000);

    function onSearch (val) {
        dispatch(setSearchQuery(val));  
    }

    useEffect(() => {
        if(debounceVal) {
            onSearch(debounceVal);
        }
    }, [onSearch, debounceVal]);

    useEffect(() => {
        if(search == "") {
            dispatch(setSearchQuery(search));
        };
    }, [search]);

    return (
        <>
        <FilterModal onClose={onFilterClose} isOpen={isFilterOpen} />
        <ContactModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} title={"Add contact form"} buttonText={"Add contact"} onSuccess={() => dispatch(setRefreshKey(1))} />
        <div className="w-full flex justify-center text-black/70 font-semibold text-lg">
            <div className="py-2 w-full flex justify-between items-center mt-4">
                <div className="flex gap-2">
                    <CircleUserRound />
                    <span>Phonebook</span>
                </div>

                <div className="border border-black/2 rounded-lg">
                    <div className="shadow-sm rounded-lg flex justify-center p-2 gap-2">
                        <Search className="text-black/50" />
                        <input type="text" value={search} name="searchQuery" onChange={(e) => setSearch(e.target.value)} className="outline-none" placeholder="Search" />
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="hover:bg-black/30 p-2 rounded-2xl cursor-pointer" onClick={onFilterOpen}>
                        <FilterIcon />
                    </div>
                    <div className="border border-black/10 shadow-sm px-3 py-2 cursor-pointer rounded-2xl flex  gap-2 items-center" onClick={onOpen}>
                        <img src={Plus} className="h-10 w-10 filter" />
                        <button className="text-black/70">
                            Create contact
                        </button>
                    </div>
                    <div className="cursor-pointer hover:bg-cyan-100 p-2 rounded-xl" onClick={() => dispatch(logout())}>
                        <LogOutIcon />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}