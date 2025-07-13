import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/images/logo.svg"
      alt="aixbiz"
      width={80}
      height={35}
      className="h-9 w-auto"
    />
  );
}