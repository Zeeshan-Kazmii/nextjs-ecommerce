'use client'
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import Logo from '@/public/assets/images/logo-black.png'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { zSchema } from '@/lib/zodSchema'
import { useForm, Controller } from 'react-hook-form'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/Application/ButtonLoading'
import Link from 'next/link'
import { WEBSITE_LOGIN} from '@/routes/WebsiteRoute'
import axios from 'axios'
import { showToast } from '@/lib/showTost'
import OTPVerification from '@/components/Application/OTPVerification'
import UpdatePassword from '@/components/Application/UpdatePassword'


const ResetPassword = () => {
    const [emailVerificationLoading, setEmailVerificationLoading] = useState(false)
    const [otpVerificationLoading, setOtpVerificationLoading] = useState(false)
    const [otpEmail, setOtpEmail] = useState('')
    const [isOtpVerified, setIsOtpVerified] = useState(false)
    const formSchema = zSchema.pick({ 
        email: true
     })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const handleEmailVerification = async (values) => {
 try {
      setEmailVerificationLoading(true)
      const { data: sendOtpResponse } = await axios.post("/api/auth/reset-password/send-otp", values)
      if(!sendOtpResponse.success) {
        throw new Error(sendOtpResponse.message)
      }
      setOtpEmail(values.email)
      showToast('success', sendOtpResponse.message)

    } catch (error) {
      showToast('error', error.message)
    } finally {
      setEmailVerificationLoading(false)
    }
    }

    // otp verification
const handleotpVerification = async (values)=>{
  try {
      setOtpVerificationLoading(true)
      const { data: otpResponse} = await axios.post("/api/auth/reset-password/verify-otp", values)
      if(!otpResponse.success) {
        throw new Error(otpResponse.message)
      }
      showToast('success', otpResponse.message)
      setIsOtpVerified(true)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setOtpVerificationLoading(false)
    }
}
  return (
    <Card className="w-[400px]">
        <CardContent>
            <div className="flex justify-center">
<Image src={Logo} alt="logo" className="max-w-[150px]" />
      </div>
      {!otpEmail 
      ? 
      <>
      <div className='text-center'>
                <h1 className='text-3xl font-bold'>Reset Password</h1>
                <p>Enter your email to reset your password.</p>
            </div>
            <div className='mt-5'>
                <form onSubmit={form.handleSubmit(handleEmailVerification)}>
        <FieldGroup>
          <FieldSet>
    <Controller
    name="email"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input
        type="email"
        placeholder="example@gmail.com"
        id="email"
        {...field}
      />
      {fieldState.error && (
        <p className="text-red-500 text-xs mt-1">
          {fieldState.error.message}
        </p>
      )}
    </Field>
  )}
/>
          </FieldSet>
        </FieldGroup>
        <ButtonLoading 
  type="submit" 
  text="Send OTP"
    loading={emailVerificationLoading}
//   onClick={form.handleSubmit(handleLoginSubmit)}
  className="w-full mt-4 cursor-pointer"
/>
<div className='text-center'>
  <div className='flex justify-center items-center gap-2 mt-2'>
  <Link href={WEBSITE_LOGIN} className="text-primary underline">Back To Login</Link>
</div>
</div>
      </form>
            </div>
      </>
       : 
       <>
       {!isOtpVerified
       ?
       <OTPVerification email={otpEmail} loading={otpVerificationLoading} onSubmit={handleotpVerification} />
       :
         <UpdatePassword email={otpEmail} />
    }
      </>
      }
            
        </CardContent>
    </Card>
  )
}

export default ResetPassword