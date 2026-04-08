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
import {z} from 'zod'
import { FaRegEyeSlash,FaRegEye } from 'react-icons/fa'
import Link from 'next/link'
import { WEBSITE_REGISTER } from '@/routes/WebsiteRoute'
import axios from 'axios'
import { showToast } from '@/lib/showTost'
import OTPVerification from '@/components/Application/OTPVerification'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authReducer'
const LoginPage = () => {
  const dispatch = useDispatch() 
  const formSchema = zSchema.pick({ email: true }).extend({password: z.string().min(3, 'Password is required')})
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [loading, setLoading] = useState(false)
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false)
  const [isTypePassword, setIsTypePassword] = useState(true)
  const [otpEmail, setOtpEmail] = useState('')
const handleLoginSubmit = async (values) => {
try {
      setLoading(true)
      const { data: loginResponse} = await axios.post("/api/auth/login", values)
      if(!loginResponse.success) {
        throw new Error(loginResponse.message)
      }

      setOtpEmail(values.email)
      form.reset()
      showToast('success', loginResponse.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
}

// otp verification
const handleotpVerification = async (values)=>{
  try {
      setOtpVerificationLoading(true)
      const { data: otpResponse} = await axios.post("/api/auth/verify-otp", values)
      if(!otpResponse.success) {
        throw new Error(otpResponse.message)
      }
      setOtpEmail("")
      showToast('success', otpResponse.message)

      dispatch(login(otpResponse.data))

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
                <h1 className='text-3xl font-bold'>Login Into Account</h1>
                <p>Login into your account by filling out the form below.</p>
            </div>
            <div className='mt-5'>
                <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
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
            <Controller
  name="password"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field >
      <FieldLabel htmlFor="password">Password</FieldLabel>
      <div className='relative'>
    <Input type={isTypePassword ? "password" : "text"} placeholder='Enter your password' id="password" {...field} />
    <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer' onClick={() => setIsTypePassword(!isTypePassword)}>
      {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
    </button>
    </div>
      {fieldState.error && (
        <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
      )}
    </Field>
  )}
/>
          </FieldSet>
        </FieldGroup>
        <ButtonLoading 
  type="submit" 
  text="Login"
    loading={loading}
//   onClick={form.handleSubmit(handleLoginSubmit)}
  className="w-full mt-4 cursor-pointer"
/>
<div className='text-center'>
  <div className='flex justify-center items-center gap-2 mt-2'>
  <p>Don't have an account?</p>
  <Link href={WEBSITE_REGISTER} className="text-primary underline">Register here</Link>
</div>
<div className='mt-2'>
  <Link href="" className="text-primary underline">Forgot password?</Link>
</div>
</div>
      </form>
            </div>
      </>
       : 
      <OTPVerification email={otpEmail} loading={otpVerificationLoading} onSubmit={handleotpVerification} />
      }
            
        </CardContent>
    </Card>
  )
}

export default LoginPage