
import { Employee } from '../types/employee'

const STORAGE_KEY = 'hr_employees'


const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))


const SEED_DATA: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    department: 'Engineering',
    position: 'Frontend Developer',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah@company.com',
    department: 'Human Resources',
    position: 'HR Manager',
    status: 'on_leave',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]


function readDb(): Employee[] {
  if (typeof window === 'undefined') return []

  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA))
    return SEED_DATA
  }

  return JSON.parse(raw)
}

function writeDb(data: Employee[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}


export async function fetchEmployees(): Promise<Employee[]> {
  await delay(400)
  return readDb()
}


export async function fetchEmployeeById(
  id: string
): Promise<Employee | undefined> {
  await delay(300)
  return readDb().find((emp) => emp.id === id)
}


export async function createEmployee(
  data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Employee> {
  await delay(400)

  const employees = readDb()

  const newEmployee: Employee = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  writeDb([...employees, newEmployee])

  return newEmployee
}


export async function updateEmployee(
  id: string,
  data: Partial<Employee>
): Promise<Employee> {
  await delay(400)

  const employees = readDb()

  const index = employees.findIndex((e) => e.id === id)

  if (index === -1) throw new Error('Employee not found')

  const updated = {
    ...employees[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  employees[index] = updated

  writeDb(employees)

  return updated
}


export async function deleteEmployee(id: string): Promise<void> {
  await delay(300)

  const employees = readDb()

  const filtered = employees.filter((e) => e.id !== id)

  writeDb(filtered)
}