import SignIn from '@/components/auth/SignIn'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <>
      <SignIn />
      <Button variant={'destructive'}>destructive Button</Button>
      <Button variant={'ghost'}>ghost Button</Button>
      <Button variant={'link'}>link Button</Button>
      <Button variant={'outline'}>outline Button</Button>
      <Button variant={'secondary'}>secondary Button</Button>
    </>
  )
}