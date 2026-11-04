import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics: any = {
    env: {
      MONGODB_URI: process.env.MONGODB_URI ? 'SET (Hidden)' : 'MISSING',
      AUTH_SECRET: process.env.AUTH_SECRET ? 'SET (Hidden)' : 'MISSING',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET (Hidden)' : 'MISSING',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
      NODE_ENV: process.env.NODE_ENV,
    },
    database: {
      status: 'Connecting...',
      connectionState: mongoose.connection.readyState,
    },
  };

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }

    // Try to connect manually to get detailed error
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      connectTimeoutMS: 10000, // 10s timeout
    });

    diagnostics.database.status = 'SUCCESS';
    diagnostics.database.connectionState = mongoose.connection.readyState;

    const userCount = await User.countDocuments();
    diagnostics.database.userCount = userCount;

    const testUser = await User.findOne({ email: 'xemrex1999@hotmail.com' });
    diagnostics.database.testUserExists = !!testUser;
    if (testUser) {
      diagnostics.database.testUserHasPassword = !!testUser.password;
      diagnostics.database.testUserRole = testUser.role;
    }

  } catch (error: any) {
    diagnostics.database.status = 'FAILED';
    diagnostics.database.error = error.message;
    diagnostics.database.stack = error.stack;
  }

  return NextResponse.json(diagnostics);
}
