import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="prose mx-auto max-w-3xl px-4 py-10 text-sm text-neutral-600">
        <div className="w-full grid gap-8 md:grid-cols-2">
          <div>
            <p className="font-medium text-neutral-900">
              Arduino Ressursside for IN1060 studenter
            </p>

            <p className="mt-2">
              Ressurser og eksempler for studenter som jobber med Arduino og
              fysisk interaksjon.
            </p>
          </div>

          <div>
            <p className="font-medium text-neutral-900">Kontakt</p>

            <div className="mt-2 space-y-1">
              <p>Gjermund Persson Myrvang</p>

              <p>
                Email: <a href="mailto:gjermupm@uio.no">gjermupm@uio.no</a>
              </p>

              <p>
                GitHub:{" "}
                <a href="https://github.com/gjermundmyrvang">
                  github.com/gjermundmyrvang
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs text-neutral-500 flex flex-col">
          <span>© {new Date().getFullYear()} Arduino Ressursside</span>
          <Link
            href="/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-xs text-neutral-400 hover:text-neutral-700"
          >
            Administrer siden
          </Link>
        </div>
      </div>
    </footer>
  );
}
