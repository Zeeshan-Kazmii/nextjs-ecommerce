import { zSchema } from "@/lib/zodSchema";
import { connectDB} from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { SignJWT } from "jose";
import { sendEmail } from "@/lib/sendMail";
export async function POST(request) {
    try {
        await connectDB();
        // validation schema
        const validationSchema = zSchema.pick({
            name: true,
            email: true,
            password: true,
        })
        const payload = await request.json();
        const validatedData = validationSchema.safeParse(payload);
        if(!validatedData.success){
            return response(false,401, 'Invalid or missing input field.', validatedData.error);
        }

        const {name, email, password} = validatedData.data;
        // check already registered user
        const CheckUser = await UserModel.exists({ email });
        if(CheckUser){
            return response(true,409, 'User already registered.');
        }
        // new registration

        const NewRegistration = new UserModel({
            name, email, password
        })
        await NewRegistration.save();
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = await new SignJWT({ userId: NewRegistration._id.toString() }).setIssuedAt().setExpirationTime('1h').setProtectedHeader({ alg: 'HS256' }).sign(secret);

        await sendEmail('Email Verification request from Zeeshan', email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`));
        return response(true,200, 'Registration successful. Please check your email to verify your email address.');

    } catch (error) {
     catchError(error);
    }
}