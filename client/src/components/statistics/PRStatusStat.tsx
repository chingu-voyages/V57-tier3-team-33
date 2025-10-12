import React, { useMemo } from 'react'
import { PullRequest } from '../../types/PullRequest.types';

interface Props {
    allprs: PullRequest[]
}

const PRStatusStat: React.FC<Props> = ({ allprs = [] }) => {
    const stats = useMemo(() => {
        const total = allprs.length;
        const mergedPRs = allprs.filter((pr) => !!pr.merged_at);
        // const mergeTime = mergedPRs.map((pr) => new Date(pr.merged_at) - new Date(pr.created_at))
        const merged = mergedPRs.length;

        return { total, merged }
    }, [allprs]);

    return (
        <>
            <p>{stats.total}</p>
            <p>{stats.merged}</p>
        </>
    )
}

export default PRStatusStat
