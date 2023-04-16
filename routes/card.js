const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const protect=require('../middleware/protect')
// utility functions
const generateCard = require('../utils/generateCard')
// models
const Card = require('../models/cardModel')
const User = require('../models/userModel')
const joi=require('joi');

const cardSchema=joi.object({
    network:joi.string().min(3).required(),
    pin:joi.string().alphanum().min(4).max(4).required(),
    purpose:joi.string().max(100)
})

const changePINSchema = joi.object({
    oldPin:joi.string().alphanum().min(4).max(8).required(),
    newPin:joi.string().alphanum().min(4).max(8).required(),
    cardNumber:joi.string().min(16).max(16).required()
})

const PINSchema = joi.object({
    pin:joi.string().alphanum().min(4).max(8).required()
})

// get request returns information of all cards associated with the user
router.get('/',protect,async (req,res)=>{
    const cards = await Card.find({user: req.user._id})
    cards.forEach(card=>delete card._doc.pin)
    return res.status(200).json(cards)
})

// detailed information of a card
router.get('/:cardNumber',protect,async (req,res)=>{
    const card = await Card.find({$and:[{cardNumber: req.params.cardNumber},{user: req.user._id}]})
    delete card._doc.pin
    return res.status(200).json(card)
})

// generate a new card
router.post('/',protect,async (req,res)=>{
    //console.log(req.user)
    const {network,pin,purpose} = req.body
    let {error} = await cardSchema.validate({network,pin,purpose})
    if(error){
        error=error.details[0].message.replace( /\"/g, "" ).toUpperCase()
        return res.status(400).json({message:error})
    }
    const user = await User.findById(req.user._id)
    if(user && user.cards<5){
        const encryptedPIN = await bcrypt.hash(pin,10)
        const cardDetails = generateCard(network)
        var card = new Card({
            ...cardDetails,
            pin: encryptedPIN,
            purpose: purpose,
            user: [req.user._id]
        })
        card = await card.save()
        user.cards = user.cards+1
        await user.save()
        delete card._doc.pin
        return res.status(201).json({message:'New Card generated Successfuly',card:card})
    }
    else if(!user){
        return res.status(401).json({message:'You are not authorised to perform this action'})
    }
    else{
        return res.status(403).json({message:'You cannot create more than 5 cards'})
    }
})

// update status of a card
router.patch('/',protect,async (req,res)=>{
    const salt = await bcrypt.genSalt(10)
    const {oldPin,newPin,cardNumber,newHolder,pin} = req.body
    let card = await Card.find({$and:[{cardNumber: cardNumber,user: req.user._id}]})
    card = card[0]
    //console.log(card)
    if(card && req.body.action==='changePIN'){
        let {error} = await changePINSchema.validate({oldPin,newPin,cardNumber})
        if(error){
            error=error.details[0].message.replace( /\"/g, "" ).toUpperCase()
            return res.status(400).json({message:error})
        }
        const matched = await bcrypt.compare(oldPin,card.pin)
        if(matched){
            if(oldPin===newPin){
                return res.status(400).json({message:'New PIN can not be same as old PIN'})
            }
            const encryptedPin = await bcrypt.hash(newPin,salt)
            //await card.update({pin: newPin})
            card.pin = encryptedPin
            await card.save()
            return res.status(200).json({message:'PIN updated successfuly'})
        }
        else
            return res.status(400).json({message:'Old PIN mismatch'})
    }
    else if(card && req.body.action==='block'){
        if(card.isBlocked)
            return res.status(400).json({message:'Card Already Blocked!'})
        card.isBlocked = true
        await card.save()
        return res.status(200).json({message:'Card Blocked successfuly'})
    }
    else if(card && req.body.action==='unblock'){
        if(!card.isBlocked)
            return res.status(400).json({message:'Card Not Blocked!'})
        card.isBlocked = false
        await card.save()
        return res.status(200).json({message:'Card Unblocked successfuly!'})
    }
    else if(card && req.body.action==='setLimit'){
        if(card.limit===req.body.limit)
            return res.status(400).json({message:'Limit already set to the specified value'})
        card.limit = req.body.limit
        await card.save()
        return res.status(200).json({message:'Card Limit Updated successfuly!'})
    }
    else if(card && req.body.action==='setInternationalLimit'){
        if(card.internationalLimit===req.body.internationalLimit)
            return res.status(400).json({message:'Limit already set to the specified value'})
        card.internationalLimit = req.body.internationalLimit
        await card.save()
        return res.status(200).json({message:'Card Limit Updated successfuly!'})
    }
    else if(card && req.body.action==='addHolder'){
        if(req.user.accountNo===newHolder)
            return res.status(400).json({message:'You cannot add yourself as additional holder!'})
        const user = await User.findOne({accountNo:newHolder})
        let {error} = await PINSchema.validate({pin})
        if(error){
            error=error.details[0].message.replace( /\"/g, "" ).toUpperCase()
            return res.status(400).json({message:error})
        }
        const matched = await bcrypt.compare(pin,card.pin)
        if(!matched)
            return res.status(400).json({message:'PIN mismatch!'})
        if(user && card.user.includes(user._id))
            return res.status(400).json({message:'Holder already added for this card'})
        //const user = await User.findById(req.body.newHolder)
        if(user && user.cards<5){
            user.cards = user.cards+1
            card.user.push(user._id)
            await card.save()
            await user.save()
            return res.status(200).json({message:'Joint Holder added successfuly'})
        }
        else
            return res.status(400).json({message:'Invalid Joint Card Holder!'})
    }
    else if (card){
        return res.status(400).json({message:'Undefined Action'})
    }
    else{
        return res.status(400).json({message:'No matching card found!'})
    }
})

// delete an active card
router.delete('/',protect,async (req,res)=>{
    const card = await Card.findOne({$and:[{cardNumber: req.body.cardNumber}, {user: req.user._id}]})
    if(card){
        await card.remove()
        await User.findByIdAndUpdate(req.user._id,{cards:req.user.cards-1})
        return res.status(200).json({message:'Card Deleted!'})
    }
    else{
        return res.status(400).json({message:'No matching card found!'})
    }
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports = router