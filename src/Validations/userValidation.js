//check Validity
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

function isRequired(data, files) {
    try {
        let error = []
        //checks if user has given any data
        if (Object.keys(data).length == 0)
            return ["Please enter data to user registration"]

        //checks if fname is present
        if (!isValid(data.fname))
            error.push("first name is required")

        //checks if lname is present
        if (!isValid(data.lname))
            error.push("last name is required")

        //check if email is present
        if (!isValid(data.email))
            error.push("email is required")

        //check if image file is present
        if (files.length == 0)
            error.push("image file is required")

        //checks if phone is present or not
        if (!isValid(data.phone))
            error.push("phone number is required")

        //check if password is present
        if (!isValid(data.password))
            error.push("password is required")


        //street is present 
        if (data.address) {

            if (typeof data.address == "string" && data.address.trim().length != 0) {
                try { address = JSON.parse(data.address) }
                catch (err) { }
                if (typeof address == 'object') {
                    if (isValid(address.shipping)) {
                        if (!isValid(address.shipping.street))
                            error.push("shipping/street is required")

                        //city is present 
                        if (!isValid(address.shipping.city))
                            error.push("shipping/city is required")

                        //pincode is present 
                        if (!isValid(address.shipping.pincode))
                            error.push("shipping/pincode is required")
                    }
                    else error.push("shipping address is required")

                    if (isValid(address.billing)) {
                        //street is present 
                        if (!isValid(address.billing.street))
                            error.push("billing/street is required")

                        //city is present 
                        if (!isValid(address.billing.city))
                            error.push("billing/city is required")

                        //pincode is present 
                        if (!isValid(address.billing.pincode))
                            error.push("billing/pincode is required")
                    }
                    else error.push("billing address is required")
                }
                // else error.push("address is required")
            }
        }
        else if (data.address == undefined) error.push("address is required")


        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}



function isInvalid(data, getEmail, getPhone, files) {
    try {
        let error = []
        //checks for valid fname
        if (typeof data.fname == "string" && !(/^[a-zA-Z]+$/.test(data.fname?.trim())))
            error.push("enter a valid first name")

        //checks for valid lname
        if (typeof data.lname == "string" && !(/^[a-zA-Z]+$/.test(data.lname?.trim())))
            error.push("enter a valid last name")

        //validate email
        if (typeof data.email == "string" && !(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email?.trim())))
            error.push("enter a valid email")
        //check for duplicate email
        if (getEmail)
            error.push("email is already in use")

        //check for image file
        if (files.length > 0 && !(/image\/[a-z]+/.test(files[0].mimetype)))
            error.push("upload a valid image file")

        //checks for valid phone number
        if (typeof data.phone == "string" && !(/^((\+91)?0?)?[6-9]\d{9}$/.test(data.phone.trim())))
            error.push("enter valid mobile number")

        if (typeof data.phone == "string" && (/^((\+91)?0?)?[6-9]\d{9}$/.test(data.phone.trim())))
            data.phone = data.phone.trim().slice(-10)

        //check unique phone number
        if (getPhone)
            error.push("mobile number is already in use")

        if (typeof data.password == "string" && (/[ ]+/.test(data.password)) || /^$/.test(data.password))
            error.push("enter valid password")
        //checks password length

        if (data.password?.trim() && (data.password.length < 8 || data.password.length > 15))
            error.push("password must have 8-15 characters")

        if (typeof data.address == 'string' && data.address.length == 0) 
            error.push('enter valid address')

        if (data.address) {

            if (typeof data.address == "string" && data.address.trim().length != 0) {

                try { data.address = JSON.parse(data.address) }
                catch (err) { }

                if (typeof data.address == 'object') {
                    let address = data.address

                    if (address.shipping) {

                        if (typeof address.shipping.street == "string" && /^$/.test(address.shipping.street?.trim()))
                            error.push("enter a valid shipping/street")

                        if (typeof address.shipping.city == "string" && !(/^[a-zA-Z]+$/.test(address.shipping.city?.trim())))
                            error.push("enter a valid shipping/city name")

                        if (typeof address.shipping.pincode == "string" && !(/^[1-9][0-9]{5}$/.test(address.shipping.pincode?.trim())))
                            error.push("enter a valid shipping/pincode")
                    }

                    if (address.billing) {
                        if (typeof address.billing.street == "string" && /^$/.test(address.billing.street?.trim()))
                            error.push("enter a valid billing/street")

                        if (typeof address.billing.city == "string" && !(/^[a-zA-Z]+$/.test(address.billing.city?.trim())))
                            error.push("enter a valid billing/city name")

                        if (typeof address.billing.pincode == "string" && !(/^[1-9][0-9]{5}$/.test(address.billing.pincode?.trim())))
                            error.push("enter a valid billing/pincode")
                    }
                }
                else error.push('enter valid address')
            }
            else error.push('enter valid address')
        }

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err })
    }
}


module.exports = { isRequired, isInvalid, isValid }
