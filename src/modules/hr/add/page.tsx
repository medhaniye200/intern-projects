'use client'

import { EmployeeForm } from '@/modules/hr/components/EmployeeForm'

export default function AddEmployeePage() {
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Add Employee
      </h1>

      <EmployeeForm mode="create" />
    </div>
  )
}