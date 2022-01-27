import { v4 as uuidv4 } from "uuid";

const db = CF_STORAGE;

export type User = {
  username: string;
  passwordHash: string;
};

type NewJoke = {
  userID: string;
  name: string;
  content: string;
};

export type Joke = NewJoke & { id: string };

export async function GetUser(username: string): Promise<User | null> {
  const user = await db.get(`user:${username}`);
  if (!user) return null;

  return JSON.parse(user);
}

export async function SaveUser(user: User) {
  await db.put(`user:${user.username}`, JSON.stringify(user));
}

export async function GetJoke(id: string): Promise<Joke | null> {
  const joke = await db.get(`joke:${id}`);
  if (!joke) return null;

  return JSON.parse(joke);
}

export async function SaveJoke(joke: NewJoke): Promise<string> {
  const id = uuidv4();
  const dbJoke = { ...joke, id };
  await db.put(`joke:${id}`, JSON.stringify(dbJoke));
  return id;
}

export async function DeleteJoke(id: string) {
  await db.delete(`joke:${id}`);
}

export async function GetRandomJokes(limit: number): Promise<Joke[]> {
  var jokeIDs = await db.list({ prefix: "joke:", limit: limit });

  
  const jokes: Joke[] = [];
  const jokesSeen = new Set<string>(); 
  for (const key of jokeIDs.keys) {
    if (jokesSeen.has(key.name)) continue;
    jokesSeen.add(key.name);

    const joke = await db.get(key.name);
    if (!joke) continue;
    
    const parsedJoke = JSON.parse(joke);
    jokes.push(parsedJoke);
  }
  
  return jokes;
}
