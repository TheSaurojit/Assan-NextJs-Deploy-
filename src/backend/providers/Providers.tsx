import React, { JSX } from 'react';
import { AuthProvider } from '../context/AuthContext';

export function withAuthProvider<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  return function WithAuthProvider(props: P) {
    return (
      <AuthProvider>
        <WrappedComponent {...props} />
      </AuthProvider>
    );
  };
}
