export interface AdminUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin';
  createdAt: string;
}

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'admin-001',
    email: 'admin@recipick.com',
    password: 'admin123!',
    name: '관리자',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];