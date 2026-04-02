"use client"
import { Card, CardContent } from '@/components/ui/card';
import { use, useEffect, useState } from 'react'
import verifiedImg from '@/public/assets/images/verified.gif'
import verificationFailedImg from '@/public/assets/images/verification-failed.gif'
import Image from 'next/image';
import { WEBSITE_HOME } from '@/routes/WebsiteRoute';
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import axios from 'axios'
const EmailVerification = ({params}) => {
  const {token} = use(params)
  const [isVerified, setIsVerified] = useState(false);
  useEffect(() => {
    const verify = async () => {
      const { data: verificationResponse } =await axios.post('/api/auth/verify-email', { token })
    if(verificationResponse.success) {
      setIsVerified(true);
    } 
  }

    verify(); 
  }, [token]);

  return (
      <Card className='w-[400px]'>
        <CardContent>
          {isVerified ? (
            <div>
              <div className='flex items-center justify-center'>
              <Image src={verifiedImg} alt="Email verified" height={100} />
            </div>
            <div className='text-center'>
              <h1 className="text-2xl font-bold my-5 text-green-500">Email verified successfully!</h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
            </div>
          ) : (
            <div>
              <div className='flex items-center justify-center'>
              <Image src={verificationFailedImg} alt="Email verification failed" height={100} />
            </div>
            <div className='text-center'>
              <h1 className="text-2xl font-bold my-5 text-red-500">Email verification failed!</h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
            </div>
          )}
        </CardContent>
      </Card>
  )
}

export default EmailVerification