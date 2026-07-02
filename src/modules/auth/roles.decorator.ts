import { SetMetadata } from '@nestjs/common';

// หัวข้อ 2.9 Role-based Authorization: สร้าง Custom Decorator @Roles()
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
