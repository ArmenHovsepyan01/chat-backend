import { Document, Types } from 'mongoose';

export type User = Document<unknown, {}, { roomId: Types.ObjectId; userName: string }> & {
  roomId: Types.ObjectId;
  userName: string;
} & { _id: Types.ObjectId };
