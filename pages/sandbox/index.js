import { getSession } from "next-auth/client";
import { useObserver, observer } from "mobx-react-lite";
import { initializeStore, useStore, getSnapshot } from "tree";
import { AccessDenied, Layout, StyledTable } from "components";
import { Button, useColorMode } from "@chakra-ui/react";

const Counter = observer(() => {
  const { counter } = useStore();

  return (
    <div className="mt-20 flex flex-col items-center">
      <p className="font-bold text-2xl text-center">Counter</p>
      <p
        style={{ fontVariant: "tabular-nums" }}
        className="font-bold text-2xl text-center"
      >
        {counter.count}
      </p>
      <div className="mt-2 flex-row">
        <Button label="-" onClick={counter.decrement}>
          -
        </Button>
        <Button className="ml-2" label="+" onClick={counter.increment}>
          +
        </Button>
      </div>
    </div>
  );
});

// This is an example of how to protect content using server rendering
export default function Page(props) {
  // const { session } = props;
  // // If no session exists, display access denied message
  // if (!session) {
  //   return (
  //     <Layout>
  //       <AccessDenied />
  //     </Layout>
  //   );
  // }

  // // If session exists, display content
  // return (
  //   <Layout>
  //     <h1>Protected Page</h1>
  //     <p>
  //       <strong>{content}</strong>
  //     </p>
  //   </Layout>
  // );

  // return (
  //   <Layout>
  //     <Counter />
  //   </Layout>
  // );

  return (
    <Layout>
      <StyledTable css={{ background: "red", width: "100%" }}>
        <thead>
          <tr>
            <td>test</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>test</td>
          </tr>
        </tbody>
      </StyledTable>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // const session = await getSession(context);

  // let content = null;

  // if (session) {
  //   const hostname = process.env.NEXTAUTH_URL || "http://localhost:3000";
  //   const options = { headers: { cookie: context.req.headers.cookie } };
  //   const res = await fetch(`${hostname}/api/examples/protected`, options);
  //   const json = await res.json();
  //   if (json.content) {
  //     content = json.content;
  //   }
  // }

  // const store = initializeStore({ counter: { count: 1 } });
  // const snapshot = getSnapshot(store);

  return {
    props: {
      // snapshot
      // session,
      // content,
    }
  };
}
