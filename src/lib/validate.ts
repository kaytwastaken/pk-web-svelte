const dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{2}-[0-9]{2}|0004-[0-9]{2}-[0-9]{2}/

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

export function readableDOB (dateString) {
    let dateArray = dateString.split('-')
    
    if ( dateArray.length == 3 ) {
        return `${month(dateArray[1])} ${dateArray[2]}${dateArray[0] == '0004' ? "" : `, ${dateArray[0]}`}`
    } else if ( dateArray.length == 2 ) {
        return `${month(dateArray[0])} ${dateArray[1]}`
    } else {
        throw new Error("Date not recognized. Enter a date in either yyyy-mm-dd or mm-dd format.")
    }
}

export function validateMember (mem) {
    // Validate DOB w function from $lib/birthday.ts
    if ( mem.birthday ) {
        if ( !dateRegex.test(mem.birthday) ) {
            throw new Error ("Date not recognized. Enter a date in either yyyy-mm-dd or mm-dd format.")
        }
    }
    if ( mem.color ) {
        // Check against a valid 6-character hex regex
        if ( !/^(#|)[A-Fa-f0-9]{6}$/.test(mem.color) ) {
            // ✨ regexes :D
            throw new Error("Please enter a valid hex color code")
        }
        // Return without the # if neccessary
        if ( mem.color.slice(0,1) == '#' ) {
            mem.color = mem.color.slice(1,7)
        }

    }
    for ( let prop in mem.privacy ) {
        mem.privacy[prop] = mem.privacy[prop] ? 'public' : 'private'
    }
}

export function validateGroup (grp) {
    // Validate DOB w function from $lib/birthday.ts
    if ( grp.color ) {
        // Check against a valid 6-character hex regex
        if ( !/^(#|)[A-Fa-f0-9]{6}$/.test(grp.color) ) {
            // ✨ regexes :D
            throw new Error("Please enter a valid hex color code")
        }
        // Return without the # if neccessary
        if ( grp.color.slice(0,1) == '#' ) {
            grp.color = grp.color.slice(1,7)
        }

    }
    for ( let prop in grp.privacy ) {
        grp.privacy[prop] = grp.privacy[prop] ? 'public' : 'private'
    }
}

export function validateSystem (sys) {
    if ( sys.color ) {
        // Check against a valid 6-character hex regex
        if ( !/^(#|)[A-Fa-f0-9]{6}$/.test(sys.color) ) {
            // ✨ regexes :D
            throw new Error("Please enter a valid hex color code")
        }
        // Return without the # if neccessary
        if ( sys.color.slice(0,1) == '#' ) {
            sys.color = sys.color.slice(1,7)
        }

    }
    for ( let prop in sys.privacy ) {
        sys.privacy[prop] = sys.privacy[prop] ? 'public' : 'private'
    }
}