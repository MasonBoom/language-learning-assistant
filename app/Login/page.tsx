"use client";
import Link from "next/link";

export default function Login() {
  const fieldStyles =
    "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 duration-300";

  return (
    <main className="flex justify-center items-center h-screen bg-blue-500">
      <div className="w-full max-w-lg px-8 py-8 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">
          Login to LingoListen AI
        </h3>
        <form action="#" className="mt-4">
          <div>
            <label className="block" htmlFor="Email">
              Email
            </label>
            <input type="email" placeholder="Email" className={fieldStyles} />
          </div>
          <div className="mt-4">
            <label className="block">Password</label>
            <input
              type="password"
              placeholder="Password"
              className={fieldStyles}
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <button className="px-6 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-400 hover:shadow-sky-900 hover:shadow-md duration-300">
              Log In
            </button>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="text-center mt-4">
            <Link
              href="/SignUp"
              className="text-sm text-blue-600 hover:underline"
            >
              Don't have an account? Sign Up
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { auth } from "@/auth"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { SignIn, SignOut } from "@/components/auth-components"

// export default async function Login() {
//   const session = await auth()
//   if (!session?.user) return <SignIn />
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="relative w-8 h-8 rounded-full">
//           <Avatar className="w-8 h-8">
//             {session.user.image && (
//               <AvatarImage
//                 src={session.user.image}
//                 alt={session.user.name ?? ""}
//               />
//             )}
//             <AvatarFallback>{session.user.email}</AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56" align="end" forceMount>
//         <DropdownMenuLabel className="font-normal">
//           <div className="flex flex-col space-y-1">
//             <p className="text-sm font-medium leading-none">
//               {session.user.name}
//             </p>
//             <p className="text-xs leading-none text-muted-foreground">
//               {session.user.email}
//             </p>
//           </div>
//         </DropdownMenuLabel>
//         <DropdownMenuItem>
//           <SignOut />
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
