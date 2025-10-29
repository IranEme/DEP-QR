import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchUserProfile(authUser) {
    if (!authUser) return null

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.id)
      .single()

    if (profileError) {
      console.warn(`No se pudo obtener el perfil para el usuario ${authUser.id}: ${profileError.message}`)
      return authUser
    }

    return { ...authUser, role: profile.role }
  }

  async function getSession() {
    try {
      loading.value = true
      const { data, error: supabaseError } = await supabase.auth.getSession()
      if (supabaseError) {
        throw supabaseError
      }
      if (data.session) {
        user.value = await fetchUserProfile(data.session.user)
      } else {
        user.value = null
      }
    } catch (e) {
      console.error('Error in getSession:', e.message)
      user.value = null
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function signIn(credentials) {
    loading.value = true
    error.value = null
    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword(credentials)
      if (supabaseError) throw supabaseError
      
      
      const fullUser = await fetchUserProfile(data.user)
      user.value = fullUser
      return fullUser
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function signUp(credentials) {
    loading.value = true
    error.value = null
    try {
      const { data, error: supabaseError } = await supabase.auth.signUp(credentials)
      if (supabaseError) throw supabaseError
      return data.user
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    loading.value = true
    error.value = null
    try {
      await supabase.auth.signOut()
      user.value = null
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function recoverPassword(email) {
    loading.value = true
    error.value = null
    try {
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password',
      })
      if (supabaseError) throw supabaseError
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const isAdmin = computed(() => user.value?.role === 'admin')

  return { user, loading, error, isAdmin, getSession, signIn, signUp, signOut, recoverPassword }
})
