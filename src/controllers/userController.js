const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const { uploadFile } = require("../awsS3/aws")
const bcrypt = require("bcrypt")
const { isRequired, isInvalid, isValid } = require("../Validations/userValidation")

let initialCapital = function (value) {
    return value[0].toUpperCase() + value.slice(1).toLowerCase()
}

//1.
const registerUser = async function (req, res) {
    try {
        let data = req.body
        let files = req.files

        let getEmail = await userModel.findOne({ email: data.email }).collation({ locale: "en", strength: 2 })
        let getPhone = await userModel.findOne({ phone: data.phone })
        let error = []
        let err1 = isRequired(data, files)
        if (err1)
            error.push(...err1)

        let err2 = isInvalid(data, getEmail, getPhone, files)
        if (err2)
            error.push(...err2)

        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

        //changing data to proper format
        data.fname = initialCapital(data.fname.trim())
        data.lname = initialCapital(data.lname.trim())
        data.address.shipping.city = initialCapital(data.address.shipping.city.trim())
        data.address.billing.city = initialCapital(data.address.billing.city.trim())
        data.email = data.email.toLowerCase()

        data.password = await bcrypt.hash(data.password, 10)

        let uploadedFileURL = await uploadFile(files[0])
        data.profileImage = uploadedFileURL

        let created = await userModel.create(data)
        res.status(201).send({ status: true, message: "User created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



//2.
const userLogin = async function (req, res) {
    try {
        const email = req.body.email
        const password = req.body.password
        const data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please Enter E-mail and Password..." })
        }
        let error = []
        if (!isValid(email))
            error.push("Please Enter Email")
        if (!isValid(password))
            error.push("Please Provide Password")
        if (typeof data.email == "string" && !(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email?.trim())))
            error.push("enter a valid email")
        if (error.length > 0)
            return res.status(400).send({ status: false, msg: error })

        const user = await userModel.findOne({ email: email }).collation({ locale: "en", strength: 2 })
        if (!user) {
            return res.status(400).send({ status: false, msg: "email not found" })
        }
        let result = await bcrypt.compare(password, user.password)
        if (result == true) {
            const token = jwt.sign({
                userId: user._id
            }, "Project 5", { expiresIn: "300m" })
            res.status(200).send({ status: true, data: "logged in successfully", data: { token } })
        }
        else if (result == false)
            return res.status(400).send({ status: false, msg: "Incorrect Password" })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



//3.
const getUserDetails = async function (req, res) {
    try {
        const userIdfromParams = req.params.userId
        const checkId = await userModel.findOne({ _id: userIdfromParams }).lean()
        if (!checkId)
            return res.status(404).send({ status: false, message: "User Not Found" })

        return res.status(200).send({ status: true, message: "User details", data: checkId })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//4.
const updateUserProfile = async function (req, res) {
    let userId = req.params.userId
    let data = req.body
    let files = req.files
    let getEmail = await userModel.findOne({ email: data.email }).collation({ locale: "en", strength: 2 })
    let getPhone = await userModel.findOne({ phone: data.phone })
    if (Object.keys(data).length == 0)
        return res.status(400).send({ status: false, message: "Please provide user detail(s) to be updated." })

    let err = isInvalid(data, getEmail, getPhone, files)
    if (err)
        return res.status(400).send({ status: false, message: err })

    //changing data to proper format
    if (data.fname?.trim())
        data.fname = initialCapital(data.fname.trim())

    if (data.lname?.trim())
        data.lname = initialCapital(data.lname.trim())

    if (data.address) {
        if (data.address.shipping) {
            if (data.address.shipping.city?.trim())
                data.address.shipping.city = initialCapital(data.address.shipping.city.trim())
        }

        if (data.address.billing) {
            if (data.address.billing.city?.trim())
                data.address.billing.city = initialCapital(data.address.billing.city.trim())
        }
    }
    if (data.email?.trim())
        data.email = data.email.trim().toLowerCase()
    if (files.length > 0) {
        let uploadedFileURL = await uploadFile(files[0])
        data.profileImage = uploadedFileURL
    }

    let updatedProfile = await userModel.findOneAndUpdate({ _id: userId }, [{ $addFields: data }], { new: true })

    if (data.password?.trim()) {
        data.password = await bcrypt.hash(data.password, 10)
        updatedProfile = await userModel.findOneAndUpdate({ _id: userId }, { $set: { password: data.password } }, { new: true })
    }
    return res.status(200).send({ status: true, message: "User profile updated", data: updatedProfile })
}

module.exports = { registerUser, userLogin, updateUserProfile, getUserDetails }