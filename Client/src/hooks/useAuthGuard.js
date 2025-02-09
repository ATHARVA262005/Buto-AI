import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';

export const useAuthGuard = (requireVerified = true) => {
    const { user, loading, authChecked } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && authChecked) {
            if (!user) {
                navigate('/login');
            } else if (requireVerified && !user.emailVerified) {
                navigate('/verify-email', {
                    state: { 
                        userId: user.id,
                        email: user.email 
                    }
                });
            }
        }
    }, [user, loading, authChecked, navigate, requireVerified]);

    return { user, loading, authChecked };
};
