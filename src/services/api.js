// src/services/api.js
// API layer using Axios.
//
// CORS FIX: All requests go through /api/* which Vite proxies to
// https://backend.jotish.in/backend_dev/* — this runs server-side so
// the browser never makes a cross-origin request directly.

import axios from 'axios'

// Requests to /api/* are proxied by Vite to https://backend.jotish.in/backend_dev/*
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Mock fallback data ────────────────────────────────────────────────────
const MOCK_EMPLOYEES = [
  { id:1,  name:'James Anderson',   email:'james.a@corp.io',    phone:'+1-555-0101', designation:'Senior Engineer',    department:'Engineering',     salary:95000,  city:'New York',      state:'NY', country:'USA', joinDate:'2019-03-15' },
  { id:2,  name:'Sophia Martinez',  email:'sophia.m@corp.io',   phone:'+1-555-0102', designation:'Product Manager',    department:'Product',         salary:105000, city:'San Francisco', state:'CA', country:'USA', joinDate:'2018-07-22' },
  { id:3,  name:'Liam Thompson',    email:'liam.t@corp.io',     phone:'+1-555-0103', designation:'UX Designer',        department:'Design',          salary:82000,  city:'Austin',        state:'TX', country:'USA', joinDate:'2020-01-08' },
  { id:4,  name:'Emma Wilson',      email:'emma.w@corp.io',     phone:'+1-555-0104', designation:'Data Scientist',     department:'Analytics',       salary:110000, city:'Seattle',       state:'WA', country:'USA', joinDate:'2017-11-30' },
  { id:5,  name:'Noah Davis',       email:'noah.d@corp.io',     phone:'+1-555-0105', designation:'DevOps Engineer',    department:'Engineering',     salary:98000,  city:'Chicago',       state:'IL', country:'USA', joinDate:'2021-05-14' },
  { id:6,  name:'Olivia Brown',     email:'olivia.b@corp.io',   phone:'+1-555-0106', designation:'Marketing Lead',     department:'Marketing',       salary:88000,  city:'Boston',        state:'MA', country:'USA', joinDate:'2019-09-03' },
  { id:7,  name:'William Garcia',   email:'william.g@corp.io',  phone:'+1-555-0107', designation:'Backend Engineer',   department:'Engineering',     salary:92000,  city:'Denver',        state:'CO', country:'USA', joinDate:'2020-06-17' },
  { id:8,  name:'Ava Johnson',      email:'ava.j@corp.io',      phone:'+1-555-0108', designation:'QA Engineer',        department:'Engineering',     salary:78000,  city:'Portland',      state:'OR', country:'USA', joinDate:'2022-02-28' },
  { id:9,  name:'Ethan Lee',        email:'ethan.l@corp.io',    phone:'+1-555-0109', designation:'Frontend Engineer',  department:'Engineering',     salary:90000,  city:'Miami',         state:'FL', country:'USA', joinDate:'2021-10-11' },
  { id:10, name:'Isabella White',   email:'isabella.w@corp.io', phone:'+1-555-0110', designation:'HR Manager',         department:'Human Resources', salary:85000,  city:'Phoenix',       state:'AZ', country:'USA', joinDate:'2018-04-19' },
  { id:11, name:'Mason Harris',     email:'mason.h@corp.io',    phone:'+1-555-0111', designation:'Sales Director',     department:'Sales',           salary:120000, city:'Dallas',        state:'TX', country:'USA', joinDate:'2016-08-07' },
  { id:12, name:'Charlotte Clark',  email:'charlotte.c@corp.io',phone:'+1-555-0112', designation:'Finance Analyst',    department:'Finance',         salary:87000,  city:'Atlanta',       state:'GA', country:'USA', joinDate:'2020-03-23' },
  { id:13, name:'Henry Lewis',      email:'henry.l@corp.io',    phone:'+1-555-0113', designation:'Cloud Architect',    department:'Engineering',     salary:130000, city:'Seattle',       state:'WA', country:'USA', joinDate:'2015-06-30' },
  { id:14, name:'Amelia Walker',    email:'amelia.w@corp.io',   phone:'+1-555-0114', designation:'Content Strategist', department:'Marketing',       salary:75000,  city:'Nashville',     state:'TN', country:'USA', joinDate:'2021-11-15' },
  { id:15, name:'Lucas Hall',       email:'lucas.h@corp.io',    phone:'+1-555-0115', designation:'Security Engineer',  department:'Engineering',     salary:108000, city:'San Francisco', state:'CA', country:'USA', joinDate:'2019-08-20' },
]

// ─── Response normaliser ───────────────────────────────────────────────────
// Handles different field names the real API might use
function normaliseEmployee(emp, index) {
  return {
    id:          emp.id          ?? emp.emp_id    ?? emp.employee_id ?? emp.EmpId      ?? (index + 1),
    name:        emp.name        ?? emp.emp_name  ?? emp.EmpName     ?? emp.fullname   ?? emp.full_name ?? 'Unknown',
    email:       emp.email       ?? emp.emp_email ?? emp.Email       ?? '—',
    phone:       emp.phone       ?? emp.mobile    ?? emp.contact     ?? emp.Phone      ?? '—',
    designation: emp.designation ?? emp.role      ?? emp.position    ?? emp.Designation ?? '—',
    department:  emp.department  ?? emp.dept      ?? emp.Department  ?? emp.Dept       ?? '—',
    salary:      Number(emp.salary ?? emp.emp_salary ?? emp.Salary   ?? emp.sal        ?? 0),
    city:        emp.city        ?? emp.location  ?? emp.City        ?? emp.place      ?? '—',
    state:       emp.state       ?? emp.State     ?? '—',
    country:     emp.country     ?? emp.Country   ?? '—',
    address:     emp.address     ?? emp.Address   ?? '—',
    joinDate:    emp.join_date   ?? emp.joinDate  ?? emp.JoinDate    ?? emp.doj        ?? '—',
  }
}

// ─── Extract array from any response shape ─────────────────────────────────
function extractArray(data) {
  if (!data) return null
  if (Array.isArray(data) && data.length > 0) return data

  const keys = ['data', 'employees', 'result', 'results', 'records', 'rows', 'list', 'items']
  for (const key of keys) {
    if (Array.isArray(data[key]) && data[key].length > 0) return data[key]
  }
  // Double nested
  if (data.data && typeof data.data === 'object') {
    for (const key of keys) {
      if (Array.isArray(data.data[key]) && data.data[key].length > 0) return data.data[key]
    }
  }
  return null
}

// ─── Main fetch function ───────────────────────────────────────────────────
/**
 * Fetches employees. Falls back to mock data if:
 *  - API is unreachable / CORS blocked
 *  - Response is empty or unparseable
 * Returns { employees: Array, source: 'api' | 'mock' }
 */
export const fetchEmployees = async () => {
  try {
    const response = await apiClient.post('/gettabledata.php', {
      username: 'test',
      password: '123456',
    })

    console.log('[API] Raw response:', response.data)

    const raw = extractArray(response.data)

    if (raw && raw.length > 0) {
      const employees = raw.map(normaliseEmployee)
      console.log(`[API] Loaded ${employees.length} employees from real API`)
      return { employees, source: 'api' }
    }

    console.warn('[API] No usable data in response — using mock data')
    return { employees: MOCK_EMPLOYEES, source: 'mock' }

  } catch (err) {
    console.warn('[API] Request failed — using mock data:', err.message)
    return { employees: MOCK_EMPLOYEES, source: 'mock' }
  }
}
