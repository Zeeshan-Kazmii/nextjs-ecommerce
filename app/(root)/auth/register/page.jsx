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
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'
import { register } from 'next/dist/next-devtools/userspace/pages/pages-dev-overlay-setup'
import axios from 'axios'
import { showToast } from '@/lib/showTost'
const RegisterPage = () => {
    const formSchema = zSchema.pick({ name: true, email: true, password: true }).extend({
        confirmPassword: z.string()})
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        });
    const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const [loading, setLoading] = useState(false)
  const [isTypePassword, setIsTypePassword] = useState(true)

const handleRegisterSubmit = async (values) => {
    try {
      setLoading(true)
      const { data: registerResponse} = await axios.post("/api/auth/register", values)
      if(!registerResponse.success) {
        throw new Error(registerResponse.message)
      }
      form.reset()
      showToast('success', registerResponse.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
}

  return (
    <Card className="w-[400px]">
        <CardContent>
            <div className="flex justify-center">
<Image src={Logo} alt="logo" className="max-w-[150px]" />
      </div>
            <div className='text-center'>
                <h1 className='text-3xl font-bold'>Create Account</h1>
                <p>Create a new account by filling out the form below.</p>
            </div>
            <div className='mt-5'>
                <form onSubmit={form.handleSubmit(handleRegisterSubmit)}>
        <FieldGroup>
          <FieldSet>
    <Controller
    name="name"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field>
      <FieldLabel htmlFor="name">Full Name</FieldLabel>
      <Input
        type="text"
        placeholder="John Doe"
        id="name"
        {...field}
      />
    </Field>
  )}
/>
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
    <Input type="password" placeholder='Enter your password' id="password" {...field} />
    
    </div>
      {fieldState.error && (
        <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
      )}
    </Field>
  )}
/>
            <Controller
  name="confirmPassword"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field >
      <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
      <div className='relative'>
    <Input type={isTypePassword ? "password" : "text"} placeholder='Enter your password' id="confirmPassword" {...field} />
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
  text="Create Account"
    loading={loading}
//   onClick={form.handleSubmit(handleLoginSubmit)}
  className="w-full mt-4 cursor-pointer"
/>
<div className='text-center'>
  <div className='flex justify-center items-center gap-2 mt-2'>
  <p>Already have an account?</p>
  <Link href={WEBSITE_LOGIN} className="text-primary underline">Login here</Link>
</div>
</div>
      </form>
            </div>
        </CardContent>
    </Card>
  )
}


export default RegisterPage