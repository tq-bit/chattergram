import { Static, Type } from '@sinclair/typebox';

export const UserSchema = Type.Object({
  id: Type.String(),
  email: Type.String({ format: 'email' }),
  username: Type.String(),
  bio: Type.String(),
  avatar: Type.String(),
});

export const PublicFileSchema = Type.Object({
  uuid: Type.String({ format: 'uuid' }),
  name: Type.String(),
  mimetype: Type.String(),
});

export const UserPublicSchema = Type.Object({
  id: Type.String(),
  username: Type.String(),
  bio: Type.String(),
  avatar: Type.String(),
  online: Type.Boolean(),
});

export const UserChatSchema = Type.Object({
  senderId: Type.Number(),
  receiverId: Type.Number(),
  audioFile: Type.Optional(PublicFileSchema),
  text: Type.String(),
  confidence: Type.Optional(Type.Number()),
});

export const UserChatResponseSchema = Type.Object({
  senderId: Type.Number(),
  receiverId: Type.Number(),
  dateSent: Type.String({ format: 'datetime' }),
  audioFile: Type.Optional(Type.String()),
  audioFileUuid: Type.Optional(Type.String()),
  audioFileName: Type.Optional(Type.String()),
  audioFileMimetype: Type.Optional(Type.String()),
  text: Type.String(),
  confidence: Type.Optional(Type.Number()),
});

export const UserUploadResponseSchema = Type.Object({
  files: Type.Array(PublicFileSchema),
});

export const SignupFormSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  username: Type.String(),
  password: Type.String({ minLength: 8 }),
});

export const LoginFormSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
});

export const LoginResponseSchema = Type.Object({
  user: UserSchema,
  token: Type.String(),
});

export type UserSchemaType = Static<typeof UserSchema>;
export type UserPublicSchemaType = Static<typeof UserPublicSchema>;

export type UserChatSchemaType = Static<typeof UserChatSchema>;
export type UserChatResponseSchemaType = Static<typeof UserChatResponseSchema>;

export type SignupFormSchemaType = Static<typeof SignupFormSchema>;
export type LoginFormSchemaType = Static<typeof LoginFormSchema>;
export type LoginResponseSchemaType = Static<typeof LoginResponseSchema>;

export const StaticSecuritySchema = [
  {
    'x-api-key': [],
  },
];
