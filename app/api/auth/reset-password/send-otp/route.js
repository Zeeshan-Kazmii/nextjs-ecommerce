import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(request) {
    try {
        await connectDB()
        const payload =await request.json()
        const validationSchema = zSchema.pick({
             email: true
             })
            
        const validatedData = validationSchema.safeParse(payload)
        if(!validatedData) {
            return response( false, 401, "Invalid or missing input field.", 
                validatedData.error
            )
        }

        const { email } = validatedData.data

        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean()

        if(!getUser) {
            
            return response( false, 404, "User not found" )
        }

         // remove old otps
            await OtpModel.deleteMany({email})
            const otp = generateOTP()
            const newOtpData = new OtpModel({
            email, otp
            })
            await newOtpData.save()
        
            const otpSendStatus = await sendMail("Your login verification code.", email, otpEmail(otp))
            if(!otpSendStatus.success){
                return response(false, 400, 'Failed to resend otp.')
            }
            return response(true, 200, "Pleace verify your account.");
        
        } catch (error) {
           return catchError(error)
        }
}