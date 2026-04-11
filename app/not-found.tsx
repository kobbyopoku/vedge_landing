import Link from "next/link";
import { Container } from "./_components/Container";
import { Kicker } from "./_components/Kicker";

export default function NotFound() {
  return (
    <section className="py-32 md:py-48">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Kicker>404 · Off the chart</Kicker>
          <h1 className="mt-8 font-display text-mega leading-none">
            That page is <span className="italic-display">not in the record.</span>
          </h1>
          <p className="mt-10 max-w-xl font-display text-xl text-ink/75">
            Either we moved it, or it never existed. Either way, we can get you back to the ward.
          </p>
          <div className="mt-12 flex gap-4">
            <Link href="/" className="btn-ink">Home →</Link>
            <Link href="/pricing" className="btn-ghost">See pricing →</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
