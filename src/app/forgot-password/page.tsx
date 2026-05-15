'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowLeft, AlertCircle, Send } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    
    // Simulate API call - Replace with actual API endpoint
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Check if email exists (mock logic)
      if (email === 'admin@odisharide.com') {
        setMessage('Password reset link has been sent to your email address')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError('No account found with this email address')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>

        {/* Forgot Password Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Forgot Password?</h2>
              <p className="text-sm text-slate-500">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            {message && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">{message}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@odisharide.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    Send OTP
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                href="/login" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
              >
                Remember your password? Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-6">
        </div>
      </div>
    </div>
  )
}