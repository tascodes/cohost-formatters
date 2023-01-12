import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";

const FormatterLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="relative h-full w-full">
      <div className="mx-auto max-w-7xl px-4 text-slate-700 dark:text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">{children}</div>
      </div>
      <div className="mx-auto mb-8 mt-16 w-fit text-sm">
        Made by{" "}
        <Link href="https://cohost.org/tas">
          <a className="text-blue-500">@tas</a>
        </Link>
      </div>
      <div className="mx-auto mb-4 w-fit sm:absolute sm:right-16 sm:top-8">
        <Link href="https://github.com/tascodes/cohost-formatters">
          <a>
            <Image src="/github-mark.svg" width={32} height={32} alt="" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default FormatterLayout;
