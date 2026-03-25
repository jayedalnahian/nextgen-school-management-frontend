import NavbarWrapper from "@/components/landing/NavbarWrapper";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarWrapper />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default CommonLayout;