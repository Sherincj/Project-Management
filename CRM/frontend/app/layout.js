// "use client"; // Mark this component as a client component

// import { Inter } from "next/font/google";
// import "./globals.css";
// import Sidebar from "./components/sidebar";
// import ConditionalHeader from "./components/ConditionalHeader"; 
// import { useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Cookies from 'js-cookie';

// const inter = Inter({ subsets: ["latin"] });

// export default function RootLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const accessToken = Cookies.get('access_token');
    
//     // Allow access to login and signup pages without redirection
//     if (!accessToken && !pathname.startsWith("/login") && !pathname.startsWith("/signup")) {
//       router.push("/login"); // Redirect to login if not authenticated and not on login/signup pages
//     }
//   }, [router, pathname]); // Add pathname to the dependency array

//   return (
//     <html lang="en" className={inter.className}>
//       <body className="bg-gray-100 flex">
//         {!pathname.startsWith("/signup") && !pathname.startsWith("/login") && (
//           <Sidebar />
//         )}
//         <div className="flex-1 flex flex-col">
//           <ConditionalHeader />
//           <main className="flex-grow p-6">
//             {children}
//           </main>
//         </div>
//       </body>
//     </html>
//   );
// }


"use client"; // Mark this component as a client component

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/sidebar";
import ConditionalHeader from "./components/ConditionalHeader"; 
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-100 flex">
        {/* Sidebar is displayed only if not on login or signup pages */}
        {!pathname.startsWith("/signup") && !pathname.startsWith("/login") && (
          <Sidebar />
        )}
        <div className="flex-1 flex flex-col">
          {/* ConditionalHeader is displayed only if not on login or signup pages */}
          {!pathname.startsWith("/signup") && !pathname.startsWith("/login") && (
            <ConditionalHeader />
          )}
          <main className="flex-grow p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
