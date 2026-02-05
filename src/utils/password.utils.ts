import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

// Hashing  a password using bcrypt 

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS)
}

// Comparing a plain text password with a hashed password

export const comparePassword = async (
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword)
}