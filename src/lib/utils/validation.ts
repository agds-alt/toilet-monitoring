// src/lib/utils/validation.ts
// import { Assessments } // Unused for now from '@/core/types/interfaces';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Password minimal 6 karakter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password harus mengandung huruf besar');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password harus mengandung huruf kecil');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password harus mengandung angka');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
// ============================================================================
// END UTILITIES
// ============================================================================
