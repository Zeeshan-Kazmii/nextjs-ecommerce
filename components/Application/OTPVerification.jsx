'use client'
import React, { useState } from 'react'
import ButtonLoading from './ButtonLoading'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { zSchema } from '@/lib/zodSchema'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldGroup, FieldLabel, FieldSet } from '../ui/field'
import { showToast } from '@/lib/showTost'
import axios from 'axios'

const OTPVerification = ({email, onSubmit, loading}) => {
  const [isResendingOtp, setIsResendingOtp] = useState(false)
    const formSchema = zSchema.pick({ 
        otp: true, email:true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
            email: email
        },
    })

    const handleOtpVerification = async (values) => {
      onSubmit(values)
    }

    const resendOTP =async ()=>{
      try {
      setIsResendingOtp(true)
      const { data: resendOtpResponse} = await axios.post("/api/auth/resend-otp",
        { email }
      )
      if(!resendOtpResponse.success) {
        throw new Error(resendOtpResponse.message)
      }

      showToast('success', resendOtpResponse.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setIsResendingOtp(false)
    }
}

  return (
    <div>
        <form onSubmit={form.handleSubmit(handleOtpVerification)}>
          <div className='text-center mb-6'>
            <h1 className='text-2xl font-bold mb-2'>Please complete verification</h1>
            <p className='text-sm text-gray-500'>We have sent an One-time Password (OTP) to your registered email address. The OTP is valid for 10 minutes only.</p>
          </div>
          
        <FieldGroup>
        <FieldSet>
         <Controller
    name="otp"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field>
      <div className='flex flex-col items-center gap-3 my-5'>
      <FieldLabel htmlFor="otp">One-time Password (OTP)</FieldLabel>
      <InputOTP maxLength={6} {...field}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
      {fieldState.error && (
        <p className="text-red-500 text-xs mt-1">
          {fieldState.error.message}
        </p>
      )}
      </div>
    </Field>
  )}
/>
          </FieldSet>
        </FieldGroup>
        <ButtonLoading 
  type="submit" 
  text="Verify OTP"
    loading={loading}
  className="w-full mt-4 cursor-pointer"
/>
{!isResendingOtp ?
<p className="text-center text-sm text-gray-500 mt-3">
      Didn't receive OTP? <button type="button" onClick={resendOTP} className="text-primary cursor-pointer hover:underline">Resend</button>
    </p>
    :
<span className='text-md'> Resending...</span>
}
      </form>
    </div>
  )
}

export default OTPVerification