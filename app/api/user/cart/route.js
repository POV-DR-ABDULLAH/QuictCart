import { getAuth } from '@clerk/nextjs/server'
import connectDB from '../../../config/db'
import { NextResponse } from 'next/server'
import User from '../../../models/User'

export async function PUT(request) {
    try {
        const { userId } = getAuth(request)
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { cartItems } = body

        await connectDB()

        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({ success: false, message: "User Not Found" }, { status: 404 })
        }

        user.cartItems = cartItems
        await user.save()

        return NextResponse.json({ success: true, message: "Cart updated successfully" })

    } catch (error) {
        console.error("Error updating cart:", error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
