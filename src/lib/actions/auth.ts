'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getSupabaseServer() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value, {
            ...options,
            // Make sure the cookie can be read by client-side code
            httpOnly: false,
          })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete(name, {
            ...options,
            // Make sure the cookie can be read by client-side code
            httpOnly: false,
          })
        },
      },
    }
  )
}

export async function signIn(formData: FormData) {
  'use server'
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirectTo') as string

  const supabase = await getSupabaseServer()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect(redirectTo || '/')
}

export async function signOut() {
  'use server'

  const supabase = await getSupabaseServer()
  await supabase.auth.signOut()
  redirect('/auth/sign-in')
}

export async function signUp(formData: FormData) {
  'use server'

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  const supabase = await getSupabaseServer()

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  // Create profile after successful signup
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      {
        id: (await supabase.auth.getUser()).data.user?.id,
        first_name: firstName,
        last_name: lastName,
        email,
      },
    ])

  if (profileError) {
    return { error: profileError.message }
  }

  redirect('/auth/verify')
} 