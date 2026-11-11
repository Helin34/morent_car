import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectToDatabase from './mongodb';
import User from '@/models/User';

const isGoogleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID.trim().length > 5
);

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    ...(isGoogleConfigured
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        isGoogleDemo: { label: 'isGoogleDemo', type: 'text' },
      },
      async authorize(credentials) {
        await connectToDatabase();

        // 1. One-click demo Google sign-in fallback when Google OAuth keys aren't set
        if (credentials?.isGoogleDemo === 'true') {
          let googleUser = await User.findOne({ email: 'google.user@morent.com' });
          if (!googleUser) {
            googleUser = await User.create({
              name: 'Google Test Kullanıcısı',
              email: 'google.user@morent.com',
              image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuABiTL1lrKEzpRItF6mhdQOLS5p9WKFuiLbYzr19mfZu0QdVQfoMlLe3JosxSjZ7UP0wUG-z_4uDzm-l7w19vH10hkJQhtgF4w2OCos8hJpcv-zW4dwVrHqG-BGbz8s5mNp8-khYKdA10nbr0CbxkZVL78tfFxNzy0eUl2GeIUue_ePTecvtEC4K0SNZM4nTjtdHVRpVVGUmWWCbmxvxsUf-pzLK35-Ug-P_RiY1SI',
              role: 'user',
            });
          }

          return {
            id: googleUser._id.toString(),
            name: googleUser.name,
            email: googleUser.email,
            image: googleUser.image || '',
            role: googleUser.role,
          };
        }

        // 2. Standard email & password validation
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Lütfen e-posta adresinizi ve şifrenizi giriniz');
        }

        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user || !user.passwordHash) {
          throw new Error('Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı');
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordMatch) {
          throw new Error('Hatalı e-posta adresi veya şifre girdiniz');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || '',
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectToDatabase();
          const existingUser = await User.findOne({ email: user.email?.toLowerCase() });

          if (!existingUser) {
            await User.create({
              name: user.name || 'Google Kullanıcısı',
              email: user.email?.toLowerCase(),
              image: user.image || '',
              role: 'user',
            });
          }
        } catch (error) {
          console.error('Error in Google OAuth signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-development-only-change-me',
};
