import LeagueCards from "./LeagueCards";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <LeagueCards />
      <main>{children}</main>
    </>
  );
}
