import { useQuery } from '@tanstack/react-query';
import { auth } from '../config/firebase';

async function fetchToken() {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    return await user.getIdToken();
}

export function useToken() {
    return useQuery({
        queryKey: ['token', auth.currentUser?.uid],
        queryFn: fetchToken,
        enabled: !!auth.currentUser, // only run if a user exists
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}