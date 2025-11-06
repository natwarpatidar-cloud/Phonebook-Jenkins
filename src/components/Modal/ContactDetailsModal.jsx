import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Tag,
} from '@chakra-ui/react'

export default function ContactDetailsModal ({ isOpen, onClose, data }) {
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Contact Details:</ModalHeader>
                <ModalCloseButton />
        
                <ModalBody className='flex gap-4 items-center justify-around'>
                    <div>
                        <img src={data?.avatar} className='w-30 h-30 border rounded-full' />
                    </div>
                    <div className='space-y-2'>
                        <div className='flex gap-4'>
                            <h2 className='text-xl font-semibold'>{data?.name}</h2>
                            <Tag colorScheme='blue'>{data?.label}</Tag>
                        </div>
                        <p>{data?.phone}</p>
                        <p>{data?.address}</p>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    )
}