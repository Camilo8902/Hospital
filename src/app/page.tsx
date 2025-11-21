'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Layout } from '@/components/Layout'

export default function Home() {
  const session = useSession()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ patients: 0, users: 0, appointments: 0 })

  useEffect(() => {
    if (!session) {
      router.push('/login')
      return
    }

    const getUserProfile = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching user profile:', error)
          // If user profile doesn't exist, create it
          if (error.code === 'PGRST116') { // No rows returned
            const { data: newProfile, error: insertError } = await supabase
              .from('users')
              .insert({
                auth_id: session.user.id,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                role: 'nurse' // Default role
              })
              .select()
              .single()

            if (insertError) {
              console.error('Error creating user profile:', insertError)
              setUser({ name: 'User', role: 'user' })
            } else {
              setUser(newProfile)
            }
          } else {
            setUser({ name: 'User', role: 'user' })
          }
        } else {
          setUser(profile)
        }
      } catch (error) {
        console.error('Error in getUserProfile:', error)
        setUser({ name: 'User', role: 'user' })
      }
    }

    const fetchStats = async () => {
      try {
        const [patientsRes, usersRes, appointmentsRes] = await Promise.all([
          supabase.from('patients').select('id', { count: 'exact', head: true }),
          supabase.from('users').select('id', { count: 'exact', head: true }),
          supabase.from('appointments').select('id', { count: 'exact', head: true })
        ])

        setStats({
          patients: patientsRes.count || 0,
          users: usersRes.count || 0,
          appointments: appointmentsRes.count || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Fallback for build time
        setStats({ patients: 0, users: 0, appointments: 0 })
      }
    }

    getUserProfile()
    fetchStats()
  }, [session, router, supabase])

  if (!session || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Patients</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.patients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">👤</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
                <p className="text-3xl font-bold text-green-600">{stats.users}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Appointments</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.appointments}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Patients</h3>
              <p className="text-sm text-gray-600">Manage patient records</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Medical Records</h3>
              <p className="text-sm text-gray-600">View and manage records</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Appointments</h3>
              <p className="text-sm text-gray-600">Schedule and manage</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Users</h3>
              <p className="text-sm text-gray-600">Manage staff accounts</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
