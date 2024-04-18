import prisma from "@/lib/prisma";
import { PasswordResetToken } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const createPasswordResetToken = async (
  email: string
): Promise<PasswordResetToken> => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 2000);

  const token_found = await prisma.passwordResetToken.findFirst({
    where: { email },
  });

  if (token_found) {
    await prisma.passwordResetToken.delete({
      where: { id: token_found.id },
    });
  }

  const reset_token = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return reset_token;
};
