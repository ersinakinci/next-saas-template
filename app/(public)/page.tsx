import Link from "next/link";

export default function Home() {
  return (
    <main className="prose mx-auto mt-24 px-8">
      <h1>Welcome to Acme Inc.</h1>
      <p>
        <Link href="https://github.com/ersinakinci/next-saas-template">
          Documentation
        </Link>
      </p>
      <h2>Next steps</h2>
      <ul>
        <li>Create a new home page in Builder.io and delete this page.</li>
        <li>
          Add <Link href="/terms-of-service">terms of service</Link> and{" "}
          <Link href="/privacy-policy">privacy policy</Link> pages.
        </li>
        <li>
          Search for <code>Acme Inc.</code> and replace it with your company
          name.
        </li>
      </ul>
    </main>
  );
}
