import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react'
// import { useDispatch } from 'react-redux';
// import { removeContact } from '../../context/contactSlice';
import { deleteContactRequest } from '../../apis/contacts';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function ConfirmationModal ({ isOpen, onClose, data, onSuccess }) {
    // const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const [isPending, setIsPending] = useState(false);

    async function confirmDelete() {
        setIsPending(true);
        await deleteContactRequest(data?._id, token);
        onSuccess();
        // dispatch(removeContact(data.id));
        onClose();
        setIsPending(false);
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Warning</ModalHeader>
                <ModalCloseButton />
        
                <ModalBody>
                    <p>
                        Are you sure? you wanna delete this contact?
                    </p>
                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' colorScheme='blue' mr={3} onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button disabled={isPending} colorScheme='red' onClick={confirmDelete}>
                        {
                            isPending ? "Deleting..." : 'Delete'
                        }
                    </Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    )
}