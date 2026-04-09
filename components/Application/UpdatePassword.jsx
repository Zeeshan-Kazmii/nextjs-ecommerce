'use client'
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
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
import axios from 'axios'
import { showToast } from '@/lib/showTost'
import { useRouter } from 'next/navigation'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'
const UpdatePassword = ({email}) => {
    const router = useRouter()
    const formSchema = zSchema.pick({ email:true, password: true }).extend({
        confirmPassword: z.string()})
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        });
    const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      password: "",
      confirmPassword: "",
    },
  })

  const [loading, setLoading] = useState(false)
  const [isTypePassword, setIsTypePassword] = useState(true)

const handlePasswordUpdate = async (values) => {
    try {
      setLoading(true)
      const { data: passwordUpdate} = await axios.put("/api/auth/reset-password/update-password", values)
      if(!passwordUpdate.success) {
        throw new Error(passwordUpdate.message)
      }
      form.reset()
      showToast('success', passwordUpdate.message)
      router.push(WEBSITE_LOGIN)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
}

  return (
        <div>
            <div className='text-center'>
                <h1 className='text-3xl font-bold'>Update Password</h1>
                <p>Create a new password by filling below form.</p>
            </div>
            <div className='mt-5'>
                <form onSubmit={form.handleSubmit(handlePasswordUpdate)}>
        <FieldGroup>
          <FieldSet>

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
  text="Update Password"
    loading={loading}
//   onClick={form.handleSubmit(handleLoginSubmit)}
  className="w-full mt-4 cursor-pointer"
/>

      </form>
            </div>
        </div>
  )
}


export default UpdatePassword