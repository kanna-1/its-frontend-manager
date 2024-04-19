import { getApiDocs } from "@/lib/swagger";
import React from "react";
import ReactSwagger from "./react-swagger";

export default async function IndexPage(): Promise<React.JSX.Element> {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
