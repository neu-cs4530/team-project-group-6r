export default function calculateTimeDifference(date: Date | undefined): string {
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

export function calculateBytes(size: number): string {
    const megabytes = (size / 1e6);
    const kilobytes = (size / 1000);

    switch(true) {
        case (megabytes > 1):
            return `${megabytes.toFixed(2)} MB`
            break;
        
        case (kilobytes > 1):
            return `${kilobytes.toFixed(2)} KB`
            break;

        default:
            return `${size} bytes`
    }
}