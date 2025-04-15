import { LoginOptions } from "@/components/login-options"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to TTconnect</h1>
          <p className="text-gray-600">Connect brands and suppliers to reduce risk and optimize supply chains</p>
        </div>
        <LoginOptions />
      </div>
    </main>
  )
}
