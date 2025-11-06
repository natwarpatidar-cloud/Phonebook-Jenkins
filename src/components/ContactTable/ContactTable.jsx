import { useRef, useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  Tag,
} from '@chakra-ui/react';
import ContactModal from "../Modal/ContactModal";
import ConfirmationModal from "../Modal/ConfirmationModal";
import { BookmarkMinus, BookmarkPlus, Edit, Trash2 } from "lucide-react";
import { setRefreshKey } from "../../context/contactSlice";
import ContactDetailsModal from "../Modal/ContactDetailsModal";
import { getAllContactsRequest } from "../../apis/contacts";

export default function ContactTable() {
    const dispatch = useDispatch();
    const dragItem = useRef();
    const dragOverItem = useRef();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose } = useDisclosure();
    const { isOpen: isContactDetailsModalOpen, onOpen: onContactDetailsModalOpen, onClose: onContactDetailsModalClose } = useDisclosure();

    const [data, setData] = useState(null);
    const [contact, setContact] = useState(null);
    const [displayContacts, setDisplayContacts] = useState([]);

    // const data = useSelector(state => state.contacts.contacts);
    const label = useSelector(state => state.contacts.label);
    const token = useSelector(state => state.auth.token);
    const searchQuery = useSelector(state => state.contacts.searchQuery);
    const refreshKey = useSelector(state => state.contacts.refreshKey);

    // const contacts = data?.filter(contact =>
    //     contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );
    // let filteredContacts = (label !== '') ? contacts.filter(contact => contact.label === label) : contacts;

    async function getContacts() {
        try {
            const res = await getAllContactsRequest(token); 
            if (Array.isArray(res.contacts)) {
                setData(res.contacts);
            } else {
                console.error("Unexpected response format:", res);
            }
        } catch (error) {
            console.log("Error in getContacts: ", error);
        }
    }

    useEffect(() => {
        if (token) {
            getContacts();
        }
    }, [token, refreshKey]);

    const filteredContacts = useMemo(() => {
        if (!data) return [];
        let contacts = data;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            contacts = contacts?.filter((c) => c.name?.toLowerCase().includes(query));
        }

        if (label) {
            contacts = contacts?.filter((c) => c.label === label);
        }

        return contacts?.sort((a, b) => a.name.localeCompare(b.name));
    }, [data, label, searchQuery]);

    useEffect(() => {
        setDisplayContacts(filteredContacts);
    }, [data, label, searchQuery]);

    // filteredContacts.sort((a, b) => {
    //     if (a.bookmarked === b.bookmarked) {
    //         return a.name.localeCompare(b.name);
    //     }
    //     return b.bookmarked - a.bookmarked;
    // });
    
    // function handleBookmark(c) {
    //     dispatch(toggleBookmark(c.id));
    // }
        
    function handleEditFormOpen(c) {
        setContact(c);
        onOpen();
    }
    function handleDeleteFormOpen(c) {
        setContact(c);
        onConfirmationOpen();
    }
    function handleContactDetails(c) {
        setContact(c);
        onContactDetailsModalOpen();
    }
    function handleDragStart(e, index) {
        dragItem.current = index;
    }
    function handlerDragEnter(e, index) {
        dragOverItem.current = index;
        e.preventDefault();
    }
    function handleDragEnd() {
        const newContacts = Array.from(displayContacts);
        const draggedIndex = dragItem.current;
        const overIndex = dragOverItem.current;

        if (draggedIndex === undefined || overIndex === undefined || draggedIndex === overIndex) {
            dragItem.current = null;
            dragOverItem.current = null;
            return;
        }

        const [draggedItem] = newContacts.splice(draggedIndex, 1);
        newContacts.splice(overIndex, 0, draggedItem);

        dragItem.current = null;
        dragOverItem.current = null;

        setDisplayContacts(newContacts);
    }

    return (
        <>

        <ContactDetailsModal 
            onClose={onContactDetailsModalClose}
            isOpen={isContactDetailsModalOpen}
            data={contact}
        />

        <ContactModal
            onClose={onClose}
            onOpen={onOpen}
            isOpen={isOpen}
            title={"Edit contact form"}
            buttonText={"Edit contact"}
            data={contact}
            onSuccess={() => dispatch(setRefreshKey(1))}
        />
        
        <ConfirmationModal
            onClose={onConfirmationClose}
            isOpen={isConfirmationOpen}
            data={contact}
            onSuccess={() => dispatch(setRefreshKey(1))}
        />

        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr className="w-full flex justify-between">
                        <Th className="w-full">Name</Th>
                        <Th className="w-full">Phone Number</Th>
                    </Tr>
                </Thead>

                <Tbody className="dndcontainer">
                    <Tr>
                        <Td className="text-xs text-gray-500">CONTACTS ({filteredContacts?.length})</Td>
                    </Tr>
                    {
                        displayContacts?.map((contact, index) => (
                            <Tr 
                                key={contact.id || index} 
                                className="hover:bg-gray-200 w-full flex justify-between" 
                                draggable={true} 
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handlerDragEnter(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <Td className="flex gap-2 items-center w-1/2 hover:bg-gray-300 cursor-pointer" onClick={() => handleContactDetails(contact)}>
                                    {
                                        contact?.avatar
                                            ? <img src={contact.avatar} className="w-8 h-8 rounded-full bg-amber-600" />
                                            : <img src={`https://robohash.org/${contact.name}`} className="w-8 h-8 rounded-full bg-amber-600" />
                                    }
                                    <p>{contact.name}</p>
                                    <Tag className="mx-6" colorScheme='teal'>{contact.label}</Tag>
                                </Td>

                                <Td className="w-1/2 flex justify-between">
                                    <p className="w-full">{contact.phone}</p>
                                    <div className="w-full flex gap-2 justify-around items-center">
                                        {/* {
                                            contact.bookmarked
                                                ? <BookmarkMinus size={25} className="text-red-500 cursor-pointer" onClick={() => handleBookmark(contact)} />
                                                : <BookmarkPlus size={25} className="text-blue-500 cursor-pointer" onClick={() => handleBookmark(contact)} />
                                        } */}
                                        <div className="flex gap-2">
                                            <Edit size={20} onClick={() => handleEditFormOpen(contact)} className="cursor-pointer" />
                                            <Trash2 size={20} onClick={() => handleDeleteFormOpen(contact)} className="cursor-pointer" />
                                        </div>
                                    </div>
                                </Td>
                            </Tr>
                        ))
                    }
                </Tbody>
            </Table>
        </TableContainer>
        </>
    );
}