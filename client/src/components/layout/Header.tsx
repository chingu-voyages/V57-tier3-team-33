import { PBLogo } from "../brand";
import Menu from "../icons/menu";

const Header = () => {
  return (
    <header className="flex justify-between items-center pr-2">
      <section className="flex gap-1 items-center">
        <PBLogo height={64} />
      </section>
      <section className="">
        <Menu strokeWidth={2} />
      </section>
    </header>
  );
};

export default Header;
