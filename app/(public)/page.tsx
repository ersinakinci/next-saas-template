import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="prose mx-auto mt-24">
      <h1>Welcome to Ersin's SaaS template</h1>
      <p>
        <Link href="https://github.com/ersinakinci/next-saas-template">
          Documentation
        </Link>
      </p>
      <h2>Next steps</h2>
      <ul>
        <li>Create a new home page in Builder.io and delete this page.</li>
      </ul>
    </main>
  );
}
