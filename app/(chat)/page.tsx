// pages/index.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from '@/lib/utils';
import { Chat } from '@/components/chat';
import { AI } from '@/lib/chat/actions';
import { auth } from '@/auth';
import { Session } from '@/lib/types';
import { getMissingKeys } from '@/app/actions';

export const metadata = {
  title: 'Next.js AI Chatbot'
}

export default function IndexPage({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();

  if (!isAuthenticated) {
    router.push('/login'); // Redirect to the login page if not authenticated
    return null; // Return null to prevent rendering the chatbot component
  }

  const [id] = useState(nanoid());
  const [session, setSession] = useState<Session | null>(null);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await auth();
      if (sessionData && sessionData.user) {
        setSession({
          user: {
            id: sessionData.user.id || '',
            email: sessionData.user.email || ''
          }
        });
      }
    };

    fetchSession();
  }, []);
  useEffect(() => {
    const fetchMissingKeys = async () => {
      const keys = await getMissingKeys();
      setMissingKeys(keys);
    };

    fetchMissingKeys();
  }, []);

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} session={session || undefined} missingKeys={missingKeys} />
    </AI>
  );
}
