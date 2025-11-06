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
  Input,
  Select,
  FormErrorMessage,
  Image,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { addContact, editContact } from '../../context/contactSlice';
import { Cross, LucideLoader, X } from 'lucide-react';
import { createContactRequest, updateContactRequest } from '../../apis/contacts';

export default function ContactModal({ isOpen, onClose, title, buttonText, data, onSuccess }) {
  // const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    avatar: null,
    label: '',      
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: data?.name || '',
        phone: data?.phone || '',
        address: data?.address || '',
        label: data?.label || '',
        avatar: data?.avatar || '',
      });
      setPreviewImage(data?.avatar || null);
      setErrors({});
    }
  }, [isOpen, data]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if(formData.phone.length !== 10) newErrors.phone = 'Phone number should be of 10 digits'
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.label.trim()) newErrors.label = 'Tag is required';
    // if (!formData.avatar) newErrors.avatar = 'Avatar is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const editValidation = () => {
    if(formData.name === data.name && formData.phone === data.phone && formData.address === data.address && formData.label === data.label && formData.avatar === data.avatar) {
      return true;
    }
  }

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsPending(true);

    if (data) {
      if(editValidation()) {
        setIsPending(false);
        onClose();
        return;
      } else {
        await updateContactRequest(formData, data._id, token);
      }
      // dispatch(editContact(payload));
    } else {
      await createContactRequest(formData, token);
      // dispatch(addContact(payload));
    }
    if(onSuccess) onSuccess();
    setIsPending(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl className="flex flex-col gap-4">

            <FormControl isInvalid={errors.name} mb={3}>
              <FormLabel>Name</FormLabel>
              <Input
                type='text'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='Enter your name'
                disabled={isPending}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.phone} mb={3}>
              <FormLabel>Phone No.</FormLabel>
              <Input
                type='tel'
                value={formData.phone}
                disabled={isPending}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder='Enter phone number'
              />
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.address} mb={3}>
              <FormLabel>Address</FormLabel>
              <Input
                type='text'
                value={formData.address}
                disabled={isPending}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder='Enter city/address'
              />
              <FormErrorMessage>{errors.address}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.avatar} mb={3}>
              <div className='w-full flex justify-between'>
                <FormLabel>Avatar</FormLabel>
                <X onClick={() => {
                  setFormData({ ...formData, avatar: null });
                  setPreviewImage(null);
                }} />
              </div>
              {previewImage && (
                <Image
                  src={previewImage}
                  alt='Preview'
                  boxSize='100px'
                  objectFit='cover'
                  borderRadius='md'
                  mb={2}
                />
              )}

              <Input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                disabled={isPending}
              />
              {/* <FormErrorMessage>{errors.avatar}</FormErrorMessage> */}
            </FormControl>

            <FormControl isInvalid={errors.label} mb={3}>
              <FormLabel>Select Tag</FormLabel>
              <Select
                placeholder='Select tag'
                value={formData.label}
                disabled={isPending}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              >
                <option value='work'>Work</option>
                <option value='school'>School</option>
                <option value='friends'>Friends</option>
                <option value='family'>Family</option>
              </Select>
              <FormErrorMessage>{errors.label}</FormErrorMessage>
            </FormControl>

          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant='ghost' colorScheme='red' mr={3} onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button colorScheme='blue' onClick={handleSubmit} disabled={isPending}>
            {buttonText}
            { isPending && <LucideLoader className='animate-spin' />}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
