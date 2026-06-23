export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET missing');
}
