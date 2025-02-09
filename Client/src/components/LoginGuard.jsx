import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import LoadingBar from './LoadingBar';

const LoginGuard = ({ children }) => {
    const { user, loading, authChecked } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && authChecked && user) {
            navigate('/', { replace: true });
        }
    }, [user, loading, authChecked, navigate]);

    if (loading || !authChecked) {
        return <LoadingBar fullScreen />;
    }

    if (user) {
        return null;
    }

    return children;
};

export default LoginGuard;
