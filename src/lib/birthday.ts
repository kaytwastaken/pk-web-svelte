function month (num) {
    try {
        switch (num) {
            case '1':
                return "January"
            case '01':
                return "January"
            case '2':
                return "February"
            case '02':
                return "February"
            case '3':
                return "March"
            case '03':
                return "March"
            case '4':
                return "April"
            case '04':
                return "April"
            case '5':
                return "May"
            case '05':
                return "May"
            case '6':
                return "June"
            case '06':
                return "June"
            case '7':
                return "July"
            case '07':
                return "July"
            case '8':
                return "August"
            case '08':
                return "August"
            case '9':
                return "September"
            case '09':
                return "September"
            case '10':
                return "October"
            case '11':
                return "November"
            case '12':
                return "December"
            default:
                throw new Error("Month is not recognized.")
        }
    } catch (error) {
        throw error
    }
}

export function readable (dateString) {
    let dateArray = dateString.split('-')
    
    if ( dateArray.length == 3 ) {
        return `${month(dateArray[1])} ${dateArray[2]}${dateArray[0] == '0004' ? "" : `, ${dateArray[0]}`}`
    } else if ( dateArray.length == 2 ) {
        return `${month(dateArray[0])} ${dateArray[1]}`
    } else {
        throw new Error("Date not recognized. Enter a date in either yyyy-mm-dd or mm-dd format.")
    }
}

export function sendable (dateString) {
    let dateArray = dateString.split('-')
    console.log(dateArray)

    if ( dateArray.length == 3 ) {
        if ( dateArray[0].length == 4 ) {
            console.log(dateArray[0].length)
            if ( parseInt(dateArray[1]) < 13 && parseInt(dateArray[2]) < 32 ) {
                console.log(dateString)
                return dateString
            }
        }
    } else if ( dateArray.length == 2 ) {
        if ( parseInt(dateArray[0]) < 13 && parseInt(dateArray[1]) < 32 ) {
            return `0004-${dateString}`
        }
    } else {
        throw new Error("Date not recognized. Enter a date in either yyyy-mm-dd or mm-dd format.")
    }
}