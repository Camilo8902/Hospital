'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', session.user.id)
          .single()

        setUser(profile)
      } catch (error) {
        console.error('Error fetching user profile:', error)
        // Fallback for build time
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
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Hospital Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.name}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium">Total Patients</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.patients}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium">Total Users</h3>
              <p className="text-3xl font-bold text-green-600">{stats.users}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium">Total Appointments</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.appointments}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/patients" className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
              Manage Patients
            </a>
            <a href="/users" className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600">
              Manage Users
            </a>
            <a href="/appointments" className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600">
              Appointments
            </a>
            <a href="/records" className="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600">
              Medical Records
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
