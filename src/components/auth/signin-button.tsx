import Link from "next/link";
import { Button } from "../ui/button";

 
export function SignIn() {
  return (
    <Link href="/auth/login">
      <Button className="btn btn-secondary" type="submit">Sign in</Button>
      </Link>
  )
}