'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { EmployeeForm } from '@/modules/hr/components/EmployeeForm'
import { fetchEmployeeById } from '@/modules/hr/api/employeeApi'
import { Employee } from '@/modules/hr/types'

export default function EditEmployeePage() {
  const { id } = useParams()
  const router = useRouter()

  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEmployee() {
      if (!id) return

      const data = await fetchEmployeeById(id as string)

      if (!data) {
        router.push('/hr')
        return
      }

      setEmployee(data)
      setLoading(false)
    }

    loadEmployee()
  }, [id, router])

  if (loading) {
    return <p className="p-4">Loading employee...</p>
  }

  if (!employee) {
    return <p className="p-4">Employee not found</p>
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Edit Employee
      </h1>

      <EmployeeForm
        mode="edit"
        initialData={employee}
      />
    </div>
  )
}