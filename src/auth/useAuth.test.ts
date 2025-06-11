import { renderHook } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth hook', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('debe retornar null si no hay token en sessionStorage', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.token).toBeNull();
  });

  it('debe retornar el token guardado en sessionStorage', () => {
    sessionStorage.setItem('spotify_token', 'mock_token');
    const { result } = renderHook(() => useAuth());
    expect(result.current.token).toBe('mock_token');
  });
});