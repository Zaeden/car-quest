import bcrypt from "bcrypt";

const hashPassword = async(password) => {
    try {
        const hashedPassword = bcrypt.hash(password, 12);
        return hashedPassword;
    }
    catch(error) {
        return `${error}`;
    }
}

const comparePassword = async(password, hash) => {
    try {
        const isPasswordMatching = bcrypt.compare(password, hash);
        return isPasswordMatching;
    }
    catch(error) {
        return `${error}`;
    }
}

export {hashPassword, comparePassword};