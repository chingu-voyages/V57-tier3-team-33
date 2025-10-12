export function getDaysAndHoursAndMinutesFromMilliseconds(milliSeconds: number) {
    const totalSeconds = Math.floor(milliSeconds / 1000);

    const totalMinutes = Math.floor(totalSeconds / 60);

    const totalHours = Math.floor(totalMinutes / 60);

    const totalDays = Math.floor(totalHours / 24);

    const remMinutes = totalMinutes % 60;
    const remHours = totalHours % 60;

    return [
        totalDays > 0 && `${totalDays}d `,
        remHours > 0 && `${remHours}h `,
        remMinutes > 0 && `${remMinutes}m `,
    ].filter(Boolean).join('');
}