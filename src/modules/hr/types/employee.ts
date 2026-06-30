export type EmployeeStatus = 'active' | 'on_leave' | 'terminated'

export type Employee = {
  id: string
  name: string
  email: string
  department: string
  position: string
  status: EmployeeStatus
  createdAt: string
  updatedAt: string
}