import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { signupRequest } from '../../apis/auth/index';

export default function Signup() {

    const [formData, setFormData] = useState({
        phone: "",
        password: "",
        confirmPassword: ''
    });

    const [isPending, setIsPending] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        if (!formData.phone) {
            return "Missing Required Field: Phone no.";
        }
        if (!formData.password) {
            return "Missing Required Field: Password";
        }
        if (!formData.confirmPassword) {
            return "Missing Required Field: Confirm Password";
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            return "Invalid phone no: Please enter a 10 digit valid phone no.";
        }
        if (formData.password !== formData.confirmPassword) {
            return "Passwords do not match";
        }

        return null;
    }

    async function handleSubmit () {
        setValidationError(null);
        setError(null);

        const errorMsg = validate();
        if (errorMsg) {
            setValidationError(errorMsg);
            return;
        }

        setIsPending(true);

        try {
            const res = await signupRequest(formData);
            if(res) {
                setIsSuccess(true);
            }
        } catch (error) {
            setError(error?.response?.data?.error || "Something went wrong. Please try again.");
        }

        setIsPending(false);
        setFormData({
            phone: "",
            password: "",
            confirmPassword: ''
        });
    }

    useEffect(() => {
        if(isSuccess) {
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        }
    }, [isSuccess]);

    return (
        <>
            <h2>Signup Form</h2>

            {validationError && <p className='text-red-500'>{validationError}</p>}
            {error && <p className='text-red-500'>{error}</p>}

            <FormControl className="flex flex-col gap-4 mt-4">
                <FormControl mb={3}>
                    <FormLabel>Phone No.</FormLabel>
                    <Input
                        type='tel'
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder='Enter phone number'
                        disabled={isPending}
                    />
                </FormControl>

                <FormControl mb={3}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type='password'
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder='Enter password'
                        disabled={isPending}
                    />
                </FormControl>

                <FormControl mb={3}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                        type='password'
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder='Enter password'
                        disabled={isPending}
                    />
                </FormControl>

                <Button onClick={handleSubmit} disabled={isPending}>
                    {isPending || isSuccess ? "Signing up..." : 'Signup'}
                </Button>

                <span>
                    Already have an account?
                    <Link to='/login'>&nbsp;Login</Link>
                </span>
            </FormControl>
        </>
    )
}
