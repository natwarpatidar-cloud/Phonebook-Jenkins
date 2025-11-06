import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


export const ProtectedRoute = ({ children }) => {
    const token = useSelector(state => state.auth.token);
    const user = useSelector(state => state.auth.user);


    if(!token || !user) {
        return <Navigate to='/login' />;
    }

    return children;
};