const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const protect=require('../middleware/protect')
// utility functions
const generateCard = require('../utils/generateCard')
const genCardToken = require('../utils/cardToken')
// models
const Card = require('../models/cardModel')
const User = require('../models/userModel')

// get request returns information of all cards associated with the user
router.get('/',protect,async (req,res)=>{
    const cards = await Card.find({user: req.user._id})
    return res.status(200).json(cards)
})

// detailed information of a card
router.get('/:cardNumber',protect,async (req,res)=>{
    const card = await Card.find({$and:[{cardNumber: req.params.cardNumber,user: req.user._id}]})
    return res.status(200).json(card)
})

// generate a new card
router.post('/',protect,async (req,res)=>{
    //console.log(req.user)
    const user = await User.findById(req.user._id)
    if(user && user.cards<5){
        const encryptedPIN = await bcrypt.hash(req.body.pin,10)
        const cardDetails = generateCard(req.body.network)
        const card = new Card({
            ...cardDetails,
            pin: encryptedPIN,
            purpose: req.body.purpose,
            user: req.user._id
        })
        await card.save()
        user.cards = user.cards+1
        const cardToken = await genCardToken(card)
        //console.log(cardToken)
        await user.save()
        return res.status(201).json({message:'New Card generated Successfuly',card:{...cardDetails,purpose:req.body.purpose,token:cardToken}})
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
    let card = await Card.find({$and:[{cardNumber: req.body.cardNumber,user: req.user._id}]})
    card = card[0]
    //console.log(card)
    if(card && req.body.action==='changePIN'){
        const matched = await bcrypt.compare(req.body.oldPin,card.pin)
        if(matched){
            if(req.body.oldPin===req.body.newPin){
                return res.status(400).json({message:'New PIN can not be same as old PIN'})
            }
            const newPin = await bcrypt.hash(req.body.newPin,salt)
            //await card.update({pin: newPin})
            card.pin = newPin
            await card.save()
            const cardToken = await genCardToken(card._doc)
            return res.status(200).json({message:'PIN updated successfuly',token:cardToken})
        }
        else
            return res.status(400).json({message:'Old PIN mismatch'})
    }
    else if(card && req.body.action==='block'){
        if(card.isBlocked)
            return res.status(400).json({message:'Card Already Blocked!'})
        card.isBlocked = true
        await card.save()
        const cardToken = await genCardToken(card._doc)
        return res.status(200).json({message:'Card Blocked successfuly',token:cardToken})
    }
    else if(card && req.body.action==='unblock'){
        if(!card.isBlocked)
            return res.status(400).json({message:'Card Not Blocked!'})
        card.isBlocked = false
        await card.save()
        const cardToken = await genCardToken(card._doc)
        return res.status(200).json({message:'Card Unblocked successfuly!',token:cardToken})
    }
    else if(card && req.body.action==='setLimit'){
        if(card.limit===req.body.limit)
            return res.status(400).json({message:'Limit already set to the specified value'})
        card.limit = req.body.limit
        await card.save()
        const cardToken = await genCardToken(card._doc)
        return res.status(200).json({message:'Card Limit Updated successfuly!',token:cardToken})
    }
    else if(card && req.body.action==='setInternationalLimit'){
        if(card.internationalLimit===req.body.internationalLimit)
            return res.status(400).json({message:'Limit already set to the specified value'})
        card.internationalLimit = req.body.internationalLimit
        await card.save()
        const cardToken = await genCardToken(card._doc)
        return res.status(200).json({message:'Card Limit Updated successfuly!',token:cardToken})
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
    const card = await Card.findOne({$and:[{cardNumber: req.body.cardNumber, user: req.user._id}]})
    if(card){
        await card.remove()
        await User.findByIdAndUpdate(req.user._id,{cards:req.user.cards-1})
        return res.status(200).json({message:'Card Deleted!'})
    }
    else{
        return res.status(400).json({message:'No matching card found!'})
    }
})

module.exports = router