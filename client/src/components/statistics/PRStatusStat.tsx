import React, { useMemo } from 'react'
import { PullRequest } from '../../types/PullRequest.types';
import { getDaysAndHoursAndMinutesFromMilliseconds } from "../../utils/convertDate";
import { GitPR, Team } from "../icons";
import { Clock } from "../ui"; // Import Clock icon
import CheckCircle from "../ui/checkCircle";

interface Props {
    allprs: PullRequest[]
}

const PRStatusStat: React.FC<Props> = ({ allprs = [] }) => {
    const prStats = useMemo(() => {
        const total = allprs.length;
        const mergedPRs = allprs.filter((pr) => !!pr.merged_at);
        const merged = mergedPRs.length;

        const avgMergeTime = mergedPRs
            .map((pr) => !!pr.merged_at ? new Date(pr.merged_at).getTime() - new Date(pr.created_at).getTime() : 0)
            .reduce((a, b) => a + b, 0)
            / merged;

        const map: Record<string, boolean> = {};
        allprs.forEach((pr) => {
            map[pr.author.username] = true;
        });

        const contributors = Object.keys(map).length;

        return { total, merged, avgMergeTime, contributors }

    }, [allprs]);

    const stats = [
        {
            icon: <GitPR width={28} />,
            bgColor: "bg-blue-100",
            textColor: "text-blue-700",
            title: "Total PRs",
            value: prStats.total,
        },
        {
            icon: <CheckCircle width={28} fill="#06d6a0" />,
            bgColor: "bg-green-100",
            textColor: "text-green-700",
            title: "Merged PRs",
            value: prStats.merged,
        },
        {
            icon: <Clock width={28} fill="#ef476f" />,
            bgColor: "bg-red-100",
            textColor: "text-red-700",
            title: "Average Merge Time",
            value: getDaysAndHoursAndMinutesFromMilliseconds(prStats.avgMergeTime),
        },
        {
            icon: <Team width={28} fill="#9368b7" />,
            bgColor: "bg-amner-500",
            textColor: "text-purple-700",
            title: "Contributors",
            value: prStats.contributors,
        },
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4"
                >
                    <div className={`${stat.bgColor} p-1 rounded-lg`}>
                        {stat.icon}
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-medium text-gray-600">{stat.title}</h3>
                        <span className={`font-bold text-2xl ${stat.textColor}`}>
                            {stat.value}
                        </span>
                    </div>
                </div>
            ))}
        </section>
    )
}

export default PRStatusStat
