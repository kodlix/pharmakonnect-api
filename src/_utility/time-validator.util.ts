export const isNotValidTime = (time, date) => {
    
    const today = new Date();
    const todayTime = `${today.getHours()}.${today.getMinutes()}`;

    const splitedStartTime = time.toString().split(":");
    const startTime = `${splitedStartTime[0]}.${splitedStartTime[1]}`;
    
    if(new Date(date).setHours(0,0,0,0) <= today.setHours(0,0,0,0)) {
        if(parseInt( todayTime.split('.')[0]) === parseInt( startTime.split('.')[0])) {
            if(parseInt( todayTime.split('.')[1]) >= parseInt( startTime.split('.')[1])) {
                return true;
            }

        return false;

        }
        else if(parseInt( todayTime.split('.')[0]) >= parseInt( startTime.split('.')[0])) {
            return true;
        }

        return false;
    }   
    

    return false;

}