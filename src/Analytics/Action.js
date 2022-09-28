
export function concatAction({title, date = new Date(), mobile, code, others}) {
    // console.log('--------others------->', others);
    let str;
    
    if (mobile && code) {
        str = title +", code - " + code +  ", mobile - " + mobile + ", date - " + date;
    }else if (mobile) {
        str = title +  ", mobile - " + mobile + ", date - " + date;
    }else {
        str = title  + ", date - " + date;
    }
    
    for (const property in others) {
        str += `, ${property} - ${others[property]}`;
    }
    return str
}