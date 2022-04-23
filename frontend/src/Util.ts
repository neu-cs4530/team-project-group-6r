export default function calculateTimeDifference(date: Date | undefined) {
    if (date) {
        const milliseconds = new Date().getTime() - new Date(date).getTime();
        const hours = Math.round(milliseconds / 36e5);
        const mins = Math.round(milliseconds/ 60000);

        if (hours < 1) {
            return mins === 1 ? `${mins} minute ago` : `${mins} minutes ago`;
        }
        return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    }
    return 'unknown';
}