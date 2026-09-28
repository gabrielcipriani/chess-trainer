const RATINGS = '1000';
const SPEEDS = 'blitz,rapid,classical';
const VARIANT = 'standard';

export default {
  async fetch(request: Request) {
    // get fen from browser request
    const url = new URL(request.url);
    const fen = url.searchParams.get('fen');

    // make lichess fetch request
    if (!fen) {
      return Response.json({ error: 'fen is required' }, { status: 400 });
    } else {
      const params = new URLSearchParams({
        fen: fen,
        ratings: RATINGS,
        speeds: SPEEDS,
        variant: VARIANT,
      });

      const explorerUrl = `https://explorer.lichess.org/lichess?${params}`;
      // private token
      const response = await fetch(explorerUrl, {
        headers: {
          Authorization: `Bearer ${process.env.LICHESS_TOKEN}`,
        },
      });

      // request failed
      if (!response.ok) {
        return Response.json(
          { error: `Lichess responded with ${response.status}` },
          { status: 502 },
        );
        // return explorer http response to browser
      } else {
        const data = await response.json();
        return Response.json(data);
      }
    }
  },
};
