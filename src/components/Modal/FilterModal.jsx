import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLabel } from '../../context/contactSlice';

export default function FilterModal ({ isOpen, onClose, data }) {
    const dispatch = useDispatch();
    const [selectedLabel, setSelectedLabel] = useState("");

    function filter() {
        dispatch(setLabel(selectedLabel)); 
        onClose();
    }
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Filter Contacts</ModalHeader>
                <ModalCloseButton />
        
                <ModalBody>
                    <FormControl>
                        <FormLabel>Select Tag</FormLabel>
                            <Select
                                placeholder='Tag'
                                value={selectedLabel}
                                onChange={(e) => setSelectedLabel(e.target.value)}
                            >
                                <option value='work'>Work</option>
                                <option value='school'>School</option>
                                <option value='friends'>Friends</option>
                                <option value='family'>Family</option>
                            </Select>
                    </FormControl>
                    
                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' colorScheme='blue' mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='yellow' onClick={filter}>Filter</Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    )
}