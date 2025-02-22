import bcrypt from "bcryptjs";

export default function saltAndHashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10); // Generate a salt
    return bcrypt.hashSync(password, salt); // Hash the password with the salt
}
