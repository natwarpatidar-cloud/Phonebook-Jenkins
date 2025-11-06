import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { loginRequest } from '../../apis/auth';
import { useDispatch } from 'react-redux';
import { setToken } from '../../context/authSlice';

export default function Login() {

    const [formData, setFormData] = useState({
        phone: "",
        password: ""
    });

    const [validationError, setValidationError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validate = () => {
        if (!formData.phone) {
            return "Phone number is required.";
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            return "Please enter a valid 10-digit phone number.";
        }
        if (!formData.password) {
            return "Password is required.";
        }
        return null;
    }

    async function handleSubmit () {
        setValidationError(null);

        const errorMsg = validate();
        if (errorMsg) {
            setValidationError(errorMsg);
            return;
        }

        setIsPending(true);
        
        try {
            const res = await loginRequest(formData);
            if(res) {
                setIsSuccess(true);
                dispatch(setToken({ token: res.token, user: res._id }));
            }
        } catch (error) {
            setValidationError("Login failed. Please try again.");
        }
        setIsPending(false);
    }

    useEffect(() => {
        if(isSuccess) {
            setTimeout(() => {
                navigate('/');
            }, 1000);
        }
    }, [isSuccess]);

    return (
        <>
            <h2>Login Form</h2>

            {validationError && <p className='text-red-500'>{validationError}</p>}

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

                <Button onClick={handleSubmit} disabled={isPending}>
                    {isPending || isSuccess ? "Logging in..." : "Log in"}
                </Button>

                <span>
                    Don't have an account?
                    <Link to='/signup'>&nbsp;Signup</Link>
                </span>
            </FormControl>
        </>
    )
}
