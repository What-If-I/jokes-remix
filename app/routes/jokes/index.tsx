import { LoaderFunction, useLoaderData, Link } from "remix";
import { GetRandomJokes, Joke } from "~/utils/db.server";

type LoaderData = { joke: Joke | null };
export const loader: LoaderFunction = async ({ params }) => {
  const jokes = await GetRandomJokes(10);
  const randomJokeNumber = Math.floor(Math.random() * jokes.length);

  const joke = jokes[randomJokeNumber];

  return { joke };
};

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's a random joke:</p>
      {data.joke ? (
        <div>
          <p>{data.joke.content}</p>
          <Link to={data.joke.id}>{data.joke.name} Permalink</Link>
        </div>
      ) : (
        <p>No joke for you :(</p>
      )}
    </div>
  );
}

export function ErrorBoundary() {
  return <div className="error-container">I did a whoopsies.</div>;
}
