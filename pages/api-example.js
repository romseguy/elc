import React, { Suspense } from "react";
import { atom, useAtom } from "jotai";
import Layout from "../components/layout";

const postId = atom(1);

const postData = atom(async (get) => {
  const id = get(postId);
  const response = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  );
  const data = await response.json();
  return data;
});

const PostId = () => {
  const [id, setId] = useAtom(postId);
  const next = () => setId((x) => x + 1);
  return (
    <div>
      id: {id} <button onClick={next}>Next</button>
    </div>
  );
};

const PostTitle = () => {
  const [data] = useAtom(postData);
  return (
    <div>
      <h1>{data.title}</h1>
      <a href={data.url}>{data.url}</a>
      <p>{data.text}</p>
    </div>
  );
};

export default function Page() {
  return (
    <Layout>
      {typeof window !== undefined && (
        <>
          <PostId />
          <Suspense fallback="Loading...">
            <PostTitle />
          </Suspense>
        </>
      )}

      <br />

      <h2>Session</h2>
      <p>/api/examples/session</p>
      <iframe src="/api/examples/session" />
      <h2>JSON Web Token</h2>
      <p>/api/examples/jwt</p>
      <iframe src="/api/examples/jwt" />
      <h2>user</h2>
      <p>/api/examples/oneuser</p>
      <iframe
        src="/api/examples/oneuser"
        border="1"
        width="100%"
        height="200px"
      />
    </Layout>
  );
}
