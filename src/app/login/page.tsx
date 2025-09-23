"use client"
import { useState, Suspense } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from "lucide-react"

const schema = z.object({
  email: z.string().email("Veuillez entrer un email valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

type FormData = z.infer<typeof schema>

// Composant séparé pour gérer useSearchParams
function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get("callbackUrl") ?? "/admin/test"
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ 
    resolver: zodResolver(schema) 
  })
  
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: FormData) => {
    setError(null)
    const res = await signIn("credentials", { ...data, redirect: false, callbackUrl })
    
    if (res?.error) {
      setError("Identifiants invalides ou accès non autorisé.")
      return
    }
    
    router.push(res?.url ?? "/admin/test")
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header avec animation */}
      <div className="text-center mb-8 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4 shadow-lg animate-pulse">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Accès Administrateur
        </h1>
        <p className="text-gray-600">
          Connectez-vous pour accéder au panneau d'administration
        </p>
      </div>

      {/* Formulaire avec effet glassmorphism */}
      <div className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Champ Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Adresse email
            </Label>
            <div className="relative group">
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md"
                {...register("email")} 
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-left-2 duration-300">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Champ Mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Mot de passe
            </Label>
            <div className="relative group">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md"
                {...register("password")} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-left-2 duration-300">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Message d'erreur global */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 animate-in slide-in-from-top-2 duration-300">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Bouton de connexion */}
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Besoin d'aide ? Contactez l'administrateur système
        </p>
      </div>
    </div>
  )
}

// Composant principal avec Suspense
export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background avec gradient animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
      
      {/* Éléments décoratifs animés */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-20 w-20 h-20 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-20 h-20 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="w-4 h-4 text-blue-300 opacity-60" />
          </div>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <Suspense fallback={
          <div className="w-full max-w-md mx-auto">
            <div className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}