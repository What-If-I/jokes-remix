import { Joke } from "@prisma/client";
import { Link } from "react-router-dom";
import { LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = { joke: Joke };
export const loader: LoaderFunction = async ({ params }) => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [joke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });

  return { joke };
};

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.joke.content}</p>
      <Link to={data.joke.id}>{data.joke.name} Permalink</Link>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      I did a whoopsies.
    </div>
  );
}