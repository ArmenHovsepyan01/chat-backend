import crypto from 'crypto';
import { ObjectId } from 'mongodb';

export function generateAdminMessage(userName: string, roomId: ObjectId) {
  return {
    _id: crypto.randomUUID(),
    message: `${userName} joined room`,
    roomId,
    user: {
      userName: 'Admin',
      _id: crypto.randomUUID()
    },
    createdAt: new Date()
  };
}
