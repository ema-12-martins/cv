import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

interface PointsContextType {
  points: number;
  addPoints: (amount: number) => void;
  resetPoints: () => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [pointsMap, setPointsMap] = useState<Record<number, number>>({});

  const points = user ? pointsMap[user.id] || 0 : 0;

  const addPoints = (amount: number) => {
    if (!user) return;

    setPointsMap((prev) => {
        const newPoints = (prev[user.id] || 0) + amount;

        console.log(`User ${user.id} now has ${newPoints} points`);

        return {
        ...prev,
        [user.id]: newPoints,
        };
    });
    };


  const resetPoints = () => {
    if (!user) return;
    setPointsMap((prev) => ({
      ...prev,
      [user.id]: 0,
    }));
  };

  return (
    <PointsContext.Provider value={{ points, addPoints, resetPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) throw new Error('usePoints must be used within a PointsProvider');
  return context;
};
