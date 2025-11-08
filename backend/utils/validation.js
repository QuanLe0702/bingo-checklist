import { z } from "zod";

/**
 * Schema validation cho đăng ký
 */
export const registerSchema = z.object({
  username: z.string().min(3, "Username phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Password phải có ít nhất 6 ký tự"),
  displayName: z.string().optional(),
});

/**
 * Schema validation cho đăng nhập
 */
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Password không được để trống"),
});

/**
 * Schema validation cho Board
 */
export const boardSchema = z.object({
  title: z.string().min(1, "Title không được để trống"),
  description: z.string().optional(),
  size: z.object({
    rows: z.number().min(2).max(10),
    cols: z.number().min(2).max(10),
  }),
  cells: z.array(z.any()).optional(),
  theme: z.object({
    primary: z.string().optional(),
    bg: z.string().optional(),
    textColor: z.string().optional(),
    fontFamily: z.string().optional(),
  }).optional(),
});
