export default function dateInMonthFormat(date) {
  console.log("date::", date);
    let monthNames =["Jan","Feb","Mar","Apr",
                      "May","Jun","Jul","Aug",
                      "Sep", "Oct","Nov","Dec"];
    // let txnDate = new Date(date);
    let txnDate = new Date(date.replace(/\s/, 'T'));
    txnDate.setHours(txnDate.getHours() + 5);
    txnDate.setMinutes(txnDate.getMinutes() + 30);
    let year = txnDate.getFullYear();
    let month = txnDate.getMonth();
    let monthName = monthNames[month];
    let dt = txnDate.getDate();
    let hours = txnDate.getHours();
    let minutes = txnDate.getMinutes();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    const ampm = hours >= 12 ? 'PM' : 'AM';
    date = monthName + " " + dt + ", " + year + ", " + hours + ":" + minutes + " " + ampm;
    console.log(year+'-' + monthName + '-'+dt);
    const dateObj = {
        monthName,
        dt,
        year,
        hours,
        minutes,
        ampm
    }
    return dateObj;
}