// "use client"; // Mark this component as a client component

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
// import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

// export default function Signup() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match"); // Show toast notification
//       return;
//     }

//     const response = await fetch('http://localhost:8000/signup', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
//     });

//     if (response.ok) {
//       setSuccess("Signup successful! You can now log in.");
//       toast.success("Signup successful! You can now log in."); // Show success toast
//       // Redirect to login page after a short delay
//       setTimeout(() => {
//         router.push("/login");
//       }, 2000);
//     } else {
//       const data = await response.json();
//       toast.error(data.detail || "Signup failed"); // Show error toast
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <ToastContainer /> {/* Include ToastContainer */}
//       <div className="max-w-md w-full p-5 bg-white border rounded shadow-lg">
//         <h1 className="text-2xl font-bold mb-4">Signup</h1>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//             className="w-full p-2 mb-2 border rounded"
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full p-2 mb-2 border rounded"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full p-2 mb-2 border rounded"
//           />
//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//             className="w-full p-2 mb-4 border rounded"
//           />
//           <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
//             Signup
//           </button>
//         </form>
//         {error && <p className="text-red-500">{error}</p>}
//         {success && <p className="text-green-500">{success}</p>}
//         <p className="mt-4 text-center">
//           Already have an account? 
//           <button onClick={() => router.push("/login")} className="text-blue-500 hover:underline"> Login</button>
//         </p>
//       </div>
//     </div>
//   );
// }