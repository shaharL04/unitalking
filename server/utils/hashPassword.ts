import bcrypt from 'bcrypt';

const saltRounds = 10;

const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

export default hashPassword;
