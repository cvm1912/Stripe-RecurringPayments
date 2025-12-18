import bcrypt from 'bcrypt'

export const hashPassword = async (password) => {
   if (!password) {
    throw new Error("Password is required for hashing");
  }

  const saltRound = 10;
  const hashedPassword = await bcrypt.hash(password, saltRound);
  return hashedPassword;

}

// compare plain password with hashed password
export const comparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) {
    throw new Error("Both password and hashedPassword are required for comparison");
  }
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}