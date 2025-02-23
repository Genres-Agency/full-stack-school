import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
         <h1 className="text-7xl font-bold text-blue-600">404</h1>
         <h2 className="text-2xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
         <p className="text-gray-600 mt-2 max-w-md">
            Oops! The page you are looking for does not exist or has been moved.
         </p>
         <Button asChild className="mt-6 flex items-center gap-2">
            <Link href="/">
               <ArrowLeft size={20} /> Return Home
            </Link>
         </Button>
      </div>
   );
}
