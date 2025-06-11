import { renderHook } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe retornar null si no hay token en localStorage', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.token).toBeNull();
  });

  it('debe retornar el token guardado en localStorage', () => {
    localStorage.setItem('spotify_token', 'mock_token');
    const { result } = renderHook(() => useAuth());
    expect(result.current.token).toBe('mock_token');
  });
});