const fetchUserStats = async (token: string) => {
  const res = await fetch('/api/usuarios/estadisticas', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Error al obtener estadísticas del usuario');
  return res.json();
};

export default fetchUserStats;
