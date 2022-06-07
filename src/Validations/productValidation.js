//check Validity
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    //if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidNum = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'number' && value.trim().length === 0) return false
    return true
}

function isRequired(data, files) {
    try {
        let error = []

        //checks if user has given any data
        if (Object.keys(data).length == 0)
            return ["Please enter data to user registration"]

        //checks if title is present
        if (!isValid(data.title))
            error.push("title is required")

        //checks if description is present
        if (!isValid(data.description))
            error.push("description is required")

        //checks if price is present
        if (!isValidNum(data.price))
            error.push("price is required")

        //check if image file is present
        if (files.length == 0)
            error.push("image file is required")

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}


function isInvalid(data, files, getTitle) {
    try {
        let error = []
        if (typeof data.title == "string" && data.title?.trim().length == 0)
            error.push("enter a valid title")
        //check unique title
        if (getTitle)
            error.push("title is already in use")

        //checks for valid price
        if (typeof data.price == "string" && !(/^([0-9]+)?.?([0-9])+$/.test(data.price?.trim())))
            error.push("enter valid price")

        //checks for valid currencyId
        if(data.currencyId){
            if (typeof data.currencyId == "string" && data.currencyId?.trim().toUpperCase() !== "INR")
                error.push("only 'INR' as currencyId is supported")

            else data.currencyId = data.currencyId.trim().toUpperCase()
        }
        //checks for valid currencyFormat
        if (typeof data.currencyFormat == "string" && data.currencyFormat !== "₹")
            error.push("only '₹' as currencyFormat is supported")

        // checks for valid isFreeShipping
        if (typeof data.isFreeShipping == "string") {
            data.isFreeShipping = data.isFreeShipping.toLowerCase()
            let arr = ["true", "false"]
            if (!arr.includes(data.isFreeShipping))
                error.push("enter a valid isFreeShipping entry")
        }

        //check for image file
        if(files)
            if (files.length > 0 && !(/image\/[a-z]+/.test(files[0].mimetype)))
                error.push("upload a valid image file")

        //checks for valid availableSizes
        let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"]
        if (typeof data.availableSizes == "string") {
            try {
                data.availableSizes = JSON.parse(data.availableSizes)
            } catch (err) {
                data.availableSizes = data.availableSizes
            }
            if (Array.isArray(data.availableSizes))
                data.availableSizes = data.availableSizes.join(",")

            let arr1 = (data.availableSizes).split(",")
            data.availableSizes = arr1.map(x => x.toUpperCase())
            for (let i in data.availableSizes) {
                if (!arr.includes(data.availableSizes[i])) {
                    error.push("enter valid availableSizes")
                    break
                }
            }
        }

        //checks for valid installments
        if (typeof data.installments == "string" && !(/^\d{1,2}$/.test(data.installments?.trim())))
            error.push("enter a valid installments (accpets upto 2 digits only)")

        if (error.length > 0)
            return error

    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}


module.exports = { isRequired, isInvalid, isValid }