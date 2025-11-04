import { type User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from 'supabase/supabase-client';




interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  userType: 'student' | 'staff' | null; // From schema: student/staff
  userRole: string | null; // e.g., 'porter', 'CSO' for staff
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<'student' | 'staff' | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Fetch user type/role from DB (e.g., query student/staff table)
        fetchUserDetails(session.user.id);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserDetails(session.user.id);
      else {
        setUserType(null);
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserDetails = async (userId: string) => {
    // Example: Query Supabase for student or staff
    const { data: student } = await supabase.from('student').select('id, hostel_id').eq('id', userId).single();
    if (student) {
      setUserType('student');
      setUserRole(null);
      return;
    }
    const { data: staff } = await supabase.from('staff').select('role, hostel_id').eq('id', userId).single();
    if (staff) {
      setUserType('staff');
      setUserRole(staff.role);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Refetch details after login
    const { data } = await supabase.auth.getUser();
    if (data.user) fetchUserDetails(data.user.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, userType, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};