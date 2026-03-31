import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ButtonLoading = ({type, text, loading, className, onClick=null, ...props}) => {
  return (
    <Button type={type} onClick={onClick} className={cn("",className)} disabled={loading} {...props}>
      {loading && 
       <Loader2 className="animate-spin"/>}
      {text}
    </Button>
  )
}

export default ButtonLoading