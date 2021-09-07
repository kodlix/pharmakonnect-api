export const addTimeToDate = (date: Date, time: Date) => {
    if ((!time) || (!date)) {
        return;
    }

    const [hr, min, sec] = time.toString().split(':');
    const newDate = new Date(date);
    newDate.setHours(+hr);
    newDate.setMinutes(+min);
    newDate.setSeconds(+sec);

    return newDate;
}