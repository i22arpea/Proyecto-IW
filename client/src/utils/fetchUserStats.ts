// Change from named export to default export
export default async function fetchUserStats(token: string) {
  const res = await fetch('/api/usuarios/estadisticas', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Error al obtener estadísticas del usuario');
  
  // Remove redundant 'await'
  return res.json();
}
