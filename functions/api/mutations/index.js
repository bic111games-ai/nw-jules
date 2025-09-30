export async function onRequest(context) {
  const result = await fetch(`https://mutations.5con.club/api/http_trigger`)
    .then((it) => it.json())
    .then((it) => it.expeditions)
    .then((list) => list.map((it) => {
      return {
        expedition: it.expedition_id,
        element: it.mutation_id,
        promotion: it.promotion,
        curse: it.curse_name,
      }
    }))
  return new Response(JSON.stringify(result), {
    headers: {
      'cache-control': 'max-age=300, private',
      'content-type': 'application/json'
    }
  })
}
